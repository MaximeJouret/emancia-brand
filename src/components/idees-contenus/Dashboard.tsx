import { STATUSES, PLATFORMS, PILLARS, EFFORTS } from './types'
import type { ContentIdea } from './types'
import { getStatusInfo, getIdeaPlatforms, timeAgo } from './utils'

interface DashboardProps {
  ideas: ContentIdea[]
}

export function Dashboard({ ideas }: DashboardProps) {
  // --- Status distribution ---
  const statusCounts = STATUSES.map(s => ({
    ...s,
    count: ideas.filter(i => i.status === s.value).length,
  }))
  const maxStatusCount = Math.max(...statusCounts.map(s => s.count), 1)

  // --- Platform distribution ---
  const platformCounts = PLATFORMS.map(p => {
    const count = ideas.filter(i => getIdeaPlatforms(i).includes(p.value)).length
    return { ...p, count }
  }).filter(p => p.count > 0)
  const maxPlatformCount = Math.max(...platformCounts.map(p => p.count), 1)

  // --- Pillar distribution ---
  const pillarCounts = PILLARS.map(p => ({
    ...p,
    count: ideas.filter(i => i.pillar === p.value).length,
  })).filter(p => p.count > 0)
  const maxPillarCount = Math.max(...pillarCounts.map(p => p.count), 1)

  // --- Effort distribution ---
  const effortCounts = EFFORTS.map(e => ({
    ...e,
    count: ideas.filter(i => i.effort === e.value).length,
    percentage: ideas.length > 0 ? Math.round((ideas.filter(i => i.effort === e.value).length / ideas.length) * 100) : 0,
  }))

  // --- Recent activity ---
  const recentIdeas = [...ideas]
    .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
    .slice(0, 5)

  if (ideas.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gris-leger/30 p-12 text-center">
        <p className="text-bleu-nuit/50 text-sm">Aucune donnée disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. Status distribution */}
      <div className="bg-white rounded-lg border border-gris-leger/30 p-5">
        <h3 className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-4">
          Repartition par statut
        </h3>
        <div className="space-y-3">
          {statusCounts.map(s => (
            <div key={s.value} className="flex items-center gap-3">
              <span className="text-xs font-medium text-bleu-nuit/70 w-16 shrink-0">{s.label}</span>
              <div className="flex-1 h-6 bg-blanc-casse rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500"
                  style={{
                    width: `${(s.count / maxStatusCount) * 100}%`,
                    backgroundColor: s.color,
                    minWidth: s.count > 0 ? '8px' : '0',
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-bleu-nuit/60 w-8 text-right">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Platform distribution */}
      <div className="bg-white rounded-lg border border-gris-leger/30 p-5">
        <h3 className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-4">
          Repartition par plateforme
        </h3>
        <div className="space-y-3">
          {platformCounts.map(p => {
            const Icon = p.icon
            return (
              <div key={p.value} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-24 shrink-0">
                  <Icon size={14} style={{ color: p.color }} />
                  <span className="text-xs font-medium text-bleu-nuit/70">{p.label}</span>
                </div>
                <div className="flex-1 h-6 bg-blanc-casse rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-500"
                    style={{
                      width: `${(p.count / maxPlatformCount) * 100}%`,
                      backgroundColor: p.color,
                      opacity: 0.8,
                      minWidth: p.count > 0 ? '8px' : '0',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-bleu-nuit/60 w-8 text-right">{p.count}</span>
              </div>
            )
          })}
          {platformCounts.length === 0 && (
            <p className="text-xs text-bleu-nuit/30">Aucune plateforme assignee.</p>
          )}
        </div>
      </div>

      {/* 3. Pillar distribution */}
      <div className="bg-white rounded-lg border border-gris-leger/30 p-5">
        <h3 className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-4">
          Repartition par pilier
        </h3>
        <div className="space-y-3">
          {pillarCounts.map(p => (
            <div key={p.value} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-32 shrink-0">
                <span className="text-sm">{p.emoji}</span>
                <span className="text-xs font-medium text-bleu-nuit/70 truncate">{p.label}</span>
              </div>
              <div className="flex-1 h-6 bg-blanc-casse rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500"
                  style={{
                    width: `${(p.count / maxPillarCount) * 100}%`,
                    backgroundColor: p.color,
                    opacity: 0.7,
                    minWidth: p.count > 0 ? '8px' : '0',
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-bleu-nuit/60 w-8 text-right">{p.count}</span>
            </div>
          ))}
          {pillarCounts.length === 0 && (
            <p className="text-xs text-bleu-nuit/30">Aucun pilier assigne.</p>
          )}
        </div>
      </div>

      {/* 4. Effort distribution */}
      <div className="bg-white rounded-lg border border-gris-leger/30 p-5">
        <h3 className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-4">
          Repartition par effort
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {effortCounts.map(e => (
            <div
              key={e.value}
              className="rounded-lg border border-gris-leger/30 p-4 text-center"
              style={{ borderColor: `${e.color}30` }}
            >
              <span className="text-2xl block mb-1">{e.icon}</span>
              <p className="text-lg font-semibold" style={{ color: e.color }}>{e.count}</p>
              <p className="text-[10px] text-bleu-nuit/40 mt-0.5">{e.label}</p>
              <p className="text-[10px] font-medium mt-1" style={{ color: e.color }}>{e.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recent activity */}
      <div className="bg-white rounded-lg border border-gris-leger/30 p-5 md:col-span-2">
        <h3 className="text-[10px] uppercase tracking-wider text-bleu-nuit/40 font-medium mb-4">
          Activite recente
        </h3>
        <div className="space-y-3">
          {recentIdeas.map((idea, index) => {
            const status = getStatusInfo(idea.status)
            const isUpdated = idea.updated_at !== idea.created_at
            return (
              <div key={idea.id} className="flex items-center gap-3">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
                  {index < recentIdeas.length - 1 && (
                    <div className="w-px h-6 bg-gris-leger/40 mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-bleu-nuit truncate">{idea.title}</span>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-bleu-nuit/30 mt-0.5">
                    {isUpdated ? 'Modifie' : 'Cree'} {timeAgo(isUpdated ? idea.updated_at : idea.created_at)}
                    {idea.user_name && ` par ${idea.user_name}`}
                  </p>
                </div>
              </div>
            )
          })}
          {recentIdeas.length === 0 && (
            <p className="text-xs text-bleu-nuit/30">Aucune activite recente.</p>
          )}
        </div>
      </div>
    </div>
  )
}
