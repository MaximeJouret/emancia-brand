import { X, Heart, Vote } from 'lucide-react'
import type { ContentIdea } from './types'
import { getPlatformInfo, getIdeaPlatforms, timeAgo } from './utils'

interface VoteGateProps {
  ideas: ContentIdea[]
  userId: string
  minVotes: number
  userLikeCount: number
  onLike: (ideaId: string) => void
  onClose: () => void
}

export function VoteGate({ ideas, userId, minVotes, userLikeCount, onLike, onClose }: VoteGateProps) {
  const votesRemaining = minVotes - userLikeCount

  // Show ideas from OTHER users that this user hasn't voted on yet
  const unvotedIdeas = ideas
    .filter(i => i.user_id !== userId && !(i.liked_by || []).includes(userId))
    .sort((a, b) => (b.liked_by?.length || 0) - (a.liked_by?.length || 0))
    .slice(0, 12)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gris-leger/30 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-bleu-nuit/40 hover:text-bleu-nuit transition-colors"
          >
            <X size={18} />
          </button>
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-3">
            <Vote size={24} className="text-error" />
          </div>
          <h3 className="font-display text-lg font-semibold text-bleu-nuit">
            Vote d&apos;abord !
          </h3>
          <p className="text-sm text-bleu-nuit/60 mt-1">
            Like au moins <strong className="text-error">{minVotes} idées</strong> des autres membres avant de proposer la tienne.
          </p>
          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-gris-leger/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-error to-teal rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (userLikeCount / minVotes) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-mono font-semibold text-bleu-nuit">
              {userLikeCount}/{minVotes}
            </span>
          </div>
          {votesRemaining > 0 && (
            <p className="text-xs text-error mt-2">
              Encore {votesRemaining} vote{votesRemaining > 1 ? 's' : ''} nécessaire{votesRemaining > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Ideas to vote on */}
        <div className="max-h-[350px] overflow-y-auto p-4 space-y-2">
          {unvotedIdeas.length === 0 ? (
            <p className="text-center text-sm text-bleu-nuit/50 py-8">
              Aucune idée à voter pour le moment. Reviens plus tard !
            </p>
          ) : (
            unvotedIdeas.map(idea => {
              const platforms = getIdeaPlatforms(idea)
              const isLiked = (idea.liked_by || []).includes(userId)
              const likeCount = idea.liked_by?.length || 0

              return (
                <div
                  key={idea.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gris-leger/30 hover:border-teal/20 transition-all bg-white"
                >
                  {/* Platform icons */}
                  <div className="flex items-center gap-1 shrink-0">
                    {platforms.slice(0, 2).map(pv => {
                      const p = getPlatformInfo(pv)
                      if (!p) return null
                      const Icon = p.icon
                      return (
                        <div
                          key={pv}
                          className="w-6 h-6 rounded flex items-center justify-center"
                          style={{ backgroundColor: `${p.color}15` }}
                        >
                          <Icon size={12} style={{ color: p.color }} />
                        </div>
                      )
                    })}
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-bleu-nuit truncate">{idea.title}</p>
                    <p className="text-[10px] text-bleu-nuit/40">
                      {idea.user_name || idea.user_email?.split('@')[0]} · {timeAgo(idea.created_at)}
                    </p>
                  </div>

                  {/* Like button */}
                  <button
                    onClick={() => onLike(idea.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isLiked
                        ? 'bg-error/10 text-error border border-error/20'
                        : 'bg-blanc-casse text-bleu-nuit/50 hover:text-error hover:bg-error/5 border border-gris-leger/30 hover:border-error/20'
                    }`}
                  >
                    <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                    {likeCount > 0 && likeCount}
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gris-leger/30 bg-blanc-casse/50">
          <p className="text-[11px] text-bleu-nuit/40 text-center">
            Voter aide l&apos;équipe à prioriser les meilleurs contenus
          </p>
        </div>
      </div>
    </div>
  )
}
