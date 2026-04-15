import type { ContentIdea } from './types'
import { timeAgo } from './utils'

interface ActivityFeedProps {
  ideas: ContentIdea[]
}

interface ActivityEvent {
  type: 'idea' | 'comment' | 'takeaway' | 'poll'
  icon: string
  text: string
  date: string
}

export function ActivityFeed({ ideas }: ActivityFeedProps) {
  const events: ActivityEvent[] = []

  for (const idea of ideas) {
    // Idea created
    events.push({
      type: 'idea',
      icon: '👤',
      text: `${idea.user_name || idea.user_email?.split('@')[0] || 'Quelqu\'un'} a proposé « ${idea.title} »`,
      date: idea.created_at,
    })

    // Comments
    for (const comment of idea.comments || []) {
      events.push({
        type: 'comment',
        icon: '💬',
        text: `${comment.user_name} a commenté sur « ${idea.title} »`,
        date: comment.created_at,
      })
    }

    // Takeaways
    for (const takeaway of idea.takeaways || []) {
      events.push({
        type: 'takeaway',
        icon: '💡',
        text: `${takeaway.user_name} a ajouté un point clé sur « ${idea.title} »`,
        date: takeaway.created_at,
      })
    }

    // Polls
    for (const poll of idea.polls || []) {
      events.push({
        type: 'poll',
        icon: '📊',
        text: `Sondage ouvert sur « ${idea.title} »`,
        date: poll.created_at,
      })
    }
  }

  // Sort by most recent, take 15
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const recentEvents = events.slice(0, 15)

  return (
    <div className="bg-white rounded-lg border border-gris-leger/30 p-5">
      <h3 className="text-sm font-semibold text-bleu-nuit mb-4">Fil d&apos;activité</h3>

      {recentEvents.length === 0 ? (
        <p className="text-xs text-bleu-nuit/30">Aucune activité pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {recentEvents.map((event, index) => (
            <div key={`${event.date}-${index}`} className="flex items-start gap-2.5">
              <span className="text-sm shrink-0 mt-0.5">{event.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-bleu-nuit/60 leading-relaxed line-clamp-2">{event.text}</p>
                <p className="text-[10px] text-bleu-nuit/30 mt-0.5">{timeAgo(event.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
