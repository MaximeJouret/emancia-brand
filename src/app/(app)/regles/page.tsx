import { Check, X } from 'lucide-react'
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
      { do: 'Utiliser le logo-icon (favicon) pour les avatars et petits espaces', dont: 'Utiliser le mauvais format de logo pour le contexte' },
      { do: 'Utiliser le logo-baseline pour les premiers contacts et emails', dont: '' },
      { do: 'Utiliser le logo-main pour la navbar, le footer et les présentations', dont: '' },
    ],
  },
  {
    category: 'Couleurs',
    items: [
      { do: 'Utiliser les codes hex exacts de la palette', dont: 'Approximer les couleurs "à l\'oeil"' },
      { do: 'Vérifier le contraste WCAG AA (4.5:1 min)', dont: 'Placer du texte clair sur fond clair' },
      { do: 'Respecter le ratio 60/30/10 (blanc/teal/accent)', dont: 'Saturer l\'interface de teal ou de prune' },
      { do: 'Utiliser les couleurs fonctionnelles pour les feedbacks', dont: 'Utiliser le rouge pour autre chose qu\'une erreur' },
      { do: 'Utiliser le bleu nuit (#1A2B3C) pour tout le texte principal (pas de gris)', dont: 'Utiliser du gris (#4A4A4A) pour le texte — toujours bleu nuit' },
      { do: 'Respecter les proportions 60/30/10 (blanc cassé / bleu nuit / accents)', dont: 'Utiliser plus de 3 couleurs de la palette dans une même composition' },
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
  {
    category: 'Dark mode',
    items: [
      { do: 'Utiliser le bleu nuit profond (#0F1A24) comme fond sombre', dont: 'Utiliser du noir pur (#000000 ou #121212) en mode sombre' },
    ],
  },
  {
    category: 'Formes',
    items: [
      { do: 'Limiter le border-radius à 8px maximum (sauf pills et avatars)', dont: 'Utiliser des border-radius > 8px sans justification' },
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
          <h2 className="text-2xl font-semibold text-bleu-nuit mb-6">{section.category}</h2>
          <div className="space-y-3">
            {section.items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-start gap-3 bg-success/5 rounded-lg p-4 border border-success/15">
                  <Check className="text-success size-5 shrink-0 mt-0.5" />
                  <p className="text-sm text-bleu-nuit">{item.do}</p>
                </div>
                {item.dont ? (
                  <div className="flex items-start gap-3 bg-error/5 rounded-lg p-4 border border-error/15">
                    <X className="text-error size-5 shrink-0 mt-0.5" />
                    <p className="text-sm text-bleu-nuit/70">{item.dont}</p>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-bleu-nuit mb-6">Accessibilité</h2>
        <div className="bg-white rounded-xl p-8 border border-gris-leger space-y-6">
          {/* Contrastes WCAG */}
          <div>
            <h3 className="text-lg font-semibold text-bleu-nuit mb-3">Ratios de contraste WCAG</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Check className="text-teal size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit"><strong>4.5:1 minimum</strong> — pour tout le texte courant (&lt; 24px / &lt; 18.66px bold)</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-teal size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit"><strong>3:1 minimum</strong> — pour les titres ≥ 24px, les éléments graphiques et les composants d&apos;interface</p>
              </div>
            </div>
          </div>

          {/* Combinaisons autorisées */}
          <div>
            <h3 className="text-lg font-semibold text-bleu-nuit mb-3">Combinaisons de couleurs autorisées</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Check className="text-success size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit">Teal sur blanc cassé</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-success size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit">Bleu nuit sur blanc cassé</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-success size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit">Blanc sur teal</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-success size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit">Blanc sur bleu nuit</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-success size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit">Blanc sur prune</p>
              </div>
            </div>
          </div>

          {/* Combinaisons interdites */}
          <div>
            <h3 className="text-lg font-semibold text-bleu-nuit mb-3">Combinaisons interdites</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <X className="text-error size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit/70">Sauge comme couleur de texte — contraste insuffisant</p>
              </div>
              <div className="flex items-start gap-3">
                <X className="text-error size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit/70">Teal clair comme texte sur fond clair — contraste insuffisant</p>
              </div>
            </div>
          </div>

          {/* Tailles de texte */}
          <div>
            <h3 className="text-lg font-semibold text-bleu-nuit mb-3">Tailles minimales de texte</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Check className="text-teal size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit"><strong>12px</strong> — minimum absolu (mentions légales, annotations)</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-teal size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit"><strong>14px</strong> — minimum pour le corps de texte secondaire</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-teal size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit"><strong>16px</strong> — taille recommandée pour le corps de texte principal</p>
              </div>
            </div>
          </div>

          {/* Autres exigences */}
          <div>
            <h3 className="text-lg font-semibold text-bleu-nuit mb-3">Autres exigences</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Check className="text-teal size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit"><strong>Navigation clavier</strong> — obligatoire sur tous les éléments interactifs (boutons, liens, formulaires)</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-teal size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit"><strong>Alternatives textuelles</strong> — attribut alt obligatoire et descriptif sur toutes les images</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-teal size-5 shrink-0 mt-0.5" />
                <p className="text-sm text-bleu-nuit"><strong>Sous-titres vidéo</strong> — obligatoires sur toutes les vidéos publiées</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CommentsSection pageSlug="regles" />
    </>
  )
}
