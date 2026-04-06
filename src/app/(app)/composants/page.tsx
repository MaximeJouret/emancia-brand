import { PageHeader } from '@/components/PageHeader'
import { CommentsSection } from '@/components/CommentsSection'

export default function ComposantsPage() {
  return (
    <>
      <PageHeader
        title="Composants UI"
        description="Les composants de l'interface Emancia suivent un design system cohérent basé sur les couleurs, la typographie et l'espacement définis dans cette charte."
      />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Boutons</h2>
        <div className="bg-white rounded-xl p-8 border border-gris-leger space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-teal text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-teal-dark transition-colors">
              Primaire
            </button>
            <button className="bg-prune text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
              CTA
            </button>
            <button className="border-2 border-teal text-teal px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-teal-clair transition-colors">
              Secondaire
            </button>
            <button className="text-teal px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-teal-clair/50 transition-colors">
              Ghost
            </button>
            <button className="bg-gris-leger text-gris-texte/40 px-6 py-2.5 rounded-lg font-medium text-sm cursor-not-allowed">
              Désactivé
            </button>
          </div>
          <div className="text-sm text-gris-texte/70 space-y-1">
            <p><strong>Border-radius :</strong> 8px (md)</p>
            <p><strong>Padding :</strong> 10px 24px</p>
            <p><strong>Font :</strong> DM Sans 500, 14px</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Cartes</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gris-leger">
            <h3 className="font-display text-lg font-semibold mb-2">Carte standard</h3>
            <p className="text-sm text-gris-texte/80 leading-relaxed">
              Fond blanc, bordure gris léger, border-radius 12px, padding 24px.
            </p>
          </div>
          <div className="bg-teal-clair rounded-xl p-6 border border-teal/10">
            <h3 className="font-display text-lg font-semibold text-teal-dark mb-2">Carte accentuée</h3>
            <p className="text-sm text-gris-texte/80 leading-relaxed">
              Fond teal clair, bordure teal/10, pour les sections mises en avant.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Alertes</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-success/10 rounded-lg p-4 border border-success/20">
            <span className="text-success font-bold">✓</span>
            <p className="text-sm">Votre profil a été mis à jour avec succès.</p>
          </div>
          <div className="flex items-start gap-3 bg-error/10 rounded-lg p-4 border border-error/20">
            <span className="text-error font-bold">!</span>
            <p className="text-sm">Une erreur est survenue. Veuillez réessayer.</p>
          </div>
          <div className="flex items-start gap-3 bg-warning/10 rounded-lg p-4 border border-warning/20">
            <span className="text-warning font-bold">⚠</span>
            <p className="text-sm">Attention, cette action est irréversible.</p>
          </div>
          <div className="flex items-start gap-3 bg-info/10 rounded-lg p-4 border border-info/20">
            <span className="text-info font-bold">i</span>
            <p className="text-sm">L'épargne de précaution recommandée est de 3 à 6 mois de dépenses.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Espacement</h2>
        <div className="bg-white rounded-xl p-8 border border-gris-leger">
          <p className="text-sm text-gris-texte/80 mb-4">
            Le système d'espacement est basé sur un module de <strong>4px</strong>.
            Tous les espacements sont des multiples de ce module.
          </p>
          <div className="flex items-end gap-4">
            {[4, 8, 12, 16, 24, 32, 48, 64].map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <div
                  className="bg-teal/20 border border-teal/30 rounded"
                  style={{ width: size, height: size }}
                />
                <span className="text-xs font-mono text-gris-texte/60">{size}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Grille responsive</h2>
        <div className="bg-white rounded-xl border border-gris-leger overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris-leger bg-teal-clair/50">
                <th className="text-left p-4 font-medium">Breakpoint</th>
                <th className="text-left p-4 font-medium">Largeur</th>
                <th className="text-left p-4 font-medium">Colonnes</th>
                <th className="text-left p-4 font-medium">Gouttière</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Mobile', width: '< 640px', cols: 4, gutter: '16px' },
                { name: 'Tablet', width: '640–1024px', cols: 8, gutter: '24px' },
                { name: 'Desktop', width: '1024–1280px', cols: 12, gutter: '24px' },
                { name: 'Wide', width: '> 1280px', cols: 12, gutter: '32px' },
              ].map((bp) => (
                <tr key={bp.name} className="border-b border-gris-leger/50">
                  <td className="p-4 font-medium">{bp.name}</td>
                  <td className="p-4 font-mono">{bp.width}</td>
                  <td className="p-4 font-mono">{bp.cols}</td>
                  <td className="p-4 font-mono">{bp.gutter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <CommentsSection pageSlug="composants" />
    </>
  )
}
