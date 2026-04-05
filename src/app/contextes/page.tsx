import { PageHeader } from '@/components/PageHeader'
import { brand } from '@/lib/brand'

export default function ContextesPage() {
  return (
    <>
      <PageHeader
        title="Contextes d'utilisation"
        description="Exemples concrets d'application du logo et de l'identité visuelle Emancia dans différents contextes réels."
      />

      {/* Navbar mockup */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Barre de navigation</h2>
        <div className="rounded-xl overflow-hidden border border-gris-leger/30">
          <div className="bg-bleu-nuit px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center text-white font-display font-bold text-sm">E</div>
              <span className="font-display text-white font-semibold">Emancia</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-white/70 text-sm hover:text-white transition-colors">Apprendre</span>
              <span className="text-white/70 text-sm hover:text-white transition-colors">Articles</span>
              <span className="text-white/70 text-sm hover:text-white transition-colors">Outils</span>
              <span className="bg-prune text-white text-sm px-4 py-1.5 rounded-lg">S'inscrire</span>
            </div>
          </div>
        </div>
      </section>

      {/* Email header mockup */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">En-tête d'email</h2>
        <div className="rounded-xl overflow-hidden border border-gris-leger/30 max-w-lg mx-auto">
          <div className="bg-teal px-8 py-6 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-white font-display font-bold text-xs">E</div>
              <span className="font-display text-white font-semibold text-lg">Emancia</span>
            </div>
            <p className="text-white/80 text-sm">Éducation Financière</p>
          </div>
          <div className="bg-white p-8">
            <h3 className="font-display text-xl font-semibold text-bleu-nuit mb-3">Votre guide de la semaine</h3>
            <p className="text-sm text-gris-texte leading-relaxed mb-4">
              Découvrez nos derniers articles sur l'investissement responsable et apprenez à construire un portefeuille diversifié, étape par étape.
            </p>
            <div className="inline-block bg-teal text-white text-sm px-5 py-2 rounded-lg">
              Lire l'article
            </div>
          </div>
        </div>
      </section>

      {/* Social media avatar */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Avatar réseaux sociaux</h2>
        <div className="flex items-center gap-8 justify-center">
          {/* Circular */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-teal flex items-center justify-center text-white font-display font-bold text-2xl border-4 border-white shadow-lg">
              E
            </div>
            <p className="text-xs text-gris-texte/60 mt-2">Circulaire</p>
          </div>
          {/* Square rounded */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-bleu-nuit flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg">
              E
            </div>
            <p className="text-xs text-gris-texte/60 mt-2">Carré arrondi</p>
          </div>
          {/* With background */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-2xl text-teal shadow-lg" style={{ backgroundColor: brand.colors.primary.blancCasse.hex }}>
              E
            </div>
            <p className="text-xs text-gris-texte/60 mt-2">Fond clair</p>
          </div>
        </div>
      </section>

      {/* Footer mockup */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Pied de page</h2>
        <div className="rounded-xl overflow-hidden border border-gris-leger/30">
          <div className="bg-bleu-nuit px-8 py-10">
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-teal flex items-center justify-center text-white font-display font-bold text-xs">E</div>
                  <span className="font-display text-white font-semibold">Emancia</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{brand.tagline}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Ressources</p>
                <ul className="space-y-2">
                  <li className="text-white/70 text-sm">Articles</li>
                  <li className="text-white/70 text-sm">Calculateurs</li>
                  <li className="text-white/70 text-sm">Glossaire</li>
                </ul>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Suivre</p>
                <ul className="space-y-2">
                  <li className="text-white/70 text-sm">Instagram</li>
                  <li className="text-white/70 text-sm">LinkedIn</li>
                  <li className="text-white/70 text-sm">YouTube</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/30 text-xs">&copy; 2026 Emancia. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Card mockup */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Carte article</h2>
        <div className="max-w-sm">
          <div className="bg-white rounded-xl overflow-hidden border border-gris-leger/30 hover:shadow-lg transition-shadow">
            <div className="h-40 bg-teal/10 flex items-center justify-center">
              <span className="text-teal/30 font-display text-4xl font-bold">Emancia</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Investissement</span>
                <span className="text-xs text-gris-texte/50">5 min</span>
              </div>
              <h3 className="font-display font-semibold text-bleu-nuit mb-1">Comprendre les ETF en 5 minutes</h3>
              <p className="text-sm text-gris-texte/70 leading-relaxed">Guide simple pour comprendre ce qu'est un ETF et comment il peut vous aider à diversifier.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
