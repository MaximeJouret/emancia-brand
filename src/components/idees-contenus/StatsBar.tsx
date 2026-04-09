import { Heart } from 'lucide-react'
import { STATUSES } from './types'
import type { ContentIdea } from './types'

interface StatsBarProps {
  ideas: ContentIdea[]
  userId: string | null
  minVotes: number
}

export function StatsBar({ ideas, userId, minVotes }: StatsBarProps) {
  const stats = {
    total: ideas.length,
    idee: ideas.filter(i => i.status === 'idee').length,
    valide: ideas.filter(i => i.status === 'valide').length,
    en_cours: ideas.filter(i => i.status === 'en_cours').length,
    publie: ideas.filter(i => i.status === 'publie').length,
  }

  // Count how many OTHER people's ideas this user has liked
  const userLikeCount = userId
    ? ideas.filter(i => i.user_id !== userId && (i.liked_by || []).includes(userId)).length
    : 0
  const votesRemaining = Math.max(0, minVotes - userLikeCount)
  const hasEnoughVotes = votesRemaining === 0

  return (
    <div className="grid grid-cols-6 gap-3 mb-6">
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
      {/* Vote progress */}
      <div className={`rounded-lg p-4 border text-center transition-colors ${
        hasEnoughVotes
          ? 'bg-white border-gris-leger/30'
          : 'bg-error/5 border-error/20'
      }`}>
        <div className="flex items-center justify-center gap-1.5">
          <Heart size={16} className={hasEnoughVotes ? 'text-teal' : 'text-error'} fill={hasEnoughVotes ? 'currentColor' : 'none'} />
          <p className={`text-2xl font-semibold ${hasEnoughVotes ? 'text-teal' : 'text-error'}`}>
            {userLikeCount}/{minVotes}
          </p>
        </div>
        <p className="text-[11px] text-bleu-nuit/50 mt-0.5">
          {hasEnoughVotes ? 'Votes OK' : `${votesRemaining} vote${votesRemaining > 1 ? 's' : ''} requis`}
        </p>
      </div>
    </div>
  )
}
