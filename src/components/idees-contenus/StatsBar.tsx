import { STATUSES, PILLARS, EFFORTS } from './types'
import type { ContentIdea } from './types'

interface StatsBarProps {
  ideas: ContentIdea[]
}

export function StatsBar({ ideas }: StatsBarProps) {
  const stats = {
    total: ideas.length,
    idee: ideas.filter(i => i.status === 'idee').length,
    valide: ideas.filter(i => i.status === 'valide').length,
    en_cours: ideas.filter(i => i.status === 'en_cours').length,
    publie: ideas.filter(i => i.status === 'publie').length,
  }

  // Pillar distribution (top 3)
  const pillarCounts = PILLARS.map(p => ({
    ...p,
    count: ideas.filter(i => i.pillar === p.value).length,
  })).filter(p => p.count > 0).sort((a, b) => b.count - a.count).slice(0, 3)

  // Effort distribution
  const effortCounts = EFFORTS.map(e => ({
    ...e,
    count: ideas.filter(i => i.effort === e.value).length,
  }))

  return (
    <div className="space-y-3 mb-6">
      {/* Status row */}
      <div className="grid grid-cols-5 gap-3">
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

      {/* Pillar + Effort insights row */}
      {ideas.length > 0 && (
        <div className="flex gap-3">
          {/* Pillars distribution */}
          {pillarCounts.length > 0 && (
            <div className="flex-1 bg-white rounded-lg px-4 py-3 border border-gris-leger/30">
              <p className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 mb-2 font-medium">Piliers</p>
              <div className="flex items-center gap-3">
                {pillarCounts.map(p => (
                  <div key={p.value} className="flex items-center gap-1.5">
                    <span className="text-sm">{p.emoji}</span>
                    <span className="text-xs text-bleu-nuit/60">{p.label}</span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ color: p.color, backgroundColor: `${p.color}12` }}
                    >
                      {p.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Effort distribution */}
          <div className="bg-white rounded-lg px-4 py-3 border border-gris-leger/30 shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 mb-2 font-medium">Effort</p>
            <div className="flex items-center gap-3">
              {effortCounts.map(e => (
                <div key={e.value} className="flex items-center gap-1">
                  <span className="text-sm">{e.icon}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: e.color }}
                  >
                    {e.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
