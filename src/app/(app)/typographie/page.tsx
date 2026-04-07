import { brand } from '@/lib/brand'
import { PageHeader } from '@/components/PageHeader'
import { CommentsSection } from '@/components/CommentsSection'

const hierarchy = [
  { level: 'H1', size: '40px', mobile: '28px', weight: 700, leading: '1.15', font: 'display' },
  { level: 'H2', size: '32px', mobile: '24px', weight: 600, leading: '1.2', font: 'display' },
  { level: 'H3', size: '24px', mobile: '20px', weight: 600, leading: '1.25', font: 'display' },
  { level: 'H4', size: '20px', mobile: '18px', weight: 600, leading: '1.3', font: 'display' },
  { level: 'Body', size: '16px', mobile: '16px', weight: 400, leading: '1.6', font: 'body' },
  { level: 'Small', size: '14px', mobile: '14px', weight: 400, leading: '1.5', font: 'body' },
  { level: 'Caption', size: '12px', mobile: '12px', weight: 500, leading: '1.4', font: 'body' },
  { level: 'Data', size: '16px', mobile: '14px', weight: 500, leading: '1.4', font: 'mono' },
]

function FontCard({ role, spec }: { role: string; spec: typeof brand.typography.display }) {
  return (
    <div className="bg-white rounded-xl p-8 border border-gris-leger mb-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-lg font-semibold">{role}</h3>
        <span className="text-xs font-mono text-bleu-nuit/60">
          {spec.weights.join(' · ')}
        </span>
      </div>
      <p
        className="text-4xl mb-3"
        style={{ fontFamily: `'${spec.family}', ${spec.fallback}` }}
      >
        {spec.family}
      </p>
      <p
        className="text-lg mb-4"
        style={{ fontFamily: `'${spec.family}', ${spec.fallback}` }}
      >
        Aa Bb Cc Dd Ee Ff Gg 0123456789 €$%
      </p>
      <p className="text-sm text-bleu-nuit/60">{spec.role}</p>
    </div>
  )
}

export default function TypographiePage() {
  return (
    <>
      <PageHeader
        title="Typographie"
        description="Le système typographique d'Emancia repose sur trois polices complémentaires : Fraunces pour le caractère, DM Sans pour la lisibilité, JetBrains Mono pour la précision des données."
      />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Polices</h2>
        <FontCard role="Display — Titres" spec={brand.typography.display} />
        <FontCard role="Body — Interface & texte" spec={brand.typography.body} />
        <FontCard role="Mono — Données financières" spec={brand.typography.mono} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Hiérarchie typographique</h2>
        <div className="bg-white rounded-xl border border-gris-leger overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-leger bg-teal-clair/50">
                <th className="text-left p-4 font-medium">Niveau</th>
                <th className="text-left p-4 font-medium">Taille</th>
                <th className="text-left p-4 font-medium">Mobile</th>
                <th className="text-left p-4 font-medium">Graisse</th>
                <th className="text-left p-4 font-medium">Interligne</th>
                <th className="text-left p-4 font-medium">Police</th>
              </tr>
            </thead>
            <tbody>
              {hierarchy.map((row) => (
                <tr key={row.level} className="border-b border-gris-leger/50">
                  <td className="p-4 font-mono font-medium">{row.level}</td>
                  <td className="p-4 font-mono">{row.size}</td>
                  <td className="p-4 font-mono">{row.mobile}</td>
                  <td className="p-4 font-mono">{row.weight}</td>
                  <td className="p-4 font-mono">{row.leading}</td>
                  <td className="p-4">{row.font === 'display' ? 'Fraunces' : row.font === 'mono' ? 'JetBrains Mono' : 'DM Sans'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Aperçu en contexte</h2>
        <div className="bg-white rounded-xl p-8 border border-gris-leger space-y-4">
          <h3 className="font-display text-3xl font-bold text-bleu-nuit">
            Comprendre l'inflation en 5 minutes
          </h3>
          <p className="text-bleu-nuit/70 leading-relaxed">
            L'inflation est la hausse générale des prix dans une économie. Quand le taux
            d'inflation augmente, votre pouvoir d'achat diminue — autrement dit, votre argent
            achète moins de choses qu'avant.
          </p>
          <div className="bg-teal-clair/20 border border-teal/10 rounded-lg p-4">
            <p className="font-mono text-sm text-bleu-nuit">
              Taux d'inflation annuel : <strong>3,2 %</strong> — Indice des prix : <strong>112,4</strong>
            </p>
          </div>
        </div>
      </section>
      <CommentsSection pageSlug="typographie" />
    </>
  )
}
