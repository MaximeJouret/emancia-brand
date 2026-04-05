'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    <div className="min-h-screen w-full bg-bleu-nuit flex items-center justify-center relative overflow-hidden">
      {/* Background logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <Image
          src="/logos/logo-icon.svg"
          alt=""
          width={700}
          height={700}
          className="w-[700px] h-[700px] brightness-0 invert"
          priority
        />
      </div>

      {/* Gradient circles decoration */}
      <div className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-teal/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-prune/8 blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] right-[15%] w-[250px] h-[250px] rounded-full bg-sauge/5 blur-2xl pointer-events-none" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo + title */}
        <div className="text-center mb-8">
          <Image
            src="/logos/logo-icon.svg"
            alt="Emancia"
            width={56}
            height={56}
            className="mx-auto mb-5 brightness-0 invert"
            priority
          />
          <h1 className="font-display text-2xl font-semibold text-white mb-1">
            Emancia
          </h1>
          <p className="text-sm text-white/40">Charte Graphique — Espace interne</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@emancia.com"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1.5">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error/20 text-error text-sm border border-error/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">
          Accès réservé à l'équipe Emancia
        </p>
      </div>
    </div>
  )
}
