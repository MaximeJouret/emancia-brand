import { Pencil, Trash2, X, ExternalLink, CalendarDays, Heart, Copy } from 'lucide-react'
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
}

export function IdeaDetail({ idea, userId, onClose, onEdit, onDelete, onLike, onDuplicate, onAddComment, onDeleteComment, onEditComment }: IdeaDetailProps) {
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
