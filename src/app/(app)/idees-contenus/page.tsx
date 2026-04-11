'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Columns3, List, CalendarDays, Heart, Lightbulb, SlidersHorizontal, X, Search, Archive, Download, BarChart3 } from 'lucide-react'
import {
  KanbanCard, IdeaDetail, IdeaForm, MilestoneCalendar, PlatformFilterChips, Dashboard,
  STATUSES, PILLARS,
  getIdeaPlatforms,
} from '@/components/idees-contenus'
import type { ContentIdea, IdeaComment } from '@/components/idees-contenus'

type ViewMode = 'board' | 'list' | 'calendar' | 'dashboard'

export default function IdeesContenusPage() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterPlatforms, setFilterPlatforms] = useState<string[]>([])
  const [filterPillar, setFilterPillar] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [error, setError] = useState('')
  const [weekOffset, setWeekOffset] = useState(0)
  const [sortByLikes, setSortByLikes] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  // Drag state
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null)
  const [dragOverCardPosition, setDragOverCardPosition] = useState<'before' | 'after'>('before')
  const dragCounter = useRef<Record<string, number>>({})

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formPlatforms, setFormPlatforms] = useState<string[]>(['instagram'])
  const [formContentTypes, setFormContentTypes] = useState<string[]>(['Post image'])
  const [formPillar, setFormPillar] = useState('budget')
  const [formEffort, setFormEffort] = useState('medium')
  const [formAudience, setFormAudience] = useState<string[]>(['tous'])
  const [formLink, setFormLink] = useState('')
  const [formStatus, setFormStatus] = useState('idee')

  // ---- Data fetching ----

  const fetchIdeas = useCallback(async () => {
    const supabase = createClient()
    let result = await supabase
      .from('content_ideas')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })

    if (result.error && result.error.message?.includes('position')) {
      result = await supabase
        .from('content_ideas')
        .select('*')
        .order('created_at', { ascending: false })
    }

    if (result.error) {
      console.error('Error fetching ideas:', result.error)
      setError('Erreur lors du chargement. As-tu bien créé la table dans Supabase ?')
    } else {
      setIdeas((result.data || []).map((d: Record<string, unknown>) => ({
        ...d,
        liked_by: Array.isArray(d.liked_by) ? d.liked_by as string[] : [],
        position: typeof d.position === 'number' ? d.position : 0,
        platforms: Array.isArray(d.platforms) ? d.platforms as string[] : [],
        content_types: Array.isArray(d.content_types) ? d.content_types as string[] : [],
        pillar: typeof d.pillar === 'string' ? d.pillar : '',
        effort: typeof d.effort === 'string' ? d.effort : '',
        audience: Array.isArray(d.audience) ? d.audience as string[] : [],
        comments: Array.isArray(d.comments) ? d.comments as IdeaComment[] : [],
      })) as ContentIdea[])
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

  // ---- Realtime subscription ----
  // Écoute les changements faits par TOUS les utilisateurs en temps réel
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('content_ideas_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_ideas' },
        () => {
          // Quand n'importe quel changement arrive, on recharge toutes les idées
          fetchIdeas()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchIdeas])

  // ---- Mobile detection ----
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
      if (e.matches) setViewMode('list')
    }
    handleChange(mql)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  // ---- Form handlers ----

  const resetForm = () => {
    setFormTitle('')
    setFormDescription('')
    setFormLink('')
    setFormPlatforms(['instagram'])
    setFormContentTypes(['Post image'])
    setFormPillar('budget')
    setFormEffort('medium')
    setFormAudience(['tous'])
    setFormStatus('idee')
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (idea: ContentIdea) => {
    setFormTitle(idea.title)
    setFormDescription(idea.description)
    setFormLink(idea.link || '')
    setFormPlatforms(getIdeaPlatforms(idea))
    const types = idea.content_types?.length > 0 ? idea.content_types : idea.content_type ? [idea.content_type] : ['Post image']
    setFormContentTypes(types)
    setFormPillar(idea.pillar || 'budget')
    setFormEffort(idea.effort || 'medium')
    setFormAudience(idea.audience?.length > 0 ? idea.audience : ['tous'])
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
      pillar: formPillar,
      effort: formEffort,
      audience: formAudience,
      status: formStatus,
      user_id: user.id,
      user_email: user.email || '',
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      const { error } = await supabase.from('content_ideas').update(payload).eq('id', editingId)
      if (error) { setError(error.message); return }
    } else {
      const maxPos = ideas.filter(i => i.status === formStatus).reduce((max, i) => Math.max(max, i.position || 0), 0)
      const insertPayload = { ...payload, position: maxPos + 1, created_at: new Date().toISOString() }
      const { error } = await supabase.from('content_ideas').insert(insertPayload)
      if (error) {
        if (error.message?.includes('position') || error.message?.includes('liked_by')) {
          const { position: _p, liked_by: _l, ...fallbackPayload } = insertPayload as Record<string, unknown>
          void _p; void _l;
          const { error: err2 } = await supabase.from('content_ideas').insert(fallbackPayload)
          if (err2) { setError(err2.message); return }
        } else {
          setError(error.message); return
        }
      }
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

  const handleArchive = async (ideaId: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('content_ideas')
      .update({ status: 'archive', updated_at: new Date().toISOString() })
      .eq('id', ideaId)
    if (error) { setError(error.message); return }
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: 'archive' } : i))
  }

  const handleDuplicate = async (idea: ContentIdea) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const maxPos = ideas.filter(i => i.status === 'idee').reduce((max, i) => Math.max(max, i.position || 0), 0)
    const payload = {
      title: `${idea.title} (copie)`,
      description: idea.description,
      link: idea.link,
      platform: idea.platform,
      platforms: idea.platforms,
      content_type: idea.content_type,
      content_types: idea.content_types,
      pillar: idea.pillar,
      effort: idea.effort,
      audience: idea.audience,
      status: 'idee',
      scheduled_date: null,
      user_id: user.id,
      user_email: user.email || '',
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      position: maxPos + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('content_ideas').insert(payload)
    if (error) { setError(error.message); return }
    fetchIdeas()
  }

  // ---- Export CSV ----
  const handleExportCSV = () => {
    const escapeCsv = (val: string) => {
      if (val.includes(';') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    }

    const statusLabel = (s: string) => STATUSES.find(st => st.value === s)?.label || s
    const pillarLabel = (p: string) => {
      const found = PILLARS.find(pi => pi.value === p)
      return found ? found.label : p
    }

    const header = ['Titre', 'Description', 'Plateforme(s)', 'Type(s)', 'Pilier', 'Effort', 'Statut', 'Likes', 'Auteur', 'Date création', 'Date planifiée']
    const rows = sortedFilteredIdeas.map(idea => [
      escapeCsv(idea.title),
      escapeCsv(idea.description || ''),
      escapeCsv(getIdeaPlatforms(idea).join(', ')),
      escapeCsv((idea.content_types?.length ? idea.content_types : idea.content_type ? [idea.content_type] : []).join(', ')),
      escapeCsv(pillarLabel(idea.pillar)),
      escapeCsv(idea.effort || ''),
      escapeCsv(statusLabel(idea.status)),
      String(idea.liked_by?.length || 0),
      escapeCsv(idea.user_name || idea.user_email?.split('@')[0] || ''),
      idea.created_at ? new Date(idea.created_at).toLocaleDateString('fr-FR') : '',
      idea.scheduled_date || '',
    ].join(';'))

    const bom = '\uFEFF'
    const csv = bom + header.join(';') + '\n' + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `idees-contenus-${today}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ---- Status & reorder ----

  const handleStatusChange = async (ideaId: string, newStatus: string) => {
    const idea = ideas.find(i => i.id === ideaId)
    if (!idea) return

    const targetColumnIdeas = ideas.filter(i => i.status === newStatus)
    const maxPos = targetColumnIdeas.reduce((max, i) => Math.max(max, i.position || 0), 0)

    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: newStatus, position: maxPos + 1 } : i))

    const supabase = createClient()
    const { error } = await supabase
      .from('content_ideas')
      .update({ status: newStatus, position: maxPos + 1, updated_at: new Date().toISOString() })
      .eq('id', ideaId)

    if (error) {
      if (error.message?.includes('position')) {
        const { error: err2 } = await supabase
          .from('content_ideas')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', ideaId)
        if (err2) {
          setError(err2.message)
          setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: idea.status } : i))
        }
      } else {
        setError(error.message)
        setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, status: idea.status, position: idea.position } : i))
      }
    }
  }

  const handleReorder = async (draggedIdeaId: string, targetIdeaId: string, position: 'before' | 'after') => {
    const draggedIdea = ideas.find(i => i.id === draggedIdeaId)
    const targetIdea = ideas.find(i => i.id === targetIdeaId)
    if (!draggedIdea || !targetIdea) return

    const columnStatus = targetIdea.status
    const columnIdeas = ideas
      .filter(i => i.status === columnStatus && i.id !== draggedIdeaId)
      .sort((a, b) => (a.position || 0) - (b.position || 0))

    const targetIndex = columnIdeas.findIndex(i => i.id === targetIdeaId)
    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1

    const newOrder = [...columnIdeas]
    const movedIdea = { ...draggedIdea, status: columnStatus }
    newOrder.splice(insertIndex, 0, movedIdea)

    const updates: { id: string; position: number; status?: string }[] = newOrder.map((idea, index) => ({
      id: idea.id,
      position: index + 1,
      ...(idea.id === draggedIdeaId && draggedIdea.status !== columnStatus ? { status: columnStatus } : {}),
    }))

    setIdeas(prev => {
      const updated = prev.map(i => {
        const u = updates.find(u => u.id === i.id)
        if (u) return { ...i, position: u.position, ...(u.status ? { status: u.status } : {}) }
        return i
      })
      return updated
    })

    const supabase = createClient()
    try {
      const { error: rpcError } = await supabase.rpc('reorder_ideas', {
        p_ids: newOrder.map(i => i.id),
      })

      if (rpcError) {
        for (const u of updates) {
          const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() }
          if (u.status) updatePayload.status = u.status
          updatePayload.position = u.position

          const { error } = await supabase.from('content_ideas').update(updatePayload).eq('id', u.id)

          if (error && error.message?.includes('position')) {
            if (u.status) {
              await supabase.from('content_ideas').update({ status: u.status, updated_at: new Date().toISOString() }).eq('id', u.id)
            }
          }
        }
      }
    } catch {
      console.warn('Reorder not persisted — run the SQL migration to enable persistence')
    }
  }

  // ---- Likes ----

  const handleLike = async (ideaId: string) => {
    if (!userId) return
    const idea = ideas.find(i => i.id === ideaId)
    if (!idea) return

    const likedBy = idea.liked_by || []
    const isLiked = likedBy.includes(userId)
    const newLikedBy = isLiked ? likedBy.filter(id => id !== userId) : [...likedBy, userId]

    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, liked_by: newLikedBy } : i))

    const supabase = createClient()
    try {
      const { error: rpcError } = await supabase.rpc('toggle_like', { p_idea_id: ideaId })
      if (rpcError) {
        const { error } = await supabase
          .from('content_ideas')
          .update({ liked_by: newLikedBy, updated_at: new Date().toISOString() })
          .eq('id', ideaId)
        if (error) {
          console.warn('Like not persisted (run SQL migration):', error.message)
        }
      }
    } catch {
      console.warn('Like not persisted — run the SQL migration to enable persistence')
    }
  }

  // ---- Comments ----

  const handleAddComment = async (ideaId: string, text: string) => {
    if (!userId) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newComment: IdeaComment = {
      id: crypto.randomUUID(),
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonyme',
      text,
      created_at: new Date().toISOString(),
    }

    // Lire le state actuel AVANT la mise à jour pour construire le tableau complet
    const currentIdea = ideas.find(i => i.id === ideaId)
    const commentsToSave = [...(currentIdea?.comments || []), newComment]

    // Optimistic update
    setIdeas(prev => prev.map(i => {
      if (i.id !== ideaId) return i
      return { ...i, comments: commentsToSave }
    }))

    // Persist to Supabase
    try {
      const { error } = await supabase
        .from('content_ideas')
        .update({ comments: commentsToSave, updated_at: new Date().toISOString() })
        .eq('id', ideaId)

      if (error) {
        console.warn('Comments not persisted (column may not exist):', error.message)
        // Rollback optimistic update
        setIdeas(prev => prev.map(i => {
          if (i.id !== ideaId) return i
          return { ...i, comments: (i.comments || []).filter(c => c.id !== newComment.id) }
        }))
        setError('Les commentaires nécessitent une migration Supabase. Exécute : ALTER TABLE content_ideas ADD COLUMN comments jsonb DEFAULT \'[]\';')
      }
    } catch {
      console.warn('Comments not persisted — column may not exist in Supabase')
    }
  }

  const handleDeleteComment = async (ideaId: string, commentId: string) => {
    const currentIdea = ideas.find(i => i.id === ideaId)
    const updatedComments = (currentIdea?.comments || []).filter(c => c.id !== commentId)

    setIdeas(prev => prev.map(i => i.id !== ideaId ? i : { ...i, comments: updatedComments }))

    try {
      const supabase = createClient()
      await supabase
        .from('content_ideas')
        .update({ comments: updatedComments, updated_at: new Date().toISOString() })
        .eq('id', ideaId)
    } catch {
      console.warn('Delete comment not persisted')
    }
  }

  const handleEditComment = async (ideaId: string, commentId: string, newText: string) => {
    const currentIdea = ideas.find(i => i.id === ideaId)
    const updatedComments = (currentIdea?.comments || []).map(c =>
      c.id === commentId ? { ...c, text: newText } : c
    )

    setIdeas(prev => prev.map(i => i.id !== ideaId ? i : { ...i, comments: updatedComments }))

    try {
      const supabase = createClient()
      await supabase
        .from('content_ideas')
        .update({ comments: updatedComments, updated_at: new Date().toISOString() })
        .eq('id', ideaId)
    } catch {
      console.warn('Edit comment not persisted')
    }
  }

  // ---- Scheduling ----

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

  // ---- Drag handlers ----

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
    setDragOverCardId(null)
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
      if (dragOverColumn === statusValue) setDragOverColumn(null)
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
      if (!dragOverCardId) {
        const idea = ideas.find(i => i.id === ideaId)
        if (idea && idea.status !== newStatus) {
          handleStatusChange(ideaId, newStatus)
        }
      }
    }
    setDraggedId(null)
    setDragOverColumn(null)
    setDragOverCardId(null)
    dragCounter.current = {}
  }

  const handleCardDragOver = (e: React.DragEvent, cardId: string) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    if (cardId === draggedId) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    setDragOverCardId(cardId)
    setDragOverCardPosition(e.clientY < midY ? 'before' : 'after')
  }

  const handleCardDragLeave = (e: React.DragEvent, cardId: string) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null
    if (relatedTarget && (e.currentTarget as HTMLElement).contains(relatedTarget)) return
    if (dragOverCardId === cardId) setDragOverCardId(null)
  }

  const handleCardDrop = (e: React.DragEvent, targetIdea: ContentIdea) => {
    e.preventDefault()
    e.stopPropagation()
    const ideaId = e.dataTransfer.getData('text/plain')
    if (!ideaId || ideaId === targetIdea.id || !draggedId) return
    handleReorder(ideaId, targetIdea.id, dragOverCardPosition)
    setDraggedId(null)
    setDragOverColumn(null)
    setDragOverCardId(null)
    dragCounter.current = {}
  }

  const handleCalendarDragOver = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverDate(dateKey)
  }

  const handleCalendarDragLeave = () => { setDragOverDate(null) }

  const handleCalendarDrop = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault()
    const ideaId = e.dataTransfer.getData('text/plain')
    if (ideaId) {
      const idea = ideas.find(i => i.id === ideaId)
      if (idea && idea.status !== 'idee') handleScheduleDate(ideaId, dateKey)
    }
    setDraggedId(null)
    setDragOverDate(null)
    dragCounter.current = {}
  }

  // ---- Filtering & sorting ----

  const hasActiveFilters = filterPlatforms.length > 0 || filterPillar !== null
  const activeFilterCount = filterPlatforms.length + (filterPillar ? 1 : 0)

  const filteredIdeas = ideas.filter(idea => {
    // Archive toggle
    if (showArchived) return idea.status === 'archive'
    if (idea.status === 'archive') return false

    if (filterPlatforms.length > 0) {
      const ideaPlatforms = getIdeaPlatforms(idea)
      if (!filterPlatforms.some(fp => ideaPlatforms.includes(fp))) return false
    }
    if (filterPillar && idea.pillar !== filterPillar) return false
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      if (!idea.title.toLowerCase().includes(q) && !(idea.description || '').toLowerCase().includes(q)) return false
    }
    return true
  })

  const sortedFilteredIdeas = sortByLikes
    ? [...filteredIdeas].sort((a, b) => (b.liked_by?.length || 0) - (a.liked_by?.length || 0))
    : filteredIdeas

  // ---- Loading ----

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleNewIdea = () => {
    resetForm()
    setShowForm(true)
  }

  const expandedIdea = expandedId ? ideas.find(i => i.id === expandedId) : null

  // ---- Status counts for tabs ----
  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s.value] = ideas.filter(i => i.status === s.value).length
    return acc
  }, {} as Record<string, number>)

  const views: { key: ViewMode; label: string; icon: typeof Columns3 }[] = [
    { key: 'board', label: 'Board', icon: Columns3 },
    { key: 'list', label: 'Liste', icon: List },
    { key: 'calendar', label: 'Calendrier', icon: CalendarDays },
    { key: 'dashboard', label: 'Stats', icon: BarChart3 },
  ]

  return (
    <div>
      {/* Header — compact */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-bleu-nuit">
            Idées de contenus
          </h1>
          <p className="text-sm text-bleu-nuit/50 mt-0.5">
            {ideas.length} idée{ideas.length !== 1 ? 's' : ''}
            {' '}&middot;{' '}
            {statusCounts.valide || 0} validée{(statusCounts.valide || 0) !== 1 ? 's' : ''}
            {' '}&middot;{' '}
            {statusCounts.en_cours || 0} en cours
            {' '}&middot;{' '}
            {statusCounts.publie || 0} publiée{(statusCounts.publie || 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors border border-gris-leger/30 bg-white text-bleu-nuit/60 hover:text-bleu-nuit hover:border-bleu-nuit/20"
            title="Exporter en CSV"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleNewIdea}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors bg-teal text-white hover:bg-teal-dark"
          >
            <Plus size={16} />
            Nouvelle idée
          </button>
        </div>
      </div>

      {/* Toolbar — une seule ligne */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {/* View tabs — hidden on mobile */}
        {!isMobile && (
          <div className="flex items-center bg-white rounded-lg border border-gris-leger/30 p-0.5">
            {views.map(v => {
              const Icon = v.icon
              return (
                <button
                  key={v.key}
                  onClick={() => setViewMode(v.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium transition-all ${
                    viewMode === v.key ? 'bg-teal text-white shadow-sm' : 'text-bleu-nuit/50 hover:text-bleu-nuit'
                  }`}
                >
                  <Icon size={14} />
                  {v.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Search bar */}
        <div className="relative flex-1 min-w-[140px] max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-bleu-nuit/30 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs border border-gris-leger/30 bg-white text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all"
          />
        </div>

        {/* Sort by likes */}
        <button
          onClick={() => setSortByLikes(!sortByLikes)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
            sortByLikes
              ? 'border-error/30 bg-error/5 text-error'
              : 'border-gris-leger/30 bg-white text-bleu-nuit/50 hover:text-error/60'
          }`}
        >
          <Heart size={13} fill={sortByLikes ? 'currentColor' : 'none'} />
          Likes
        </button>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
            showFilters || hasActiveFilters
              ? 'border-teal/30 bg-teal/5 text-teal'
              : 'border-gris-leger/30 bg-white text-bleu-nuit/50 hover:text-bleu-nuit'
          }`}
        >
          <SlidersHorizontal size={13} />
          Filtres
          {activeFilterCount > 0 && (
            <span className="ml-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full bg-teal text-white text-[10px] font-bold leading-none px-1.5 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Archive toggle */}
        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
            showArchived
              ? 'border-bleu-nuit/20 bg-bleu-nuit/5 text-bleu-nuit/60'
              : 'border-gris-leger/30 bg-white text-bleu-nuit/50 hover:text-bleu-nuit'
          }`}
        >
          <Archive size={13} />
          Archives
        </button>
      </div>

      {/* Filter panel — collapsible */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gris-leger/30 p-4 mb-5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-bleu-nuit/70">Filtrer par</span>
            {hasActiveFilters && (
              <button
                onClick={() => { setFilterPlatforms([]); setFilterPillar(null) }}
                className="flex items-center gap-1 text-[11px] text-bleu-nuit/40 hover:text-bleu-nuit/70 transition-colors"
              >
                <X size={12} />
                Tout effacer
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-1.5">Plateforme</label>
              <PlatformFilterChips selected={filterPlatforms} onChange={setFilterPlatforms} />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-1.5">Pilier</label>
              <div className="flex flex-wrap gap-1.5">
                {PILLARS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setFilterPillar(filterPillar === p.value ? null : p.value)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border ${
                      filterPillar === p.value
                        ? 'border-current bg-current/10'
                        : 'border-gris-leger/40 text-bleu-nuit/50 hover:border-bleu-nuit/20'
                    }`}
                    style={filterPillar === p.value ? { color: p.color } : undefined}
                  >
                    <span>{p.emoji}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-error/10 text-error text-sm border border-error/20">
          {error}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <IdeaForm
          editingId={editingId}
          formTitle={formTitle}
          formDescription={formDescription}
          formLink={formLink}
          formPlatforms={formPlatforms}
          formContentTypes={formContentTypes}
          formPillar={formPillar}
          formEffort={formEffort}
          formAudience={formAudience}
          formStatus={formStatus}
          onTitleChange={setFormTitle}
          onDescriptionChange={setFormDescription}
          onLinkChange={setFormLink}
          onPlatformsChange={setFormPlatforms}
          onContentTypesChange={setFormContentTypes}
          onPillarChange={setFormPillar}
          onEffortChange={setFormEffort}
          onAudienceChange={setFormAudience}
          onStatusChange={setFormStatus}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      {expandedIdea && (
        <IdeaDetail
          idea={expandedIdea}
          userId={userId}
          onClose={() => setExpandedId(null)}
          onEdit={startEdit}
          onDelete={handleDelete}
          onLike={handleLike}
          onDuplicate={handleDuplicate}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
        />
      )}

      {/* ===================== VIEWS ===================== */}

      {/* Empty state */}
      {viewMode === 'dashboard' ? (
        /* ---- DASHBOARD VIEW ---- */
        <Dashboard ideas={ideas} />
      ) : sortedFilteredIdeas.length === 0 && viewMode !== 'calendar' ? (
        <div className="bg-white rounded-lg border border-gris-leger/30 p-12 text-center">
          <Lightbulb size={40} className="mx-auto text-bleu-nuit/20 mb-4" />
          <p className="text-bleu-nuit/50 text-sm mb-4">
            {showArchived
              ? 'Aucune idée archivée.'
              : ideas.length === 0
                ? 'Aucune idée pour le moment. Sois le premier à proposer !'
                : 'Aucun résultat pour ces filtres.'}
          </p>
          {ideas.length === 0 && !showArchived && (
            <button
              onClick={handleNewIdea}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors"
            >
              <Plus size={14} />
              Ajouter une idée
            </button>
          )}
        </div>
      ) : showArchived ? (
        /* ---- ARCHIVED LIST VIEW ---- */
        <div className="space-y-3">
          {sortedFilteredIdeas.map(idea => (
            <KanbanCard
              key={idea.id}
              idea={idea}
              userId={userId}
              draggedId={draggedId}
              dragOverCardId={dragOverCardId}
              dragOverCardPosition={dragOverCardPosition}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onEdit={startEdit}
              onDelete={handleDelete}
              onLike={handleLike}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : viewMode === 'board' ? (
        /* ---- BOARD VIEW ---- */
        <div className="grid grid-cols-4 gap-4">
          {STATUSES.filter(s => s.value !== 'archive').map(status => {
            const columnIdeas = sortedFilteredIdeas
              .filter(i => i.status === status.value)
              .sort((a, b) => sortByLikes
                ? (b.liked_by?.length || 0) - (a.liked_by?.length || 0)
                : (a.position || 0) - (b.position || 0)
              )
            const isOver = dragOverColumn === status.value

            return (
              <div
                key={status.value}
                onDragEnter={(e) => handleColumnDragEnter(e, status.value)}
                onDragLeave={() => handleColumnDragLeave(status.value)}
                onDragOver={handleColumnDragOver}
                onDrop={(e) => handleColumnDrop(e, status.value)}
                className={`rounded-lg transition-all min-h-[300px] flex flex-col ${
                  isOver ? 'bg-white ring-2 shadow-lg' : 'bg-blanc-casse/60'
                }`}
                style={isOver ? { '--tw-ring-color': status.color } as React.CSSProperties : undefined}
              >
                <div className={`flex items-center justify-between px-3 py-3 rounded-t-lg ${status.headerBg}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status.dot}`} />
                    <span className={`text-sm font-semibold ${status.text}`}>{status.label}</span>
                  </div>
                  <span className={`text-xs font-mono font-medium ${status.text} opacity-60`}>
                    {columnIdeas.length}
                  </span>
                </div>

                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {columnIdeas.map(idea => (
                    <KanbanCard
                      key={idea.id}
                      idea={idea}
                      compact
                      userId={userId}
                      draggedId={draggedId}
                      dragOverCardId={dragOverCardId}
                      dragOverCardPosition={dragOverCardPosition}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onCardDragOver={handleCardDragOver}
                      onCardDragLeave={handleCardDragLeave}
                      onCardDrop={handleCardDrop}
                      onExpand={setExpandedId}
                      onEdit={startEdit}
                      onDelete={handleDelete}
                      onLike={handleLike}
                      onArchive={handleArchive}
                      onDuplicate={handleDuplicate}
                    />
                  ))}

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
      ) : viewMode === 'list' ? (
        /* ---- LIST VIEW ---- */
        <div className="space-y-3">
          {sortedFilteredIdeas.map(idea => (
            <KanbanCard
              key={idea.id}
              idea={idea}
              userId={userId}
              draggedId={draggedId}
              dragOverCardId={dragOverCardId}
              dragOverCardPosition={dragOverCardPosition}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onEdit={startEdit}
              onDelete={handleDelete}
              onLike={handleLike}
              onArchive={handleArchive}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : (
        /* ---- CALENDAR VIEW ---- */
        <MilestoneCalendar
          ideas={ideas}
          weekOffset={weekOffset}
          onWeekOffsetChange={setWeekOffset}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onScheduleDate={handleScheduleDate}
          dragOverDate={dragOverDate}
          onCalendarDragOver={handleCalendarDragOver}
          onCalendarDragLeave={handleCalendarDragLeave}
          onCalendarDrop={handleCalendarDrop}
        />
      )}
    </div>
  )
}
