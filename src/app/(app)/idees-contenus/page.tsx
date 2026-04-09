'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Columns3, List, Heart, Lightbulb } from 'lucide-react'
import {
  KanbanCard, IdeaDetail, IdeaForm, MilestoneCalendar, StatsBar, PlatformFilterChips, VoteGate,
  STATUSES,
  getIdeaPlatforms,
} from '@/components/idees-contenus'

const MIN_VOTES_REQUIRED = 3
import type { ContentIdea } from '@/components/idees-contenus'

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
  const [sortByLikes, setSortByLikes] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showVoteGate, setShowVoteGate] = useState(false)

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

  // ---- Form handlers ----

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
    const types = idea.content_types?.length > 0 ? idea.content_types : idea.content_type ? [idea.content_type] : ['Post image']
    setFormContentTypes(types)
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

  const filteredIdeas = ideas.filter(idea => {
    if (filterPlatforms.length === 0) return true
    const ideaPlatforms = getIdeaPlatforms(idea)
    return filterPlatforms.some(fp => ideaPlatforms.includes(fp))
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

  // ---- Vote gate ----
  const userLikeCount = userId
    ? ideas.filter(i => i.user_id !== userId && (i.liked_by || []).includes(userId)).length
    : 0
  const hasEnoughVotes = userLikeCount >= MIN_VOTES_REQUIRED || ideas.length < MIN_VOTES_REQUIRED

  const handleNewIdea = () => {
    if (hasEnoughVotes) {
      resetForm()
      setShowForm(true)
    } else {
      setShowVoteGate(true)
    }
  }

  // Auto-close vote gate when enough votes reached
  useEffect(() => {
    if (showVoteGate && hasEnoughVotes) {
      setShowVoteGate(false)
      setShowForm(true)
    }
  }, [showVoteGate, hasEnoughVotes])

  // ---- Expanded idea ----
  const expandedIdea = expandedId ? ideas.find(i => i.id === expandedId) : null

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
              Glissez-déposez les cartes entre les colonnes pour changer leur statut, réorganisez-les par priorité, ou planifiez le tournage sur le calendrier.
            </p>
          </div>
          <button
            onClick={handleNewIdea}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors shrink-0 ${
              hasEnoughVotes
                ? 'bg-teal text-white hover:bg-teal-dark'
                : 'bg-bleu-nuit/10 text-bleu-nuit/50 hover:bg-bleu-nuit/15'
            }`}
          >
            <Plus size={16} />
            Nouvelle idée
            {!hasEnoughVotes && (
              <span className="ml-1 text-[10px] bg-error/15 text-error px-1.5 py-0.5 rounded-full font-semibold">
                {MIN_VOTES_REQUIRED - userLikeCount} votes
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar ideas={ideas} userId={userId} minVotes={MIN_VOTES_REQUIRED} />

      {/* Filters + View toggle */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <PlatformFilterChips selected={filterPlatforms} onChange={setFilterPlatforms} />

        {filterPlatforms.length > 0 && (
          <button
            onClick={() => setFilterPlatforms([])}
            className="text-xs text-bleu-nuit/40 hover:text-bleu-nuit/70 transition-colors underline"
          >
            Tout afficher
          </button>
        )}

        <div className="h-4 w-px bg-gris-leger/30 mx-1" />

        <button
          onClick={() => setSortByLikes(!sortByLikes)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
            sortByLikes
              ? 'border-error/30 bg-error/5 text-error'
              : 'border-gris-leger/50 text-bleu-nuit/40 hover:border-error/20 hover:text-error/60'
          }`}
        >
          <Heart size={12} fill={sortByLikes ? 'currentColor' : 'none'} />
          Plus likées
        </button>

        <div className="flex items-center gap-1 ml-auto bg-white rounded-lg border border-gris-leger/30 p-0.5">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'board' ? 'bg-teal text-white' : 'text-bleu-nuit/50 hover:text-bleu-nuit'
            }`}
          >
            <Columns3 size={13} />
            Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'list' ? 'bg-teal text-white' : 'text-bleu-nuit/50 hover:text-bleu-nuit'
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
        <IdeaForm
          editingId={editingId}
          formTitle={formTitle}
          formDescription={formDescription}
          formLink={formLink}
          formPlatforms={formPlatforms}
          formContentTypes={formContentTypes}
          formStatus={formStatus}
          onTitleChange={setFormTitle}
          onDescriptionChange={setFormDescription}
          onLinkChange={setFormLink}
          onPlatformsChange={setFormPlatforms}
          onContentTypesChange={setFormContentTypes}
          onStatusChange={setFormStatus}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      {/* Vote gate modal */}
      {showVoteGate && userId && (
        <VoteGate
          ideas={ideas}
          userId={userId}
          minVotes={MIN_VOTES_REQUIRED}
          userLikeCount={userLikeCount}
          onLike={handleLike}
          onClose={() => setShowVoteGate(false)}
        />
      )}

      {/* Expanded card modal */}
      {expandedIdea && (
        <IdeaDetail
          idea={expandedIdea}
          userId={userId}
          onClose={() => setExpandedId(null)}
          onEdit={startEdit}
          onDelete={handleDelete}
          onLike={handleLike}
        />
      )}

      {/* Content */}
      {sortedFilteredIdeas.length === 0 ? (
        <div className="bg-white rounded-lg border border-gris-leger/30 p-12 text-center">
          <Lightbulb size={40} className="mx-auto text-bleu-nuit/20 mb-4" />
          <p className="text-bleu-nuit/50 text-sm mb-4">
            {ideas.length === 0
              ? 'Aucune idée pour le moment. Sois le premier à proposer !'
              : 'Aucun résultat pour ces filtres.'}
          </p>
          {ideas.length === 0 && (
            <button
              onClick={handleNewIdea}
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
                    <div className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
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
      ) : (
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
            />
          ))}
        </div>
      )}

      {/* Milestone Calendar */}
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
    </div>
  )
}
