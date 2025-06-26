// app/page.tsx  (⟵ raiz do app router – server component!)
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * Lê a role “corrente” do usuário.
 * - Caso você já grave a role em `session.user.app_metadata.role`, basta ler daí.
 * - Caso use a tabela `public.roles`/`client_users`, trago um SELECT simples.
 */
async function getCurrentRole(userId: string, supabase: any) {
  // 👉  1) tente o app_metadata
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const metaRole = session?.user?.app_metadata?.role
  if (metaRole) return metaRole as string

  // 👉  2) tenta na tabela `client_users` → `roles`
  const { data, error } = await supabase
    .from('client_users')
    .select('roles(name)')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) console.error(error)
  return data?.roles?.name ?? 'guest'
}

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // ➜ não logado → login
  if (!session) redirect('/auth/login')

  const role = await getCurrentRole(session.user.id, supabase)

  // ➜ roteamento por role
  switch (role) {
    case 'studio_admin':
    case 'studio_member':
      return redirect('/dashboard/studio')

    case 'client_admin':
    case 'client_member':
    case 'guest':
      return redirect('/dashboard/client')

    default:
      return redirect('/auth/login')
  }
}
