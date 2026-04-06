import { PageHeader } from '@/components/PageHeader'
import { brand } from '@/lib/brand'
import Image from 'next/image'
import { CommentsSection } from '@/components/CommentsSection'

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
              <Image src="/logos/logo-main.svg" alt="Emancia" width={120} height={30} className="brightness-0 invert" />
            </div>
            <div className="flex items-center gap-6">
              <span className="text-white/70 text-sm hover:text-white transition-colors">Apprendre</span>
              <span className="text-white/70 text-sm hover:text-white transition-colors">Articles</span>
              <span className="text-white/70 text-sm hover:text-white transition-colors">Outils</span>
              <span className="bg-prune text-white text-sm px-4 py-1.5 rounded-lg">S&apos;inscrire</span>
            </div>
          </div>
        </div>
      </section>

      {/* Email header mockup */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">En-tête d&apos;email</h2>
        <div className="rounded-xl overflow-hidden border border-gris-leger/30 max-w-lg mx-auto">
          <div className="bg-teal px-8 py-6 text-center relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.06] flex items-center justify-center">
              <Image src="/logos/logo-main.svg" alt="" width={240} height={60} className="brightness-0 invert" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2.5 mb-2">
                <Image src="/logos/logo-main.svg" alt="Emancia" width={130} height={32} className="brightness-0 invert" />
              </div>
              <p className="text-white/80 text-sm">Éducation Financière</p>
            </div>
          </div>
          <div className="bg-white p-8">
            <h3 className="font-display text-xl font-semibold text-bleu-nuit mb-3">Votre guide de la semaine</h3>
            <p className="text-sm text-gris-texte leading-relaxed mb-4">
              Découvrez nos derniers articles sur l&apos;investissement responsable et apprenez à construire un portefeuille diversifié, étape par étape.
            </p>
            <div className="inline-block bg-teal text-white text-sm px-5 py-2 rounded-lg">
              Lire l&apos;article
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
            <div className="w-20 h-20 rounded-full bg-teal flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
              <Image src="/logos/logo-main.svg" alt="Emancia" width={80} height={20} className="brightness-0 invert" />
            </div>
            <p className="text-xs text-gris-texte/60 mt-2">Circulaire</p>
          </div>
          {/* Square rounded */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-bleu-nuit flex items-center justify-center shadow-lg overflow-hidden">
              <Image src="/logos/logo-main.svg" alt="Emancia" width={80} height={20} className="brightness-0 invert" />
            </div>
            <p className="text-xs text-gris-texte/60 mt-2">Carré arrondi</p>
          </div>
          {/* With background */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg overflow-hidden" style={{ backgroundColor: brand.colors.primary.blancCasse.hex }}>
              <Image src="/logos/logo-main.svg" alt="Emancia" width={80} height={20} />
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
                  <Image src="/logos/logo-main.svg" alt="Emancia" width={110} height={28} className="brightness-0 invert" />
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
            <div className="h-40 bg-bleu-nuit flex items-center justify-center">
              <Image src="/logos/logo-main.svg" alt="Emancia" width={160} height={40} className="brightness-0 invert opacity-30" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Investissement</span>
                <span className="text-xs text-gris-texte/50">5 min</span>
              </div>
              <h3 className="font-display font-semibold text-bleu-nuit mb-1">Comprendre les ETF en 5 minutes</h3>
              <p className="text-sm text-gris-texte/70 leading-relaxed">Guide simple pour comprendre ce qu&apos;est un ETF et comment il peut vous aider à diversifier.</p>
            </div>
          </div>
        </div>
      </section>
      <CommentsSection pageSlug="contextes" />
    </>
  )
}
