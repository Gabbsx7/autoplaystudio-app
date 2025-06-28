'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function CompleteProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const email = searchParams.get('email')
  const inviteToken = searchParams.get('token')

  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteInfo, setInviteInfo] = useState<any>(null)

  useEffect(() => {
    if (!userId || !email || !inviteToken) {
      router.push('/auth/signup')
      return
    }

    // Simular dados do convite (implementar busca real depois)
    setInviteInfo({
      role: 'client_member',
      clientId: '550e8400-e29b-41d4-a716-446655440010',
      company: 'Molecule Agency',
    })
  }, [userId, email, inviteToken, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name) {
      setError('Please enter your name')
      return
    }

    setLoading(true)

    try {
      // 1. Criar registro na tabela users
      const { error: userError } = await supabase.from('users').insert({
        id: userId,
        email: email,
        name: formData.name,
        job_title: formData.jobTitle,
      })

      if (userError) throw userError

      // 2. Buscar role ID baseado no convite
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', inviteInfo.role)
        .single()

      if (roleError) throw roleError

      // 3. Criar entrada na client_users com dados do convite
      const { error: clientUserError } = await supabase
        .from('client_users')
        .insert({
          user_id: userId,
          client_id: inviteInfo.clientId,
          role_id: roleData.id,
          is_primary: inviteInfo.role.includes('admin'),
          created_by: userId, // Quem enviou o convite
        })

      if (clientUserError) throw clientUserError

      // Sucesso - redirecionar para dashboard (sistema determinará studio vs client)
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!userId || !email || !inviteToken) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen">
      {/* Lado esquerdo (formulário) */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-white">
        {/* Logo */}
        <div className="mb-10">
          <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Almost there!
          </h1>
          <p className="text-gray-500 mb-6">
            Just a few more details to complete your profile
          </p>

          {/* Invite confirmation */}
          {inviteInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>Joining {inviteInfo.company}</strong>
                <br />
                Role:{' '}
                {inviteInfo.role
                  .replace('_', ' ')
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                placeholder="e.g. Creative Director, Designer, Project Manager..."
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Setting up your account...' : 'Complete Setup'}
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By completing setup, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito (imagem) */}
      <div
        className="w-1/2 bg-cover bg-center hidden md:block relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
    </div>
  )
}
