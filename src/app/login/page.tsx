'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type AuthMode = 'login' | 'signup'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<AuthMode>('login')
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'viewer',
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen w-full bg-bleu-nuit flex items-center justify-center relative overflow-hidden dark-context">
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
        {/* Logo with baseline */}
        <div className="text-center mb-8">
          <Image
            src="/logos/logo-baseline.svg"
            alt="Emancia — Éducation Financière"
            width={280}
            height={80}
            className="mx-auto brightness-0 invert"
            priority
          />
        </div>

        {/* Form */}
        <form
          onSubmit={mode === 'login' ? handleLogin : handleSignup}
          className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          {/* Title */}
          <p className="text-white/60 text-sm text-center mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {mode === 'login' ? 'Connectez-vous à votre espace' : 'Créez votre compte'}
          </p>

          {mode === 'signup' && (
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-white/80 mb-1.5">Nom complet</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Prénom Nom"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
              />
            </div>
          )}

          <div className="mb-4">
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
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1.5">
              Mot de passe {mode === 'signup' && <span className="text-white/30 font-normal">(min. 6 caractères)</span>}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={mode === 'signup' ? 6 : undefined}
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error/20 text-error text-sm border border-error/20">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-teal/20 text-sm border border-teal/20" style={{ color: '#88C9C7' }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full py-2.5 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Chargement...'
              : mode === 'login'
                ? 'Se connecter'
                : 'Créer mon compte'
            }
          </button>

          {/* Toggle mode */}
          <div className="mt-5 text-center">
            {mode === 'login' ? (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
                  className="text-teal-clair hover:text-white transition-colors underline underline-offset-2"
                >
                  Créer un compte
                </button>
              </p>
            ) : (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                  className="text-teal-clair hover:text-white transition-colors underline underline-offset-2"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Accès réservé à l&apos;équipe Emancia
        </p>
      </div>
    </div>
  )
}
