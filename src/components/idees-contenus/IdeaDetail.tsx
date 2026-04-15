'use client'

import { useState } from 'react'
import { Pencil, Trash2, X, ExternalLink, CalendarDays, Heart, Copy, Lightbulb, BarChart3, Check, Plus, Minus } from 'lucide-react'
import type { ContentIdea } from './types'
import { AUDIENCES } from './types'
import { getStatusInfo, getPlatformInfo, getPillarInfo, getEffortInfo, getIdeaPlatforms, getIdeaContentTypes, timeAgo } from './utils'
import { LikeButton } from './KanbanCard'
import { Linkify } from './Linkify'
import { CommentSection } from './CommentSection'

interface IdeaDetailProps {
  idea: ContentIdea
  userId: string | null
  onClose: () => void
  onEdit: (idea: ContentIdea) => void
  onDelete: (ideaId: string) => void
  onLike: (ideaId: string) => void
  onDuplicate?: (idea: ContentIdea) => void
  onAddComment?: (ideaId: string, text: string) => void
  onDeleteComment?: (ideaId: string, commentId: string) => void
  onEditComment?: (ideaId: string, commentId: string, newText: string) => void
  onAddTakeaway?: (ideaId: string, text: string) => void
  onDeleteTakeaway?: (ideaId: string, takeawayId: string) => void
  onEditTakeaway?: (ideaId: string, takeawayId: string, newText: string) => void
  onCreatePoll?: (ideaId: string, question: string, options: string[]) => void
  onVotePoll?: (ideaId: string, pollId: string, optionId: string) => void
  onDeletePoll?: (ideaId: string, pollId: string) => void
}

export function IdeaDetail({ idea, userId, onClose, onEdit, onDelete, onLike, onDuplicate, onAddComment, onDeleteComment, onEditComment, onAddTakeaway, onDeleteTakeaway, onEditTakeaway, onCreatePoll, onVotePoll, onDeletePoll }: IdeaDetailProps) {
  const status = getStatusInfo(idea.status)
  const isOwner = userId === idea.user_id
  const platforms = getIdeaPlatforms(idea)
  const contentTypes = getIdeaContentTypes(idea)
  const pillar = getPillarInfo(idea.pillar)
  const effort = getEffortInfo(idea.effort)
  const audiences = (idea.audience || []).map(a => AUDIENCES.find(au => au.value === a)?.label).filter(Boolean)

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gris-leger/30">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <LikeButton idea={idea} userId={userId} size="md" onLike={onLike} />
          </div>
          <div className="flex items-center gap-1">
            {onDuplicate && userId && (
              <button
                onClick={() => { onClose(); onDuplicate(idea) }}
                className="p-2 rounded-lg text-bleu-nuit/40 hover:text-teal hover:bg-teal/5 transition-colors"
                title="Dupliquer"
              >
                <Copy size={14} />
              </button>
            )}
            {isOwner && (
              <>
                <button
                  onClick={() => { onClose(); onEdit(idea) }}
                  className="p-2 rounded-lg text-bleu-nuit/40 hover:text-teal hover:bg-teal/5 transition-colors"
                  title="Modifier"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => { onClose(); onDelete(idea.id) }}
                  className="p-2 rounded-lg text-bleu-nuit/40 hover:text-error hover:bg-error/5 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-bleu-nuit/40 hover:text-bleu-nuit transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <h3 className="font-display text-lg font-semibold text-bleu-nuit">{idea.title}</h3>

          {/* Pillar + Effort + Audience */}
          <div className="flex items-center gap-2 flex-wrap">
            {pillar && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                style={{ color: pillar.color, borderColor: `${pillar.color}30`, backgroundColor: `${pillar.color}10` }}
              >
                <span>{pillar.emoji}</span>
                {pillar.label}
              </span>
            )}
            {effort && (
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                style={{ color: effort.color, backgroundColor: `${effort.color}12` }}
              >
                <span>{effort.icon}</span>
                {effort.label}
              </span>
            )}
            {audiences.length > 0 && audiences.map(a => (
              <span key={a} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-bleu-nuit/5 text-bleu-nuit/60">
                {a}
              </span>
            ))}
          </div>

          {idea.description && (
            <div className="text-sm text-bleu-nuit/70 leading-relaxed whitespace-pre-wrap">
              <Linkify text={idea.description} />
            </div>
          )}

          {idea.link && (
            <a
              href={idea.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark transition-colors"
            >
              <ExternalLink size={14} />
              <span className="underline underline-offset-2 break-all">{idea.link}</span>
            </a>
          )}

          <div className="flex flex-wrap gap-2">
            {platforms.map(pv => {
              const p = getPlatformInfo(pv)
              if (!p) return null
              const Icon = p.icon
              return (
                <span
                  key={pv}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                  style={{ color: p.color, borderColor: `${p.color}30`, backgroundColor: `${p.color}10` }}
                >
                  <Icon size={12} />
                  {p.label}
                </span>
              )
            })}
            {contentTypes.map(t => (
              <span key={t} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blanc-casse text-bleu-nuit/60 border border-gris-leger/30">
                {t}
              </span>
            ))}
          </div>

          {idea.scheduled_date && (
            <div className="flex items-center gap-1.5 text-sm text-prune">
              <CalendarDays size={14} />
              <span>Planifié le {new Date(idea.scheduled_date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          )}

          {(idea.liked_by?.length || 0) > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-gris-leger/20">
              <Heart size={14} className="text-error" fill="currentColor" />
              <span className="text-xs text-bleu-nuit/50">
                {idea.liked_by.length} like{idea.liked_by.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Points clés */}
        <TakeawaySection
          takeaways={idea.takeaways || []}
          userId={userId}
          onAdd={onAddTakeaway ? (text) => onAddTakeaway(idea.id, text) : undefined}
          onDelete={onDeleteTakeaway ? (takeawayId) => onDeleteTakeaway(idea.id, takeawayId) : undefined}
          onEdit={onEditTakeaway ? (takeawayId, newText) => onEditTakeaway(idea.id, takeawayId, newText) : undefined}
        />

        {/* Sondage */}
        <PollSection
          polls={idea.polls || []}
          userId={userId}
          onCreate={onCreatePoll ? (question, options) => onCreatePoll(idea.id, question, options) : undefined}
          onVote={onVotePoll ? (pollId, optionId) => onVotePoll(idea.id, pollId, optionId) : undefined}
          onDeletePoll={onDeletePoll ? (pollId) => onDeletePoll(idea.id, pollId) : undefined}
        />

        {onAddComment && (
          <CommentSection
            comments={idea.comments || []}
            userId={userId}
            onAddComment={(text) => onAddComment(idea.id, text)}
            onDeleteComment={(commentId) => onDeleteComment?.(idea.id, commentId)}
            onEditComment={(commentId, newText) => onEditComment?.(idea.id, commentId, newText)}
          />
        )}

        <div className="px-6 py-3 border-t border-gris-leger/30 bg-blanc-casse/50 flex items-center gap-3 text-xs text-bleu-nuit/40">
          <span>{idea.user_name || idea.user_email?.split('@')[0]}</span>
          <span>·</span>
          <span>{timeAgo(idea.created_at)}</span>
          {idea.updated_at !== idea.created_at && (
            <>
              <span>·</span>
              <span>modifié {timeAgo(idea.updated_at)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Takeaway Section ----

interface TakeawaySectionProps {
  takeaways: ContentIdea['takeaways']
  userId: string | null
  onAdd?: (text: string) => void
  onDelete?: (takeawayId: string) => void
  onEdit?: (takeawayId: string, newText: string) => void
}

function TakeawaySection({ takeaways, userId, onAdd, onDelete, onEdit }: TakeawaySectionProps) {
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || !onAdd) return
    onAdd(trimmed)
    setText('')
  }

  const startEdit = (t: ContentIdea['takeaways'][0]) => {
    setEditingId(t.id)
    setEditText(t.text)
  }

  const confirmEdit = () => {
    if (!editingId || !editText.trim() || !onEdit) return
    onEdit(editingId, editText.trim())
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  return (
    <div className="px-6 py-4 border-t border-gris-leger/30">
      <p className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-3 flex items-center gap-1.5">
        <Lightbulb size={12} className="text-warning" />
        Points clés {takeaways.length > 0 && `(${takeaways.length})`}
      </p>

      {takeaways.length > 0 && (
        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
          {takeaways.map((t) => {
            const isOwner = userId === t.user_id
            const isEditing = editingId === t.id

            return (
              <div key={t.id} className="group flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-semibold text-teal">
                    {(t.user_name || '?')[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-bleu-nuit">{t.user_name}</span>
                    <span className="text-[10px] text-bleu-nuit/30">{timeAgo(t.created_at)}</span>

                    {isOwner && !isEditing && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        <button
                          onClick={() => startEdit(t)}
                          className="p-1 rounded text-bleu-nuit/30 hover:text-teal transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          onClick={() => onDelete?.(t.id)}
                          className="p-1 rounded text-bleu-nuit/30 hover:text-error transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') cancelEdit() }}
                        autoFocus
                        className="flex-1 px-2 py-1 rounded text-xs border border-teal/30 bg-white text-bleu-nuit focus:outline-none focus:ring-1 focus:ring-teal/20 transition-all"
                      />
                      <button onClick={confirmEdit} className="p-1 rounded text-teal hover:bg-teal/10 transition-colors" title="Valider">
                        <Check size={13} />
                      </button>
                      <button onClick={cancelEdit} className="p-1 rounded text-bleu-nuit/30 hover:text-bleu-nuit transition-colors" title="Annuler">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-bleu-nuit/70 leading-relaxed mt-0.5 whitespace-pre-wrap">
                      {t.text}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {takeaways.length === 0 && (
        <p className="text-xs text-bleu-nuit/30 mb-3">Aucun point clé pour le moment.</p>
      )}

      {onAdd && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ajouter un point clé..."
            className="flex-1 px-3 py-2 rounded-lg text-xs border border-gris-leger/30 bg-blanc-casse text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2 rounded-lg bg-teal text-white hover:bg-teal-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Lightbulb size={14} />
          </button>
        </form>
      )}
    </div>
  )
}

// ---- Poll Section ----

interface PollSectionProps {
  polls: ContentIdea['polls']
  userId: string | null
  onCreate?: (question: string, options: string[]) => void
  onVote?: (pollId: string, optionId: string) => void
  onDeletePoll?: (pollId: string) => void
}

function PollSection({ polls, userId, onCreate, onVote, onDeletePoll }: PollSectionProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])

  const handleCreate = () => {
    const q = question.trim()
    const opts = options.map(o => o.trim()).filter(Boolean)
    if (!q || opts.length < 2 || !onCreate) return
    onCreate(q, opts)
    setQuestion('')
    setOptions(['', ''])
    setShowCreate(false)
  }

  const addOption = () => {
    if (options.length < 5) setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, value: string) => {
    setOptions(options.map((o, i) => i === index ? value : o))
  }

  const poll = polls.length > 0 ? polls[polls.length - 1] : null

  return (
    <div className="px-6 py-4 border-t border-gris-leger/30">
      <p className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-3 flex items-center gap-1.5">
        <BarChart3 size={12} className="text-teal" />
        Sondage
      </p>

      {poll ? (
        <PollDisplay poll={poll} userId={userId} onVote={onVote} onDelete={onDeletePoll} />
      ) : showCreate && onCreate ? (
        <div className="space-y-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question du sondage..."
            className="w-full px-3 py-2 rounded-lg text-xs border border-gris-leger/30 bg-blanc-casse text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all"
          />
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs border border-gris-leger/30 bg-white text-bleu-nuit placeholder:text-bleu-nuit/30 focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all"
                />
                {options.length > 2 && (
                  <button onClick={() => removeOption(i)} className="p-1 rounded text-bleu-nuit/30 hover:text-error transition-colors">
                    <Minus size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.length < 5 && (
            <button
              onClick={addOption}
              className="flex items-center gap-1 text-[11px] text-teal hover:text-teal-dark transition-colors"
            >
              <Plus size={12} /> Ajouter une option
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreate}
              disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-teal text-white hover:bg-teal-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Créer
            </button>
            <button
              onClick={() => { setShowCreate(false); setQuestion(''); setOptions(['', '']) }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-bleu-nuit/50 hover:text-bleu-nuit transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : onCreate ? (
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-gris-leger/30 bg-white text-bleu-nuit/50 hover:text-teal hover:border-teal/30 transition-all"
        >
          <BarChart3 size={13} />
          Créer un sondage
        </button>
      ) : (
        <p className="text-xs text-bleu-nuit/30">Aucun sondage.</p>
      )}
    </div>
  )
}

function PollDisplay({ poll, userId, onVote, onDelete }: { poll: ContentIdea['polls'][0]; userId: string | null; onVote?: (pollId: string, optionId: string) => void; onDelete?: (pollId: string) => void }) {
  const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes?.length || 0), 0)
  const isCreator = userId === poll.created_by

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-bleu-nuit">{poll.question}</p>
        {isCreator && onDelete && (
          <button
            onClick={() => onDelete(poll.id)}
            className="p-1 rounded text-bleu-nuit/30 hover:text-error transition-colors"
            title="Supprimer le sondage"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const voteCount = option.votes?.length || 0
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
          const hasVoted = userId ? (option.votes || []).includes(userId) : false

          return (
            <button
              key={option.id}
              onClick={() => onVote?.(poll.id, option.id)}
              disabled={!onVote || !userId}
              className={`w-full text-left relative overflow-hidden rounded-lg border transition-all ${
                hasVoted
                  ? 'border-teal/40 bg-teal/5'
                  : 'border-gris-leger/30 bg-white hover:border-teal/20'
              } ${!onVote || !userId ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div
                className="absolute inset-y-0 left-0 bg-teal/10 transition-all"
                style={{ width: `${percentage}%` }}
              />
              <div className="relative flex items-center justify-between px-3 py-2">
                <span className={`text-xs ${hasVoted ? 'font-medium text-teal' : 'text-bleu-nuit/70'}`}>
                  {hasVoted && <span className="mr-1">✓</span>}
                  {option.label}
                </span>
                <span className="text-[10px] text-bleu-nuit/40 font-medium">{voteCount}</span>
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-[10px] text-bleu-nuit/30">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
    </div>
  )
}
