'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, Check, Camera, Play, Briefcase, MessageCircle, Video, Lightbulb, ExternalLink, GripVertical, List, Columns3 } from 'lucide-react'

interface ContentIdea {
  id: string
  user_id: string
  user_email: string
  user_name: string | null
  platform: string
  content_type: string
  title: string
  description: string
  link: string | null
  status: string
  created_at: string
  updated_at: string
}

function Linkify({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s<]+)/g
  const parts = text.split(urlRegex)
  return (
    <>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal underline underline-offset-2 hover:text-teal-dark transition-colors break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part.length > 60 ? part.slice(0, 57) + '...' : part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
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
  { value: 'idee', label: 'Idée', bg: 'bg-sauge/15', text: 'text-sauge', dot: 'bg-sauge', color: '#A8C280', headerBg: 'bg-sauge/10', borderColor: 'border-sauge/20' },
  { value: 'valide', label: 'Validé', bg: 'bg-teal/10', text: 'text-teal', dot: 'bg-teal', color: '#1A8F8A', headerBg: 'bg-teal/10', borderColor: 'border-teal/20' },
  { value: 'en_cours', label: 'En cours', bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning', color: '#F0A500', headerBg: 'bg-warning/10', borderColor: 'border-warning/20' },
  { value: 'publie', label: 'Publié', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success', color: '#4CAF82', headerBg: 'bg-success/10', borderColor: 'border-success/20' },
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
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [error, setError] = useState('')

  // Drag state
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const dragCounter = useRef<Record<string, number>>({})

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPlatform, setFormPlatform] = useState('instagram')
  const [formContentType, setFormContentType] = useState('Post image')
  const [formLink, setFormLink] = useState('')
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
    setFormLink('')
    setFormPlatform('instagram')
    setFormContentType('Post image')
    setFormStatus('idee')
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (idea: ContentIdea) => {
    setFormTitle(idea.title)
    setFormDescription(idea.description)
    setFormLink(idea.link || '')
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
      link: formLink.trim() || null,
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

  const handleStatusChange = async (ideaId: string, newStatus: string) => {
    const idea = ideas.find(i => i.id === ideaId)
    if (!idea) return

    // Optimistic update
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: newStatus } : i))

    const supabase = createClient()
    const { error } = await supabase
      .from('content_ideas')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', ideaId)

    if (error) {
      setError(error.message)
      // Rollback
      setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: idea.status } : i))
    }
  }

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, ideaId: string) => {
    setDraggedId(ideaId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', ideaId)
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null)
    setDragOverColumn(null)
    dragCounter.current = {}
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
  }

  const handleColumnDragEnter = (e: React.DragEvent, statusValue: string) => {
    e.preventDefault()
    dragCounter.current[statusValue] = (dragCounter.current[statusValue] || 0) + 1
    setDragOverColumn(statusValue)
  }

  const handleColumnDragLeave = (statusValue: string) => {
    dragCounter.current[statusValue] = (dragCounter.current[statusValue] || 0) - 1
    if (dragCounter.current[statusValue] <= 0) {
      dragCounter.current[statusValue] = 0
      if (dragOverColumn === statusValue) {
        setDragOverColumn(null)
      }
    }
  }

  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleColumnDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const ideaId = e.dataTransfer.getData('text/plain')
    if (ideaId && draggedId) {
      const idea = ideas.find(i => i.id === ideaId)
      if (idea && idea.status !== newStatus) {
        handleStatusChange(ideaId, newStatus)
      }
    }
    setDraggedId(null)
    setDragOverColumn(null)
    dragCounter.current = {}
  }

  const filteredIdeas = ideas.filter(idea => {
    if (filterPlatform !== 'all' && idea.platform !== filterPlatform) return false
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

  const renderIdeaCard = (idea: ContentIdea, compact = false) => {
    const platform = getPlatformInfo(idea.platform)
    const status = getStatusInfo(idea.status)
    const isOwner = userId === idea.user_id
    const PlatformIcon = platform?.icon || MessageCircle

    return (
      <div
        key={idea.id}
        draggable
        onDragStart={(e) => handleDragStart(e, idea.id)}
        onDragEnd={handleDragEnd}
        className={`bg-white rounded-xl border border-gris-leger/30 hover:shadow-md transition-all group cursor-grab active:cursor-grabbing ${
          compact ? 'p-3' : 'p-5'
        } ${draggedId === idea.id ? 'opacity-50 scale-95' : ''}`}
      >
        {compact ? (
          // Compact card for board view
          <div>
            <div className="flex items-start gap-2 mb-2">
              <GripVertical size={14} className="text-gris-texte/20 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-bleu-nuit leading-snug line-clamp-2">{idea.title}</h3>
              </div>
            </div>

            {idea.description && (
              <p className="text-xs text-gris-texte/60 leading-relaxed mb-2 line-clamp-2 ml-6">
                <Linkify text={idea.description} />
              </p>
            )}

            {idea.link && (
              <a
                href={idea.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-teal hover:text-teal-dark transition-colors mb-2 ml-6"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={10} />
                <span className="underline underline-offset-2 truncate max-w-[150px]">
                  {idea.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </span>
              </a>
            )}

            <div className="flex items-center justify-between ml-6">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ backgroundColor: `${platform?.color || '#888'}15` }}
                >
                  <PlatformIcon size={11} style={{ color: platform?.color || '#888' }} />
                </div>
                <span className="text-[10px] text-gris-texte/40">{idea.content_type}</span>
              </div>

              {isOwner && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(idea) }}
                    className="p-1 rounded text-gris-texte/30 hover:text-teal hover:bg-teal/5 transition-colors"
                    title="Modifier"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(idea.id) }}
                    className="p-1 rounded text-gris-texte/30 hover:text-error hover:bg-error/5 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2 ml-6 text-[10px] text-gris-texte/30">
              <span>{idea.user_name || idea.user_email?.split('@')[0]}</span>
              <span>·</span>
              <span>{timeAgo(idea.created_at)}</span>
            </div>
          </div>
        ) : (
          // Full card for list view
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-gris-texte/20 shrink-0" />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${platform?.color || '#888'}15` }}
              >
                <PlatformIcon size={18} style={{ color: platform?.color || '#888' }} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-bleu-nuit truncate">{idea.title}</h3>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>

              {idea.description && (
                <p className="text-sm text-gris-texte/70 leading-relaxed mb-2 line-clamp-2">
                  <Linkify text={idea.description} />
                </p>
              )}

              {idea.link && (
                <a
                  href={idea.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal-dark transition-colors mb-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} />
                  <span className="underline underline-offset-2">
                    {idea.link.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 50)}
                    {idea.link.replace(/^https?:\/\//, '').replace(/\/$/, '').length > 50 ? '...' : ''}
                  </span>
                </a>
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
        )}
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
              Glissez-déposez les cartes entre les colonnes pour changer leur statut.
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

      {/* Filters + View toggle */}
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

        <div className="flex items-center gap-1 ml-auto bg-white rounded-lg border border-gris-leger/30 p-0.5">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'board'
                ? 'bg-teal text-white'
                : 'text-gris-texte/50 hover:text-gris-texte'
            }`}
          >
            <Columns3 size={13} />
            Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-teal text-white'
                : 'text-gris-texte/50 hover:text-gris-texte'
            }`}
          >
            <List size={13} />
            Liste
          </button>
        </div>
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

              <div>
                <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Lien <span className="text-gris-texte/30 font-normal">(optionnel)</span></label>
                <input
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-gris-texte placeholder:text-gris-texte/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
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

      {/* Content */}
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
      ) : viewMode === 'board' ? (
        /* ===== BOARD VIEW (Kanban) ===== */
        <div className="grid grid-cols-4 gap-4">
          {STATUSES.map(status => {
            const columnIdeas = filteredIdeas.filter(i => i.status === status.value)
            const isOver = dragOverColumn === status.value

            return (
              <div
                key={status.value}
                onDragEnter={(e) => handleColumnDragEnter(e, status.value)}
                onDragLeave={() => handleColumnDragLeave(status.value)}
                onDragOver={handleColumnDragOver}
                onDrop={(e) => handleColumnDrop(e, status.value)}
                className={`rounded-xl transition-all min-h-[300px] flex flex-col ${
                  isOver
                    ? `bg-white ring-2 shadow-lg`
                    : 'bg-blanc-casse/60'
                }`}
                style={isOver ? { '--tw-ring-color': status.color } as React.CSSProperties : undefined}
              >
                {/* Column header */}
                <div className={`flex items-center justify-between px-3 py-3 rounded-t-xl ${status.headerBg}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
                    <span className={`text-sm font-semibold ${status.text}`}>{status.label}</span>
                  </div>
                  <span className={`text-xs font-mono font-medium ${status.text} opacity-60`}>
                    {columnIdeas.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {columnIdeas.map(idea => renderIdeaCard(idea, true))}

                  {columnIdeas.length === 0 && (
                    <div className={`flex items-center justify-center h-20 rounded-lg border-2 border-dashed transition-colors ${
                      isOver ? `${status.borderColor} ${status.bg}` : 'border-gris-leger/20'
                    }`}>
                      <p className="text-[11px] text-gris-texte/30">
                        {isOver ? 'Déposer ici' : 'Vide'}
                      </p>
                    </div>
                  )}

                  {/* Drop zone indicator when column has cards */}
                  {isOver && columnIdeas.length > 0 && (
                    <div className={`flex items-center justify-center h-12 rounded-lg border-2 border-dashed ${status.borderColor} ${status.bg} transition-all`}>
                      <p className={`text-[11px] ${status.text} opacity-60`}>Déposer ici</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ===== LIST VIEW ===== */
        <div className="space-y-3">
          {filteredIdeas.map(idea => renderIdeaCard(idea, false))}
        </div>
      )}
    </div>
  )
}
