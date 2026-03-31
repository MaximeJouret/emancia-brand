import { brand } from '@/lib/brand'
import { PageHeader } from '@/components/PageHeader'
import type { ColorToken, NamedPalette } from '@/lib/brand'

function ColorSwatch({ token }: { token: ColorToken }) {
  return (
    <div className="group">
      <div
        className="h-24 rounded-xl mb-3 border border-gris-leger/30 transition-transform group-hover:scale-105"
        style={{ backgroundColor: token.hex }}
      />
      <p className="font-medium text-sm">{token.name}</p>
      <p className="font-mono text-xs text-gris-texte/60 mt-0.5">{token.hex}</p>
      <p className="text-xs text-gris-texte/80 mt-1">{token.usage}</p>
    </div>
  )
}

function ColorGroup({ title, tokens }: { title: string; tokens: Record<string, ColorToken> }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(tokens).map(([key, token]) => (
          <ColorSwatch key={key} token={token} />
        ))}
      </div>
    </div>
  )
}

function PaletteSection({ palette }: { palette: NamedPalette }) {
  const colors = Object.values(palette.colors.primary)
  const mainColor = colors[0]?.hex ?? '#19908A'
  const accentColor = colors[3]?.hex ?? '#6B3A5D'

  return (
    <section className="mb-16">
      <div className="flex items-start gap-4 mb-2">
        <div className="flex gap-1.5 mt-1.5">
          <div className="w-5 h-5 rounded-full border border-gris-leger/50" style={{ backgroundColor: mainColor }} />
          <div className="w-5 h-5 rounded-full border border-gris-leger/50" style={{ backgroundColor: accentColor }} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            Palette {palette.id} — {palette.name}
          </h2>
          <p className="text-sm text-gris-texte/60 mt-0.5">{palette.subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-gris-texte/80 mb-8 max-w-2xl leading-relaxed">
        {palette.description}
      </p>

      <ColorGroup title="Couleurs principales" tokens={palette.colors.primary} />
      <ColorGroup title="Couleurs secondaires" tokens={palette.colors.secondary} />
      <ColorGroup title="Mode sombre" tokens={palette.colors.darkMode} />
    </section>
  )
}

export default function CouleursPage() {
  return (
    <>
      <PageHeader
        title="Palettes de couleurs"
        description="Quatre propositions chromatiques pour l'identité visuelle d'Emancia. Chaque palette respecte les valeurs de la marque et les exigences d'accessibilité WCAG AA. Les couleurs fonctionnelles restent identiques pour toutes les palettes."
      />

      {brand.palettes.map((palette) => (
        <PaletteSection key={palette.id} palette={palette} />
      ))}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Couleurs fonctionnelles (communes)</h2>
        <p className="text-sm text-gris-texte/80 mb-6">
          Ces couleurs sont identiques pour les quatre palettes. Elles reposent sur des conventions universelles d'interface.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(brand.colors.functional).map(([key, token]) => (
            <ColorSwatch key={key} token={token} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Regles d'application</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gris-leger">
            <h3 className="font-semibold mb-2">Contraste WCAG AA</h3>
            <p className="text-sm leading-relaxed">
              Tout texte doit respecter un ratio de contraste minimum de <strong>4.5:1</strong> pour
              le texte courant et <strong>3:1</strong> pour les textes de grande taille (&ge; 18px bold
              ou &ge; 24px regular).
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gris-leger">
            <h3 className="font-semibold mb-2">Hierarchie chromatique</h3>
            <p className="text-sm leading-relaxed">
              La couleur principale represente maximum <strong>30%</strong> de la surface visible.
              Le fond domine a <strong>60%</strong>.
              L'accent reste rare a <strong>10%</strong>.
              Cette regle s'applique a chaque palette.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
