import { PageHeader } from '@/components/PageHeader'
import { brand } from '@/lib/brand'

const toneOfVoice = {
  philosophy: 'Emancia rend la finance personnelle accessible, compréhensible et actionnable. Nous croyons que chacun mérite de comprendre les mécanismes financiers pour prendre des décisions éclairées, sans jargon inutile ni promesses irréalistes.',
  axes: [
    {
      label: 'Pédagogique',
      description: 'Expliquer simplement les concepts complexes. Utiliser des analogies du quotidien. Structurer l\'information progressivement.',
      exemple: '« L\'intérêt composé, c\'est comme une boule de neige : plus elle roule, plus elle grossit. »',
      color: brand.colors.primary.teal.hex,
      bg: '#E6F5F4',
    },
    {
      label: 'Bienveillant',
      description: 'Encourager sans culpabiliser. Reconnaître que chacun part d\'un niveau différent. Célébrer les petites victoires.',
      exemple: '« Pas besoin de tout maîtriser d\'un coup. Chaque pas compte dans votre parcours financier. »',
      color: brand.colors.secondary.prune.hex,
      bg: '#F5EEF3',
    },
    {
      label: 'Transparent',
      description: 'Citer ses sources. Mentionner les risques. Ne jamais masquer les limites d\'un conseil. Pas de conflits d\'intérêt.',
      exemple: '« Ce placement présente un risque de perte en capital. Voici les données historiques pour vous aider à décider. »',
      color: brand.colors.primary.bleuNuit.hex,
      bg: '#E8EDF2',
    },
    {
      label: 'Émancipateur',
      description: 'Donner les clés, pas les réponses toutes faites. Encourager l\'autonomie de réflexion et de décision.',
      exemple: '« Voici les critères pour évaluer un investissement. À vous de choisir ce qui correspond à votre situation. »',
      color: brand.colors.secondary.sauge.hex,
      bg: '#F0F4E8',
    },
    {
      label: 'Accessible',
      description: 'Éviter le jargon financier quand c\'est possible. Quand un terme technique est nécessaire, toujours le définir.',
      exemple: '« L\'ETF (fonds indiciel coté en bourse) permet d\'investir dans des centaines d\'entreprises en une seule opération. »',
      color: brand.colors.secondary.tealClair.hex,
      bg: '#EAF6F5',
    },
  ],
  hashtags: [
    '#EmancipationFinanciere',
    '#Emancia',
    '#EducationFinanciere',
    '#LibertéFinancière',
    '#FinancesPersonnelles',
    '#InvestirMalin',
    '#ComprendrePourDécider',
  ],
  forbiddenWords: [
    'garanti',
    'rendement assuré',
    'devenez riche',
    'sans risque',
    'argent facile',
    'secret des riches',
    'méthode infaillible',
    'enrichissez-vous rapidement',
    'opportunité unique',
    'revenus passifs garantis',
  ],
  preferredPhrases: [
    'Comprendre pour décider',
    'À votre rythme',
    'Pas à pas',
    'En toute transparence',
    'Les données montrent que...',
    'Historiquement, on observe...',
    'Chaque situation est unique',
    'Informez-vous avant d\'agir',
  ],
}

export default function TonEditorialPage() {
  return (
    <>
      <PageHeader
        title="Ton éditorial"
        description="La voix d'Emancia : pédagogique, bienveillante, transparente. Ces guidelines définissent comment nous communiquons avec notre audience."
      />

      {/* Philosophy */}
      <section className="mb-12">
        <div className="rounded-2xl bg-teal/5 p-8 border border-teal/10">
          <p className="text-base italic text-gris-texte leading-relaxed">
            &ldquo;{toneOfVoice.philosophy}&rdquo;
          </p>
        </div>
      </section>

      {/* Voice Axes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Axes de voix</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toneOfVoice.axes.map((axis) => (
            <div
              key={axis.label}
              className="rounded-xl p-5"
              style={{ backgroundColor: axis.bg }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: axis.color }} />
                <span className="text-sm font-semibold" style={{ color: axis.color }}>{axis.label}</span>
              </div>
              <p className="text-sm text-gris-texte/80 leading-relaxed mb-3">{axis.description}</p>
              <p className="text-xs italic text-gris-texte/60">{axis.exemple}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hashtags */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Hashtags</h2>
        <div className="flex flex-wrap gap-2">
          {toneOfVoice.hashtags.map((tag) => (
            <span key={tag} className="rounded-full bg-teal/10 px-4 py-2 text-sm font-medium text-teal">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Forbidden & Preferred */}
      <section className="mb-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-xl p-6 border border-gris-leger/30">
            <h3 className="text-lg font-semibold text-error mb-4">Mots interdits</h3>
            <ul className="space-y-2">
              {toneOfVoice.forbiddenWords.map((w) => (
                <li key={w} className="flex items-center gap-2 text-sm text-gris-texte/80">
                  <span className="text-error text-xs">&#10005;</span> {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gris-leger/30">
            <h3 className="text-lg font-semibold text-success mb-4">Expressions préférées</h3>
            <ul className="space-y-2">
              {toneOfVoice.preferredPhrases.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-gris-texte/80">
                  <span className="text-success text-xs">&#10003;</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Règles de communication</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white rounded-xl p-6 border border-gris-leger/30">
            <h3 className="text-lg font-semibold text-success mb-4">On fait</h3>
            <ul className="space-y-2">
              {[
                'Sourcer toute information financière',
                'Utiliser des exemples concrets et chiffrés',
                'Adapter le niveau au public cible',
                'Mentionner les risques à côté des opportunités',
                'Encourager la réflexion personnelle',
                'Utiliser le tutoiement bienveillant',
              ].map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-gris-texte/80">
                  <span className="text-success mt-0.5">&#9654;</span> {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gris-leger/30">
            <h3 className="text-lg font-semibold text-error mb-4">On ne fait pas</h3>
            <ul className="space-y-2">
              {[
                'Promettre des résultats financiers',
                'Utiliser du jargon sans explication',
                'Culpabiliser le lecteur sur ses choix passés',
                'Recommander des produits financiers spécifiques',
                'Créer un sentiment d\'urgence artificiel',
                'Utiliser un ton condescendant ou paternaliste',
              ].map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-gris-texte/80">
                  <span className="text-error mt-0.5">&#9654;</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
