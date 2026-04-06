import { PageHeader } from '@/components/PageHeader'
import { CommentsSection } from '@/components/CommentsSection'

const kpiData = [
  { label: 'Utilisateurs actifs', value: '12 450', change: '+18%', positive: true },
  { label: 'Articles publiés', value: '87', change: '+5', positive: true },
  { label: 'Temps moyen', value: '4m 32s', change: '-12%', positive: false },
  { label: 'Taux de complétion', value: '73%', change: '+4%', positive: true },
]

const barData = [
  { label: 'Jan', value: 45 },
  { label: 'Fév', value: 62 },
  { label: 'Mar', value: 58 },
  { label: 'Avr', value: 71 },
  { label: 'Mai', value: 85 },
  { label: 'Jun', value: 93 },
  { label: 'Jul', value: 78 },
  { label: 'Aoû', value: 88 },
]

const donutData = [
  { label: 'Actions', value: 45, color: '#1A8F8A' },
  { label: 'Obligations', value: 25, color: '#1A2B3C' },
  { label: 'Immobilier', value: 15, color: '#7A4F6D' },
  { label: 'Épargne', value: 10, color: '#A8C280' },
  { label: 'Crypto', value: 5, color: '#88C9C7' },
]

function DonutChart() {
  let cumulativePercent = 0
  const segments = donutData.map((d) => {
    const start = cumulativePercent
    cumulativePercent += d.value
    return `${d.color} ${start}% ${cumulativePercent}%`
  })

  return (
    <div className="flex items-center gap-8">
      <div
        className="w-40 h-40 rounded-full shrink-0"
        style={{
          background: `conic-gradient(${segments.join(', ')})`,
          maskImage: 'radial-gradient(circle, transparent 40%, black 41%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 40%, black 41%)',
        }}
      />
      <div className="space-y-2">
        {donutData.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-gris-texte/80">{d.label}</span>
            <span className="font-mono text-sm font-medium ml-auto">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GraphiquesPage() {
  const maxBar = Math.max(...barData.map(d => d.value))

  return (
    <>
      <PageHeader
        title="Graphiques & Data"
        description="Exemples de visualisations de données utilisant les couleurs de la charte Emancia. Ces templates servent de référence pour toute représentation graphique."
      />

      {/* KPI Cards */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Cartes KPI</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl p-5 border border-gris-leger/30">
              <p className="text-xs text-gris-texte/60 mb-1">{kpi.label}</p>
              <p className="text-2xl font-mono font-bold text-bleu-nuit">{kpi.value}</p>
              <p className={`text-xs font-medium mt-1 ${kpi.positive ? 'text-success' : 'text-error'}`}>
                {kpi.change}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bar Chart */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Graphique en barres</h2>
        <div className="bg-white rounded-xl p-6 border border-gris-leger/30">
          <p className="text-sm text-gris-texte/60 mb-4">Inscriptions mensuelles (2026)</p>

          {/* Y-axis + bars */}
          <div className="flex gap-2">
            {/* Y axis labels */}
            <div className="flex flex-col justify-between h-56 pr-1 text-right shrink-0 w-8">
              <span className="font-mono text-[10px] text-gris-texte/40">100</span>
              <span className="font-mono text-[10px] text-gris-texte/40">75</span>
              <span className="font-mono text-[10px] text-gris-texte/40">50</span>
              <span className="font-mono text-[10px] text-gris-texte/40">25</span>
              <span className="font-mono text-[10px] text-gris-texte/40">0</span>
            </div>

            {/* Chart area */}
            <div className="flex-1 relative">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="border-b border-gris-leger/40 h-0" />
                ))}
              </div>

              {/* Bars */}
              <div className="flex items-end gap-2 h-56 relative z-10">
                {barData.map((d, i) => {
                  const colors = ['#1A8F8A', '#1A8F8A', '#1A8F8A', '#1A8F8A', '#1A8F8A', '#1A2B3C', '#1A8F8A', '#1A8F8A']
                  return (
                    <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className="w-full rounded-t-md transition-all hover:opacity-80 relative group"
                        style={{
                          height: `${(d.value / maxBar) * 100}%`,
                          backgroundColor: i === 5 ? '#1A2B3C' : colors[i],
                        }}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-xs font-semibold text-bleu-nuit">
                          {d.value}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* X axis labels */}
          <div className="flex gap-2 ml-10">
            {barData.map((d) => (
              <div key={d.label} className="flex-1 text-center">
                <span className="text-xs text-gris-texte/50">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donut Chart */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Graphique circulaire</h2>
        <div className="bg-white rounded-xl p-6 border border-gris-leger/30">
          <p className="text-sm text-gris-texte/60 mb-6">Répartition d'un portefeuille diversifié</p>
          <DonutChart />
        </div>
      </section>

      {/* Line Chart (SVG) */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Graphique linéaire</h2>
        <div className="bg-white rounded-xl p-6 border border-gris-leger/30">
          <p className="text-sm text-gris-texte/60 mb-6">Évolution du capital (simulation)</p>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A8F8A" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1A8F8A" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 50, 100, 150].map((y) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#E8E8E8" strokeWidth="0.5" />
            ))}
            {/* Area fill */}
            <polygon
              points="0,180 50,160 100,140 150,120 200,100 250,80 300,55 350,40 400,20 400,200 0,200"
              fill="url(#lineGradient)"
            />
            {/* Line */}
            <polyline
              points="0,180 50,160 100,140 150,120 200,100 250,80 300,55 350,40 400,20"
              fill="none"
              stroke="#1A8F8A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Points */}
            {[[0,180],[50,160],[100,140],[150,120],[200,100],[250,80],[300,55],[350,40],[400,20]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" fill="#1A8F8A" stroke="white" strokeWidth="2" />
            ))}
          </svg>
          <div className="flex justify-between mt-2">
            {['2026', '2028', '2030', '2032', '2034', '2036', '2038', '2040', '2042'].map((y) => (
              <span key={y} className="text-xs text-gris-texte/40 font-mono">{y}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Color Rules */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Règles chromatiques</h2>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-5 border border-gris-leger/30">
            <h3 className="font-semibold mb-1">Palette de données</h3>
            <p className="text-sm text-gris-texte/80">Utiliser les couleurs brand dans cet ordre : Teal, Bleu nuit, Prune, Sauge, Teal clair. Max 5 segments distincts.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gris-leger/30">
            <h3 className="font-semibold mb-1">Positif / Négatif</h3>
            <p className="text-sm text-gris-texte/80">Toujours utiliser les couleurs fonctionnelles : <span className="text-success font-medium">succès (#4CAF82)</span> pour le positif, <span className="text-error font-medium">erreur (#E05252)</span> pour le négatif.</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gris-leger/30">
            <h3 className="font-semibold mb-1">Typographie données</h3>
            <p className="text-sm text-gris-texte/80">Toujours utiliser <code className="font-mono text-teal bg-teal/5 px-1 rounded">JetBrains Mono</code> pour les chiffres et valeurs numériques.</p>
          </div>
        </div>
      </section>
      <CommentsSection pageSlug="graphiques" />
    </>
  )
}
