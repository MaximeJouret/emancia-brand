import { brand } from '@/lib/brand'
import { PageHeader } from '@/components/PageHeader'
import { CommentsSection } from '@/components/CommentsSection'

export default function IdentitePage() {
  return (
    <>
      <PageHeader
        title="Identité de marque"
        description="Emancia est une ASBL belge dédiée à l'éducation financière gratuite du public francophone. Cette charte graphique définit les règles visuelles et éditoriales de la marque."
      />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Mission</h2>
        <blockquote className="border-l-4 border-teal pl-6 py-2 text-lg italic text-bleu-nuit">
          {brand.tagline}
        </blockquote>
        <p className="mt-4 leading-relaxed">
          Donner à chacun les outils pour comprendre les notions financières essentielles,
          prendre des décisions éclairées et bâtir un avenir financier serein.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Vision</h2>
        <p className="leading-relaxed">
          Construire la plateforme de référence en francophonie pour l'éducation financière
          accessible à tous, en créant un écosystème complet de contenus pédagogiques
          gratuits et de qualité.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Valeurs</h2>
        <div className="grid grid-cols-2 gap-6">
          {[
            {
              name: 'Rigueur & Qualité',
              desc: 'Chaque contenu est vérifié, sourcé et relu. La crédibilité passe par l\'exigence.',
            },
            {
              name: 'Transparence',
              desc: 'Aucun conflit d\'intérêt. Pas de produit financier vendu, pas de partenariat caché.',
            },
            {
              name: 'Émancipation',
              desc: 'L\'objectif est l\'autonomie de l\'apprenant, pas la dépendance à la plateforme.',
            },
            {
              name: 'Authenticité',
              desc: 'Un ton humain, accessible et bienveillant. Pas de jargon inutile, pas de posture.',
            },
          ].map((value) => (
            <div
              key={value.name}
              className="bg-white rounded-xl p-6 border border-gris-leger"
            >
              <h3 className="text-lg font-semibold text-teal mb-2">{value.name}</h3>
              <p className="text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Public cible</h2>
        <p className="leading-relaxed">
          Principalement les <strong>18–30 ans</strong> francophones, tous niveaux
          d'éducation financière confondus. Le mode sombre est un élément important
          pour cette audience digitale native.
        </p>
      </section>
      <CommentsSection pageSlug="identite" />
    </>
  )
}
