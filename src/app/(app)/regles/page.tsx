import { PageHeader } from '@/components/PageHeader'
import { CommentsSection } from '@/components/CommentsSection'

interface RuleItem {
  do: string
  dont: string
}

const rules: { category: string; items: RuleItem[] }[] = [
  {
    category: 'Logo',
    items: [
      { do: 'Utiliser les fichiers SVG officiels', dont: 'Recréer le logo à partir d\'une capture d\'écran' },
      { do: 'Respecter la zone de protection de 1x', dont: 'Coller le logo au bord ou à un autre élément' },
      { do: 'Utiliser les déclinaisons chromatiques validées', dont: 'Appliquer des couleurs non autorisées' },
      { do: 'Adapter la version selon le contexte (icon, baseline)', dont: 'Utiliser le logotype complet quand seul l\'icône est nécessaire' },
    ],
  },
  {
    category: 'Couleurs',
    items: [
      { do: 'Utiliser les codes hex exacts de la palette', dont: 'Approximer les couleurs "à l\'oeil"' },
      { do: 'Vérifier le contraste WCAG AA (4.5:1 min)', dont: 'Placer du texte clair sur fond clair' },
      { do: 'Respecter le ratio 60/30/10 (blanc/teal/accent)', dont: 'Saturer l\'interface de teal ou de prune' },
      { do: 'Utiliser les couleurs fonctionnelles pour les feedbacks', dont: 'Utiliser le rouge pour autre chose qu\'une erreur' },
    ],
  },
  {
    category: 'Typographie',
    items: [
      { do: 'Fraunces pour les titres, DM Sans pour le corps', dont: 'Mélanger les rôles des polices' },
      { do: 'JetBrains Mono pour les chiffres et données', dont: 'Utiliser une police proportionnelle pour les tableaux de données' },
      { do: 'Respecter la hiérarchie H1 > H2 > H3 > H4', dont: 'Sauter des niveaux de titre (H1 puis H3)' },
      { do: 'Taille minimum de 16px pour le corps de texte', dont: 'Descendre en dessous de 12px pour du texte lisible' },
    ],
  },
  {
    category: 'Ton éditorial',
    items: [
      { do: 'Être pédagogue, clair et bienveillant', dont: 'Utiliser du jargon financier non expliqué' },
      { do: 'Tutoyer le lecteur sur les plateformes sociales', dont: 'Être condescendant ou moralisateur' },
      { do: 'Sourcer et vérifier chaque information financière', dont: 'Donner des conseils d\'investissement personnalisés' },
      { do: 'Rester neutre et transparent (pas de produit vendu)', dont: 'Promouvoir un produit financier directement ou indirectement' },
    ],
  },
]

export default function ReglesPage() {
  return (
    <>
      <PageHeader
        title="Do / Don't"
        description="Récapitulatif des bonnes pratiques et des erreurs à éviter lors de l'application de la charte graphique Emancia."
      />

      {rules.map((section) => (
        <section key={section.category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{section.category}</h2>
          <div className="space-y-3">
            {section.items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-start gap-3 bg-success/5 rounded-lg p-4 border border-success/15">
                  <span className="text-success font-bold text-lg leading-none shrink-0">✓</span>
                  <p className="text-sm">{item.do}</p>
                </div>
                <div className="flex items-start gap-3 bg-error/5 rounded-lg p-4 border border-error/15">
                  <span className="text-error font-bold text-lg leading-none shrink-0">×</span>
                  <p className="text-sm">{item.dont}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Accessibilité</h2>
        <div className="bg-white rounded-xl p-8 border border-gris-leger space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-teal font-bold text-lg leading-none">→</span>
            <p className="text-sm"><strong>WCAG 2.1 AA minimum</strong> — tous les contenus doivent atteindre ce niveau</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-teal font-bold text-lg leading-none">→</span>
            <p className="text-sm"><strong>Contraste texte</strong> — ratio minimum 4.5:1 pour le texte courant, 3:1 pour les titres ≥ 24px</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-teal font-bold text-lg leading-none">→</span>
            <p className="text-sm"><strong>Taille de police</strong> — jamais en dessous de 12px, corps de texte minimum 16px</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-teal font-bold text-lg leading-none">→</span>
            <p className="text-sm"><strong>Alternatives textuelles</strong> — toute image doit avoir un attribut alt descriptif</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-teal font-bold text-lg leading-none">→</span>
            <p className="text-sm"><strong>Navigation clavier</strong> — tous les éléments interactifs doivent être accessibles au clavier</p>
          </div>
        </div>
      </section>
      <CommentsSection pageSlug="regles" />
    </>
  )
}
