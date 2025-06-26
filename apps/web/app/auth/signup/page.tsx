'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verificar se há um token de convite na URL
  const inviteToken = searchParams.get('token')
  const invitedEmail = searchParams.get('email')

  const [formData, setFormData] = useState({
    email: invitedEmail || '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteInfo, setInviteInfo] = useState<any>(null)

  useEffect(() => {
    // Se não há token de convite, mostrar mensagem
    if (!inviteToken) {
      setError(
        'You need an invitation to create an account. Please contact your admin.'
      )
      return
    }

    // Verificar se o convite é válido (implementar depois)
    // Por enquanto, simular dados do convite
    if (inviteToken && invitedEmail) {
      setInviteInfo({
        email: invitedEmail,
        role: 'client_member', // Viria do banco
        company: 'Molecule Agency', // Viria do banco
      })
    }
  }, [inviteToken, invitedEmail])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!inviteToken) {
      setError('Invalid invitation link')
      return
    }

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      if (data.user) {
        // Redirecionar para completar perfil com dados do convite
        router.push(
          `/auth/complete-profile?userId=${data.user.id}&email=${formData.email}&token=${inviteToken}`
        )
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Se não há convite válido
  if (!inviteToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 text-center">
          <div className="w-12 h-12 bg-black rounded flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">P</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Invitation Required
          </h1>

          <p className="text-gray-600 mb-8">
            You need an invitation from a Studio Admin or Client Admin to create
            an account.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-700">
              <strong>How to get access:</strong>
              <br />
              Contact your project manager or admin to send you an invitation
              link.
            </p>
          </div>

          <button
            onClick={() => router.push('/auth/login')}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
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
            Welcome to Autoplaystudio
          </h1>
          <p className="text-gray-500 mb-6">Complete your account setup</p>

          {/* Invite info */}
          {inviteInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700">
                <strong>
                  You've been invited to join {inviteInfo.company}
                </strong>
                <br />
                Role: {inviteInfo.role.replace('_', ' ')}
              </p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                disabled // Email vem do convite
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/auth/login"
                className="text-black font-medium hover:underline"
              >
                Sign in
              </a>
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
