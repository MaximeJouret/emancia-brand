import React from 'react'
import { Pencil, Trash2, ExternalLink, GripVertical, CalendarDays, Heart, Archive, Copy } from 'lucide-react'
import type { ContentIdea } from './types'
import { getStatusInfo, getPlatformInfo, getPillarInfo, getEffortInfo, getIdeaPlatforms, getIdeaContentTypes, timeAgo } from './utils'
import { Linkify } from './Linkify'

interface KanbanCardProps {
  idea: ContentIdea
  compact?: boolean
  userId: string | null
  draggedId: string | null
  dragOverCardId: string | null
  dragOverCardPosition: 'before' | 'after'
  onDragStart: (e: React.DragEvent, ideaId: string) => void
  onDragEnd: (e: React.DragEvent) => void
  onCardDragOver?: (e: React.DragEvent, cardId: string) => void
  onCardDragLeave?: (e: React.DragEvent, cardId: string) => void
  onCardDrop?: (e: React.DragEvent, idea: ContentIdea) => void
  onExpand?: (ideaId: string) => void
  onEdit: (idea: ContentIdea) => void
  onDelete: (ideaId: string) => void
  onLike: (ideaId: string) => void
  onArchive?: (ideaId: string) => void
  onDuplicate?: (idea: ContentIdea) => void
}

function PlatformBadges({ idea }: { idea: ContentIdea }) {
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

function ContentTypeBadges({ idea }: { idea: ContentIdea }) {
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

function PillarBadge({ idea, size = 'sm' }: { idea: ContentIdea; size?: 'sm' | 'md' }) {
  const pillar = getPillarInfo(idea.pillar)
  if (!pillar) return null
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border ${
        size === 'sm' ? 'text-[9px] px-1 py-0.5' : 'text-[11px] px-1.5 py-0.5'
      }`}
      style={{ color: pillar.color, borderColor: `${pillar.color}30`, backgroundColor: `${pillar.color}08` }}
      title={pillar.label}
    >
      <span>{pillar.emoji}</span>
      {size === 'md' && pillar.label}
    </span>
  )
}

function EffortBadge({ idea }: { idea: ContentIdea }) {
  const effort = getEffortInfo(idea.effort)
  if (!effort) return null
  return (
    <span
      className="text-[9px] px-1 py-0.5 rounded font-medium"
      style={{ color: effort.color, backgroundColor: `${effort.color}12` }}
      title={`Effort : ${effort.label}`}
    >
      {effort.icon}
    </span>
  )
}

function LikeButton({ idea, userId, size = 'sm', onLike }: { idea: ContentIdea; userId: string | null; size?: 'sm' | 'md'; onLike: (id: string) => void }) {
  const likeCount = idea.liked_by?.length || 0
  const isLiked = userId ? (idea.liked_by || []).includes(userId) : false
  const iconSize = size === 'sm' ? 12 : 16

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onLike(idea.id) }}
      className={`flex items-center gap-1 transition-all ${
        size === 'sm'
          ? `px-1.5 py-0.5 rounded text-[10px] ${isLiked ? 'text-error' : 'text-bleu-nuit/30 hover:text-error/60'}`
          : `px-2.5 py-1 rounded-md text-xs ${isLiked ? 'text-error bg-error/5' : 'text-bleu-nuit/40 hover:text-error/60 hover:bg-error/5'}`
      }`}
      title={isLiked ? 'Retirer le like' : 'Liker cette idée'}
    >
      <Heart size={iconSize} fill={isLiked ? 'currentColor' : 'none'} />
      {likeCount > 0 && <span className="font-medium">{likeCount}</span>}
    </button>
  )
}

export { LikeButton, PlatformBadges, ContentTypeBadges, PillarBadge, EffortBadge }

export function KanbanCard({
  idea, compact = false, userId, draggedId,
  dragOverCardId, dragOverCardPosition,
  onDragStart, onDragEnd, onCardDragOver, onCardDragLeave, onCardDrop,
  onExpand, onEdit, onDelete, onLike, onArchive, onDuplicate,
}: KanbanCardProps) {
  const isOwner = userId === idea.user_id
  const isDropTarget = dragOverCardId === idea.id && draggedId !== idea.id

  return (
    <div
      key={idea.id}
      draggable
      onDragStart={(e) => onDragStart(e, idea.id)}
      onDragEnd={onDragEnd}
      onDragOver={compact && onCardDragOver ? (e) => onCardDragOver(e, idea.id) : undefined}
      onDragLeave={compact && onCardDragLeave ? (e) => onCardDragLeave(e, idea.id) : undefined}
      onDrop={compact && onCardDrop ? (e) => onCardDrop(e, idea) : undefined}
      onClick={() => { if (compact && !draggedId && onExpand) onExpand(idea.id) }}
      className={`bg-white rounded-lg border transition-all group relative ${
        compact ? 'p-3 cursor-pointer' : 'p-5 cursor-grab active:cursor-grabbing'
      } ${draggedId === idea.id ? 'opacity-50 scale-95' : ''} ${
        isDropTarget
          ? 'border-teal ring-1 ring-teal/20'
          : 'border-gris-leger/30 hover:shadow-md'
      }`}
    >
      {isDropTarget && compact && (
        <div
          className={`absolute left-1 right-1 h-0.5 bg-teal rounded-full z-10 ${
            dragOverCardPosition === 'before' ? '-top-1' : '-bottom-1'
          }`}
        />
      )}

      {compact ? (
        <div>
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <PlatformBadges idea={idea} />
            <PillarBadge idea={idea} size="sm" />
            <EffortBadge idea={idea} />
            <div className="flex items-center gap-0.5 ml-auto">
              <LikeButton idea={idea} userId={userId} size="sm" onLike={onLike} />
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onDuplicate && userId && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDuplicate(idea) }}
                    className="p-1 rounded text-bleu-nuit/30 hover:text-teal hover:bg-teal/5 transition-colors"
                    title="Dupliquer"
                  >
                    <Copy size={11} />
                  </button>
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(idea) }}
                      className="p-1 rounded text-bleu-nuit/30 hover:text-teal hover:bg-teal/5 transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={11} />
                    </button>
                    {isOwner && idea.status === 'publie' && onArchive && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onArchive(idea.id) }}
                        className="p-1 rounded text-bleu-nuit/30 hover:text-bleu-nuit/60 hover:bg-bleu-nuit/5 transition-colors"
                        title="Archiver"
                      >
                        <Archive size={11} />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(idea.id) }}
                      className="p-1 rounded text-bleu-nuit/30 hover:text-error hover:bg-error/5 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </>
                )}
              </div>
            </div>
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
            {(idea.comments?.length > 0 || idea.takeaways?.length > 0 || idea.polls?.length > 0) && (
              <div className="flex items-center gap-1.5 ml-auto">
                {idea.comments?.length > 0 && (
                  <span className="flex items-center gap-0.5" title={`${idea.comments.length} commentaire(s)`}>💬 {idea.comments.length}</span>
                )}
                {idea.takeaways?.length > 0 && (
                  <span className="flex items-center gap-0.5" title={`${idea.takeaways.length} point(s) clé(s)`}>💡 {idea.takeaways.length}</span>
                )}
                {idea.polls?.length > 0 && (
                  <span className="flex items-center gap-0.5" title="Sondage actif">📊</span>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-2">
            <GripVertical size={16} className="text-bleu-nuit/20 shrink-0" />
            <PlatformBadges idea={idea} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-bleu-nuit truncate">{idea.title}</h3>
              <PillarBadge idea={idea} size="md" />
              <EffortBadge idea={idea} />
              <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusInfo(idea.status).bg} ${getStatusInfo(idea.status).text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusInfo(idea.status).dot}`} />
                {getStatusInfo(idea.status).label}
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
              <ContentTypeBadges idea={idea} />
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

          <div className="flex items-center gap-1 shrink-0">
            <LikeButton idea={idea} userId={userId} size="md" onLike={onLike} />
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onDuplicate && userId && (
                <button
                  onClick={() => onDuplicate(idea)}
                  className="p-2 rounded-lg text-bleu-nuit/40 hover:text-teal hover:bg-teal/5 transition-colors"
                  title="Dupliquer"
                >
                  <Copy size={14} />
                </button>
              )}
              {isOwner && (
                <>
                  <button
                    onClick={() => onEdit(idea)}
                    className="p-2 rounded-lg text-bleu-nuit/40 hover:text-teal hover:bg-teal/5 transition-colors"
                    title="Modifier"
                  >
                    <Pencil size={14} />
                  </button>
                  {idea.status === 'publie' && onArchive && (
                    <button
                      onClick={() => onArchive(idea.id)}
                      className="p-2 rounded-lg text-bleu-nuit/40 hover:text-bleu-nuit/60 hover:bg-bleu-nuit/5 transition-colors"
                      title="Archiver"
                    >
                      <Archive size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(idea.id)}
                    className="p-2 rounded-lg text-bleu-nuit/40 hover:text-error hover:bg-error/5 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
