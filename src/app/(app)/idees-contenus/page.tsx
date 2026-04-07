'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, Check, Camera, Play, Briefcase, MessageCircle, Video, Lightbulb, ExternalLink, GripVertical, List, Columns3, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface ContentIdea {
  id: string
  user_id: string
  user_email: string
  user_name: string | null
  platform: string
  platforms: string[]
  content_type: string
  content_types: string[]
  title: string
  description: string
  link: string | null
  status: string
  scheduled_date: string | null
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
  { value: 'publie', label: 'Publié', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success', color: '#5A8A4A', headerBg: 'bg-success/10', borderColor: 'border-success/20' },
]

function getStatusInfo(status: string) {
  return STATUSES.find(s => s.value === status) || STATUSES[0]
}

function getPlatformInfo(platform: string) {
  return PLATFORMS.find(p => p.value === platform)
}

function getIdeaPlatforms(idea: ContentIdea): string[] {
  if (idea.platforms && idea.platforms.length > 0) return idea.platforms
  if (idea.platform) return [idea.platform]
  return []
}

function getIdeaContentTypes(idea: ContentIdea): string[] {
  if (idea.content_types && idea.content_types.length > 0) return idea.content_types
  if (idea.content_type) return [idea.content_type]
  return []
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

function getWeekDays(weekOffset: number): Date[] {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)
  monday.setHours(0, 0, 0, 0)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }
  return days
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTH_NAMES = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

// Multi-select chip component
function ChipSelect({ options, selected, onChange, renderOption }: {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  renderOption?: (opt: { value: string; label: string }, isActive: boolean) => React.ReactNode
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      if (selected.length > 1) {
        onChange(selected.filter(v => v !== value))
      }
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => {
        const isActive = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
              isActive
                ? 'bg-teal/10 border-teal/30 text-teal'
                : 'bg-white border-gris-leger/50 text-bleu-nuit/50 hover:border-teal/20 hover:text-bleu-nuit/70'
            }`}
          >
            {renderOption ? renderOption(opt, isActive) : opt.label}
          </button>
        )
      })}
    </div>
  )
}

// Platform chip for filters (with color + icon)
function PlatformFilterChips({ selected, onChange }: {
  selected: string[]
  onChange: (selected: string[]) => void
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {PLATFORMS.map(p => {
        const isActive = selected.includes(p.value)
        const Icon = p.icon
        return (
          <button
            key={p.value}
            onClick={() => toggle(p.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
              isActive
                ? 'border-current bg-current/10'
                : 'border-gris-leger/50 text-bleu-nuit/40 hover:border-bleu-nuit/20'
            }`}
            style={isActive ? { color: p.color } : undefined}
          >
            <Icon size={12} />
            {p.label}
          </button>
        )
      })}
    </div>
  )
}

export default function IdeesContenusPage() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterPlatforms, setFilterPlatforms] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [error, setError] = useState('')
  const [weekOffset, setWeekOffset] = useState(0)

  // Drag state
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)
  const dragCounter = useRef<Record<string, number>>({})

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPlatforms, setFormPlatforms] = useState<string[]>(['instagram'])
  const [formContentTypes, setFormContentTypes] = useState<string[]>(['Post image'])
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
    setFormPlatforms(['instagram'])
    setFormContentTypes(['Post image'])
    setFormStatus('idee')
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (idea: ContentIdea) => {
    setFormTitle(idea.title)
    setFormDescription(idea.description)
    setFormLink(idea.link || '')
    setFormPlatforms(getIdeaPlatforms(idea))
    setFormContentTypes(getIdeaContentTypes(idea))
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
      platform: formPlatforms[0] || 'instagram',
      platforms: formPlatforms,
      content_type: formContentTypes[0] || 'Post image',
      content_types: formContentTypes,
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

    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: newStatus } : i))

    const supabase = createClient()
    const { error } = await supabase
      .from('content_ideas')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', ideaId)

    if (error) {
      setError(error.message)
      setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: idea.status } : i))
    }
  }

  const handleScheduleDate = async (ideaId: string, date: string | null) => {
    const idea = ideas.find(i => i.id === ideaId)
    if (!idea) return

    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, scheduled_date: date } : i))

    const supabase = createClient()
    const { error } = await supabase
      .from('content_ideas')
      .update({ scheduled_date: date, updated_at: new Date().toISOString() })
      .eq('id', ideaId)

    if (error) {
      setError(error.message)
      setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, scheduled_date: idea.scheduled_date } : i))
    }
  }

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, ideaId: string) => {
    setDraggedId(ideaId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', ideaId)
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedId(null)
    setDragOverColumn(null)
    setDragOverDate(null)
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

  // Calendar drag handlers
  const handleCalendarDragOver = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverDate(dateKey)
  }

  const handleCalendarDragLeave = () => {
    setDragOverDate(null)
  }

  const handleCalendarDrop = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault()
    const ideaId = e.dataTransfer.getData('text/plain')
    if (ideaId) {
      const idea = ideas.find(i => i.id === ideaId)
      if (idea && idea.status !== 'idee') {
        handleScheduleDate(ideaId, dateKey)
      }
    }
    setDraggedId(null)
    setDragOverDate(null)
    dragCounter.current = {}
  }

  const filteredIdeas = ideas.filter(idea => {
    if (filterPlatforms.length === 0) return true
    const ideaPlatforms = getIdeaPlatforms(idea)
    return filterPlatforms.some(fp => ideaPlatforms.includes(fp))
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

  const renderPlatformBadges = (idea: ContentIdea) => {
    const platforms = getIdeaPlatforms(idea)
    return (
      <div className="flex items-center gap-1">
        {platforms.map(pv => {
          const p = getPlatformInfo(pv)
          if (!p) return null
          const Icon = p.icon
          return (
            <div
              key={pv}
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: `${p.color}15` }}
              title={p.label}
            >
              <Icon size={10} style={{ color: p.color }} />
            </div>
          )
        })}
      </div>
    )
  }

  const renderContentTypeBadges = (idea: ContentIdea) => {
    const types = getIdeaContentTypes(idea)
    if (types.length <= 1) {
      return <span className="text-[10px] text-bleu-nuit/40 truncate">{types[0] || ''}</span>
    }
    return (
      <div className="flex items-center gap-1">
        {types.map(t => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-blanc-casse text-bleu-nuit/50">{t}</span>
        ))}
      </div>
    )
  }

  const renderIdeaCard = (idea: ContentIdea, compact = false) => {
    const status = getStatusInfo(idea.status)
    const isOwner = userId === idea.user_id

    return (
      <div
        key={idea.id}
        draggable
        onDragStart={(e) => handleDragStart(e, idea.id)}
        onDragEnd={handleDragEnd}
        className={`bg-white rounded-lg border border-gris-leger/30 hover:shadow-md transition-all group cursor-grab active:cursor-grabbing ${
          compact ? 'p-3' : 'p-5'
        } ${draggedId === idea.id ? 'opacity-50 scale-95' : ''}`}
      >
        {compact ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              {renderPlatformBadges(idea)}
              {renderContentTypeBadges(idea)}
              {isOwner && (
                <div className="flex items-center gap-0.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(idea) }}
                    className="p-1 rounded text-bleu-nuit/30 hover:text-teal hover:bg-teal/5 transition-colors"
                    title="Modifier"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(idea.id) }}
                    className="p-1 rounded text-bleu-nuit/30 hover:text-error hover:bg-error/5 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-sm text-bleu-nuit leading-snug line-clamp-2 mb-1">{idea.title}</h3>

            {idea.description && (
              <p className="text-xs text-bleu-nuit/60 leading-relaxed mb-1.5 line-clamp-2">
                <Linkify text={idea.description} />
              </p>
            )}

            {idea.link && (
              <a
                href={idea.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-teal hover:text-teal-dark transition-colors mb-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={10} />
                <span className="underline underline-offset-2 truncate max-w-[180px]">
                  {idea.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </span>
              </a>
            )}

            {idea.scheduled_date && (
              <div className="flex items-center gap-1 text-[10px] text-prune mb-1.5">
                <CalendarDays size={10} />
                <span>{new Date(idea.scheduled_date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[10px] text-bleu-nuit/30 pt-1.5 border-t border-gris-leger/20">
              <span className="truncate">{idea.user_name || idea.user_email?.split('@')[0]}</span>
              <span>·</span>
              <span className="shrink-0">{timeAgo(idea.created_at)}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-bleu-nuit/20 shrink-0" />
              {renderPlatformBadges(idea)}
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
                <p className="text-sm text-bleu-nuit/70 leading-relaxed mb-2 line-clamp-2">
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

              <div className="flex items-center gap-3 text-[11px] text-bleu-nuit/40">
                {renderContentTypeBadges(idea)}
                <span>·</span>
                <span>{idea.user_name || idea.user_email?.split('@')[0]}</span>
                <span>·</span>
                <span>{timeAgo(idea.created_at)}</span>
                {idea.scheduled_date && (
                  <>
                    <span>·</span>
                    <span className="text-prune flex items-center gap-1">
                      <CalendarDays size={10} />
                      {new Date(idea.scheduled_date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </>
                )}
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => startEdit(idea)}
                  className="p-2 rounded-lg text-bleu-nuit/40 hover:text-teal hover:bg-teal/5 transition-colors"
                  title="Modifier"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="p-2 rounded-lg text-bleu-nuit/40 hover:text-error hover:bg-error/5 transition-colors"
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

  // Calendar data
  const weeks: Date[][] = []
  for (let w = 0; w < 4; w++) {
    weeks.push(getWeekDays(weekOffset + w))
  }
  const schedulableIdeas = ideas.filter(i => i.status === 'valide' || i.status === 'en_cours')
  const scheduledByDate: Record<string, ContentIdea[]> = {}
  ideas.forEach(idea => {
    if (idea.scheduled_date) {
      const key = idea.scheduled_date
      if (!scheduledByDate[key]) scheduledByDate[key] = []
      scheduledByDate[key].push(idea)
    }
  })

  const todayKey = formatDateKey(new Date())

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-bleu-nuit mb-2">
              Idées de contenus
            </h1>
            <p className="text-sm text-bleu-nuit/70 max-w-xl leading-relaxed">
              Proposez des idées de contenus pour les réseaux sociaux et YouTube.
              Glissez-déposez les cartes entre les colonnes pour changer leur statut, ou sur le calendrier pour planifier le tournage.
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
        <div className="bg-white rounded-lg p-4 border border-gris-leger/30 text-center">
          <p className="text-2xl font-semibold text-bleu-nuit">{stats.total}</p>
          <p className="text-[11px] text-bleu-nuit/50 mt-0.5">Total</p>
        </div>
        {STATUSES.map(s => (
          <div key={s.value} className="bg-white rounded-lg p-4 border border-gris-leger/30 text-center">
            <p className={`text-2xl font-semibold ${s.text}`}>{stats[s.value as keyof typeof stats]}</p>
            <p className="text-[11px] text-bleu-nuit/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + View toggle */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <PlatformFilterChips
          selected={filterPlatforms}
          onChange={setFilterPlatforms}
        />

        {filterPlatforms.length > 0 && (
          <button
            onClick={() => setFilterPlatforms([])}
            className="text-xs text-bleu-nuit/40 hover:text-bleu-nuit/70 transition-colors underline"
          >
            Tout afficher
          </button>
        )}

        <div className="flex items-center gap-1 ml-auto bg-white rounded-lg border border-gris-leger/30 p-0.5">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'board'
                ? 'bg-teal text-white'
                : 'text-bleu-nuit/50 hover:text-bleu-nuit'
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
                : 'text-bleu-nuit/50 hover:text-bleu-nuit'
            }`}
          >
            <List size={13} />
            Liste
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-error/10 text-error text-sm border border-error/20">
          {error}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gris-leger/30">
              <h3 className="font-display text-lg font-semibold text-bleu-nuit">
                {editingId ? 'Modifier l\'idée' : 'Nouvelle idée de contenu'}
              </h3>
              <button type="button" onClick={resetForm} className="text-bleu-nuit/40 hover:text-bleu-nuit transition-colors">
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
                  className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Décris le concept, le message clé, le format envisagé..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Lien <span className="text-bleu-nuit/30 font-normal">(optionnel)</span></label>
                <input
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  className="w-full px-4 py-2.5 rounded-lg border border-gris-leger text-sm text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Plateformes</label>
                <ChipSelect
                  options={PLATFORMS.map(p => ({ value: p.value, label: p.label }))}
                  selected={formPlatforms}
                  onChange={setFormPlatforms}
                  renderOption={(opt, isActive) => {
                    const p = getPlatformInfo(opt.value)
                    const Icon = p?.icon || MessageCircle
                    return (
                      <span className="flex items-center gap-1.5">
                        <Icon size={12} style={isActive ? { color: p?.color } : undefined} />
                        {opt.label}
                      </span>
                    )
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-bleu-nuit mb-1.5">Types de contenu</label>
                <ChipSelect
                  options={CONTENT_TYPES.map(t => ({ value: t, label: t }))}
                  selected={formContentTypes}
                  onChange={setFormContentTypes}
                />
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
                          : 'bg-gris-leger/30 text-bleu-nuit/50 hover:bg-gris-leger/50'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${formStatus === s.value ? s.dot : 'bg-bleu-nuit/30'}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gris-leger/30 bg-blanc-casse/50">
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-bleu-nuit/60 hover:text-bleu-nuit transition-colors">
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
        <div className="bg-white rounded-lg border border-gris-leger/30 p-12 text-center">
          <Lightbulb size={40} className="mx-auto text-bleu-nuit/20 mb-4" />
          <p className="text-bleu-nuit/50 text-sm mb-4">
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
                className={`rounded-lg transition-all min-h-[300px] flex flex-col ${
                  isOver
                    ? `bg-white ring-2 shadow-lg`
                    : 'bg-blanc-casse/60'
                }`}
                style={isOver ? { '--tw-ring-color': status.color } as React.CSSProperties : undefined}
              >
                <div className={`flex items-center justify-between px-3 py-3 rounded-t-lg ${status.headerBg}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
                    <span className={`text-sm font-semibold ${status.text}`}>{status.label}</span>
                  </div>
                  <span className={`text-xs font-mono font-medium ${status.text} opacity-60`}>
                    {columnIdeas.length}
                  </span>
                </div>

                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {columnIdeas.map(idea => renderIdeaCard(idea, true))}

                  {columnIdeas.length === 0 && (
                    <div className={`flex items-center justify-center h-20 rounded-lg border-2 border-dashed transition-colors ${
                      isOver ? `${status.borderColor} ${status.bg}` : 'border-gris-leger/20'
                    }`}>
                      <p className="text-[11px] text-bleu-nuit/30">
                        {isOver ? 'Déposer ici' : 'Vide'}
                      </p>
                    </div>
                  )}

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
        <div className="space-y-3">
          {filteredIdeas.map(idea => renderIdeaCard(idea, false))}
        </div>
      )}

      {/* ===== MILESTONE CALENDAR ===== */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CalendarDays size={20} className="text-teal" />
            <h2 className="font-display text-xl font-semibold text-bleu-nuit">Calendrier de tournage</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-bleu-nuit/50 hover:text-bleu-nuit hover:bg-blanc-casse transition-colors"
            >
              Aujourd&apos;hui
            </button>
            <button
              onClick={() => setWeekOffset(w => w - 1)}
              className="p-1.5 rounded-md text-bleu-nuit/40 hover:text-bleu-nuit hover:bg-blanc-casse transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className="p-1.5 rounded-md text-bleu-nuit/40 hover:text-bleu-nuit hover:bg-blanc-casse transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <p className="text-xs text-bleu-nuit/50 mb-4">
          Glissez les idées validées ou en cours sur un jour pour planifier le tournage. Cliquez sur une idée planifiée pour la retirer du calendrier.
        </p>

        <div className="space-y-1">
          {weeks.map((weekDays, wi) => {
            const monthLabel = MONTH_NAMES[weekDays[0].getMonth()]
            const weekNum = Math.ceil((weekDays[0].getDate()) / 7)
            return (
              <div key={wi}>
                {(wi === 0 || weekDays[0].getMonth() !== weeks[wi - 1][0].getMonth()) && (
                  <div className="text-xs font-medium text-bleu-nuit/40 uppercase tracking-wider mb-1 mt-3 first:mt-0">
                    {monthLabel} {weekDays[0].getFullYear()}
                  </div>
                )}
                <div className="grid grid-cols-7 gap-1">
                  {wi === 0 && DAY_NAMES.map(d => (
                    <div key={d} className="text-center text-[10px] font-medium text-bleu-nuit/30 py-1">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map(day => {
                    const dateKey = formatDateKey(day)
                    const isToday = dateKey === todayKey
                    const isPast = day < new Date(todayKey)
                    const isOver = dragOverDate === dateKey
                    const dayIdeas = scheduledByDate[dateKey] || []
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6

                    return (
                      <div
                        key={dateKey}
                        onDragOver={(e) => handleCalendarDragOver(e, dateKey)}
                        onDragLeave={handleCalendarDragLeave}
                        onDrop={(e) => handleCalendarDrop(e, dateKey)}
                        className={`min-h-[80px] rounded-md border p-1.5 transition-all ${
                          isOver
                            ? 'border-teal bg-teal/5 ring-1 ring-teal/20'
                            : isToday
                              ? 'border-teal/30 bg-teal/5'
                              : isPast
                                ? 'border-gris-leger/20 bg-gris-leger/5'
                                : isWeekend
                                  ? 'border-gris-leger/15 bg-blanc-casse/30'
                                  : 'border-gris-leger/20 bg-white'
                        }`}
                      >
                        <div className={`text-[11px] font-medium mb-1 ${
                          isToday ? 'text-teal' : isPast ? 'text-bleu-nuit/25' : 'text-bleu-nuit/50'
                        }`}>
                          {day.getDate()}
                        </div>

                        <div className="space-y-0.5">
                          {dayIdeas.map(idea => {
                            const platforms = getIdeaPlatforms(idea)
                            const mainPlatform = getPlatformInfo(platforms[0])
                            const status = getStatusInfo(idea.status)

                            return (
                              <button
                                key={idea.id}
                                onClick={() => handleScheduleDate(idea.id, null)}
                                className="w-full text-left px-1.5 py-1 rounded text-[10px] font-medium truncate transition-all hover:opacity-70 border"
                                style={{
                                  backgroundColor: `${mainPlatform?.color || status.color}10`,
                                  borderColor: `${mainPlatform?.color || status.color}25`,
                                  color: mainPlatform?.color || status.color,
                                }}
                                title={`${idea.title} — Cliquer pour retirer du calendrier`}
                              >
                                {idea.title}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Unscheduled validated ideas */}
        {schedulableIdeas.filter(i => !i.scheduled_date).length > 0 && (
          <div className="mt-6 p-4 bg-blanc-casse/50 rounded-lg border border-gris-leger/20">
            <h3 className="text-sm font-medium text-bleu-nuit mb-3">
              Idées à planifier ({schedulableIdeas.filter(i => !i.scheduled_date).length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {schedulableIdeas.filter(i => !i.scheduled_date).map(idea => {
                const platforms = getIdeaPlatforms(idea)
                const mainPlatform = getPlatformInfo(platforms[0])
                const Icon = mainPlatform?.icon || MessageCircle

                return (
                  <div
                    key={idea.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idea.id)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-gris-leger/30 text-xs cursor-grab active:cursor-grabbing hover:shadow-sm transition-all"
                  >
                    <Icon size={12} style={{ color: mainPlatform?.color || '#888' }} />
                    <span className="text-bleu-nuit font-medium truncate max-w-[200px]">{idea.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
