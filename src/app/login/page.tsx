'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F2F5EE' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A8F8A] mb-4">
            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>E</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1A2B3C]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            Emancia
          </h1>
          <p className="text-sm text-[#4A4A4A]/60 mt-1">Charte Graphique — Espace interne</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-[#E8E8E8]/50">
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-[#1A2B3C] mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@emancia.com"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E8E8] text-sm text-[#4A4A4A] placeholder:text-[#4A4A4A]/40 focus:outline-none focus:border-[#1A8F8A] focus:ring-1 focus:ring-[#1A8F8A]/20 transition-colors"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-[#1A2B3C] mb-1.5">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E8E8] text-sm text-[#4A4A4A] placeholder:text-[#4A4A4A]/40 focus:outline-none focus:border-[#1A8F8A] focus:ring-1 focus:ring-[#1A8F8A]/20 transition-colors"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#E05252]/10 text-[#E05252] text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#1A8F8A] text-white text-sm font-medium hover:bg-[#106C68] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-[#4A4A4A]/40 mt-6">
          Accès réservé à l'équipe Emancia
        </p>
      </div>
    </div>
  )
}
