import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';
// Inicializa o cliente Supabase com Service Role Key para operações admin
const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
// CORS Headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey'
};
serve(async (req)=>{
  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }
  // Apenas POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: CORS_HEADERS
    });
  }
  // Parse do corpo
  let body;
  try {
    body = await req.json();
  } catch  {
    return new Response(JSON.stringify({
      error: 'Invalid JSON'
    }), {
      status: 400,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json'
      }
    });
  }
  const { email, metadata = {}, role, client_id } = body;
  if (!email || !role || !client_id) {
    return new Response(JSON.stringify({
      error: 'Campos "email", "role" e "client_id" são obrigatórios.'
    }), {
      status: 400,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json'
      }
    });
  }
  try {
    // 1️⃣ Cria usuário no Auth com senha padrão e confirma e-mail
    const defaultPassword = '12345678';
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: metadata
    });
    if (createError) {
      return new Response(JSON.stringify({
        error: createError.message
      }), {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json'
        }
      });
    }
    if (!createdUser || !createdUser.user || !createdUser.user.id) {
      throw new Error('Falha ao criar usuário no Auth: ID de usuário não retornado');
    }
    const userId = createdUser.user.id;
    // 2️⃣ Insere registro em public.users
    const publicUser = {
      id: userId,
      email
    };
    if (metadata.name) publicUser.name = metadata.name;
    if (metadata.job_title) publicUser.job_title = metadata.job_title;
    const { error: userError } = await supabaseAdmin.from('users').insert(publicUser, {
      returning: 'minimal'
    });
    if (userError) {
      throw new Error(`Erro ao inserir em public.users: ${userError.message}`);
    }
    // 3️⃣ Busca role_id pelo nome
    const { data: roleData, error: roleError } = await supabaseAdmin.from('roles').select('id').eq('name', role).single();
    if (roleError || !roleData) {
      throw new Error(`Role "${role}" não encontrada: ${roleError?.message || 'Nenhum dado retornado'}`);
    }
    // O passo 4 foi removido já que a tabela users_roles não existe mais.
    // O role_id será inserido diretamente na tabela client_users
    // 5️⃣ Insere na tabela client_users com o role_id
    const clientUserRecord = {
      client_id,
      user_id: userId,
      role_id: roleData.id
    };
    const { error: cuError } = await supabaseAdmin.from('client_users').insert(clientUserRecord, {
      returning: 'minimal'
    });
    if (cuError) {
      throw new Error(`Erro ao inserir em client_users: ${cuError.message}`);
    }
    // 6️⃣ Retorna o usuário criado com informações adicionais
    return new Response(JSON.stringify({
      user: createdUser.user,
      success: true,
      message: 'Usuário criado com sucesso e relação com cliente estabelecida'
    }), {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Captura erros em qualquer etapa do processo
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json'
      }
    });
  }
}); //create table public.client_users (
 //id uuid not null default gen_random_uuid(),
 //client_id uuid not null references public.clients(id),
 //user_id uuid not null references auth.users(id),
 //role_id uuid not null references public.roles(id),
 //created_at timestamp with time zone not null default now(),
 //constraint client_users_pkey primary key (id)
 //);
 /**
 * Exemplo de invocação via supabase-js:
 *
 * const { data, error } = await supabase.functions.invoke('inviteNewUsers', {
 *   body: {
 *     email: 'user@example.com',
 *     metadata: {
 *       name: 'Nome do Usuário', 
 *       job_title: 'Cargo do Usuário'
 *     },
 *     role: 'clientMember',
 *     client_id: '8a60ed9c-515e-4611-8f16-1a08ecd721fb'
 *   }
 * });
 *
 * Em seguida, utilize a ação "Sign in with Magic Link" no WeWeb para enviar o e-mail de login.
 */ 
