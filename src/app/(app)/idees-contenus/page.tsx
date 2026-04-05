'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, Check, Camera, Play, Briefcase, MessageCircle, Video, Lightbulb } from 'lucide-react'

interface ContentIdea {
  id: string
  user_id: string
  user_email: string
  user_name: string | null
  platform: string
  content_type: string
  title: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Camera, color: '#E1306C' },
  { value: 'youtube', label: 'YouTube', icon: Play, color: '#FF0000' },
  { value: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: '#0A66C2' },
  { value: 'tiktok', label: 'TikTok', icon: Video, color: '#000000' },
  { value: 'twitter', label: 'X / Twitter', icon: MessageCircle, color: '#1DA1F2' },
]

const CONTENT_TYPES = [
  'Post image',
  'Carrousel',
  'Reel / Short',
  'Story',
  'Vidéo longue',
  'Article / Blog',
  'Newsletter',
  'Thread',
  'Live',
  'Autre',
]

const STATUSES = [
  { value: 'idee', label: 'Idée', bg: 'bg-sauge/15', text: 'text-sauge', dot: 'bg-sauge' },
  { value: 'valide', label: 'Validé', bg: 'bg-teal/10', text: 'text-teal', dot: 'bg-teal' },
  { value: 'en_cours', label: 'En cours', bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  { value: 'publie', label: 'Publié', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
]

function getStatusInfo(status: string) {
  return STATUSES.find(s => s.value === status) || STATUSES[0]
}

function getPlatformInfo(platform: string) {
  return PLATFORMS.find(p => p.value === platform)
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function IdeesContenusPage() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [error, setError] = useState('')

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPlatform, setFormPlatform] = useState('instagram')
  const [formContentType, setFormContentType] = useState('Post image')
  const [formStatus, setFormStatus] = useState('idee')

  const fetchIdeas = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('content_ideas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching ideas:', error)
      setError('Erreur lors du chargement. As-tu bien créé la table dans Supabase ?')
    } else {
      setIdeas(data || [])
      setError('')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
      await fetchIdeas()
    }
    init()
  }, [fetchIdeas])

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormPlatform('instagram')
    setFormContentType('Post image')
    setFormStatus('idee')
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (idea: ContentIdea) => {
    setFormTitle(idea.title)
    setFormDescription(idea.description)
    setFormPlatform(idea.platform)
    setFormContentType(idea.content_type)
    setFormStatus(idea.status)
    setEditingId(idea.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      platform: formPlatform,
      content_type: formContentType,
      status: formStatus,
      user_id: user.id,
      user_email: user.email || '',
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      const { error } = await supabase
        .from('content_ideas')
        .update(payload)
        .eq('id', editingId)
      if (error) { setError(error.message); return }
    } else {
      const { error } = await supabase
        .from('content_ideas')
        .insert({ ...payload, created_at: new Date().toISOString() })
      if (error) { setError(error.message); return }
    }

    resetForm()
    fetchIdeas()
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('content_ideas').delete().eq('id', id)
    if (error) { setError(error.message); return }
    fetchIdeas()
  }

  const filteredIdeas = ideas.filter(idea => {
    if (filterPlatform !== 'all' && idea.platform !== filterPlatform) return false
    if (filterStatus !== 'all' && idea.status !== filterStatus) return false
    return true
  })

  const stats = {
    total: ideas.length,
    idee: ideas.filter(i => i.status === 'idee').length,
    valide: ideas.filter(i => i.status === 'valide').length,
    en_cours: ideas.filter(i => i.status === 'en_cours').length,
    publie: ideas.filter(i => i.status === 'publie').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-bleu-nuit mb-2">
              Idées de contenus
            </h1>
            <p className="text-sm text-gris-texte/70 max-w-xl leading-relaxed">
              Proposez des idées de contenus pour les réseaux sociaux et YouTube.
              Chaque membre de l&apos;équipe peut ajouter, modifier ou supprimer ses propres idées.
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors shrink-0"
          >
            <Plus size={16} />
            Nouvelle idée
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gris-leger/30 text-center">
          <p className="text-2xl font-semibold text-bleu-nuit">{stats.total}</p>
          <p className="text-[11px] text-gris-texte/50 mt-0.5">Total</p>
        </div>
        {STATUSES.map(s => (
          <div key={s.value} className="bg-white rounded-xl p-4 border border-gris-leger/30 text-center">
            <p className={`text-2xl font-semibold ${s.text}`}>{stats[s.value as keyof typeof stats]}</p>
            <p className="text-[11px] text-gris-texte/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gris-leger text-sm bg-white text-gris-texte focus:outline-none focus:border-teal"
        >
          <option value="all">Toutes les plateformes</option>
          {PLATFORMS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gris-leger text-sm bg-white text-gris-texte focus:outline-none focus:border-teal"
        >
          <option value="all">Tous les statuts</option>
          {STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <span className="text-xs text-gris-texte/40 ml-auto">
          {filteredIdeas.length} résultat{filteredIdeas.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error/10 text-error text-sm border border-error/20">
          {error}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gris-leger/30">
              <h3 className="font-display text-lg font-semibold text-bleu-nuit">
                {editingId ? 'Modifier l\'idée' : 'Nouvelle idée de contenu'}
              </h3>
              <button type="button" onClick={resetForm} className="text-gris-texte/40 hover:text-gris-texte transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Titre *</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: 5 erreurs d'investisseur débutant"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-gris-texte placeholder:text-gris-texte/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Décris le concept, le message clé, le format envisagé..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-gris-texte placeholder:text-gris-texte/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Plateforme</label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm bg-white text-gris-texte focus:outline-none focus:border-teal"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Type de contenu</label>
                  <select
                    value={formContentType}
                    onChange={(e) => setFormContentType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm bg-white text-gris-texte focus:outline-none focus:border-teal"
                  >
                    {CONTENT_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Statut</label>
                <div className="flex gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setFormStatus(s.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        formStatus === s.value
                          ? `${s.bg} ${s.text} ring-1 ring-current`
                          : 'bg-gris-leger/30 text-gris-texte/50 hover:bg-gris-leger/50'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${formStatus === s.value ? s.dot : 'bg-gris-texte/30'}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gris-leger/30 bg-blanc-casse/50">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-gris-texte/60 hover:text-gris-texte transition-colors">
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors"
              >
                <Check size={14} />
                {editingId ? 'Enregistrer' : 'Publier'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ideas list */}
      {filteredIdeas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gris-leger/30 p-12 text-center">
          <Lightbulb size={40} className="mx-auto text-gris-texte/20 mb-4" />
          <p className="text-gris-texte/50 text-sm mb-4">
            {ideas.length === 0
              ? 'Aucune idée pour le moment. Sois le premier à proposer !'
              : 'Aucun résultat pour ces filtres.'}
          </p>
          {ideas.length === 0 && (
            <button
              onClick={() => { resetForm(); setShowForm(true) }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors"
            >
              <Plus size={14} />
              Ajouter une idée
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIdeas.map((idea) => {
            const platform = getPlatformInfo(idea.platform)
            const status = getStatusInfo(idea.status)
            const isOwner = userId === idea.user_id
            const PlatformIcon = platform?.icon || MessageCircle

            return (
              <div
                key={idea.id}
                className="bg-white rounded-xl border border-gris-leger/30 p-5 hover:shadow-sm transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  {/* Platform icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${platform?.color || '#888'}15` }}
                  >
                    <PlatformIcon size={18} style={{ color: platform?.color || '#888' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-bleu-nuit truncate">{idea.title}</h3>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>

                    {idea.description && (
                      <p className="text-sm text-gris-texte/70 leading-relaxed mb-2 line-clamp-2">{idea.description}</p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-gris-texte/40">
                      <span className="font-medium" style={{ color: platform?.color || '#888' }}>
                        {platform?.label || idea.platform}
                      </span>
                      <span>·</span>
                      <span>{idea.content_type}</span>
                      <span>·</span>
                      <span>{idea.user_name || idea.user_email?.split('@')[0]}</span>
                      <span>·</span>
                      <span>{timeAgo(idea.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions (owner only) */}
                  {isOwner && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => startEdit(idea)}
                        className="p-2 rounded-lg text-gris-texte/40 hover:text-teal hover:bg-teal/5 transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="p-2 rounded-lg text-gris-texte/40 hover:text-error hover:bg-error/5 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
