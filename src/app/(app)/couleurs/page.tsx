import { brand } from '@/lib/brand'
import { PageHeader } from '@/components/PageHeader'
import { ColorSwatch } from '@/components/ColorSwatch'
import type { ColorToken, NamedPalette } from '@/lib/brand'

/** Generate tints (lighter) from a hex color */
function generateTints(hex: string, steps: number = 8): string[] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const tints: string[] = []
  for (let i = 0; i <= steps; i++) {
    const factor = i / steps
    const tr = Math.round(r + (255 - r) * factor)
    const tg = Math.round(g + (255 - g) * factor)
    const tb = Math.round(b + (255 - b) * factor)
    tints.push(`#${tr.toString(16).padStart(2, '0')}${tg.toString(16).padStart(2, '0')}${tb.toString(16).padStart(2, '0')}`)
  }
  return tints
}

/** Overlapping circles gradient — style Sagora */
function ColorGradientRow({
  color,
  label,
  info,
  infoPosition = 'left',
}: {
  color: ColorToken
  label: string
  info: { hex: string; rgb: string }
  infoPosition?: 'left' | 'right'
}) {
  const tints = generateTints(color.hex, 9)
  const circleSize = 100
  const overlap = 50

  return (
    <div className="relative flex items-center my-8">
      {/* Info block */}
      {infoPosition === 'left' && (
        <div className="w-48 shrink-0 text-right pr-6">
          <p className="font-mono text-sm font-bold" style={{ color: color.hex }}>{info.hex}</p>
          <p className="font-mono text-xs text-gris-texte/60 mt-1">RGB : {info.rgb}</p>
        </div>
      )}

      {/* Circles */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative flex items-center" style={{ height: circleSize }}>
          {tints.map((tint, i) => (
            <div
              key={i}
              className="rounded-full shrink-0"
              style={{
                width: circleSize,
                height: circleSize,
                backgroundColor: tint,
                marginLeft: i === 0 ? 0 : -overlap,
                zIndex: tints.length - i,
                position: 'relative',
              }}
            />
          ))}
        </div>
      </div>

      {/* Info block right */}
      {infoPosition === 'right' && (
        <div className="w-48 shrink-0 pl-6">
          <p className="font-mono text-sm font-bold" style={{ color: color.hex }}>{info.hex}</p>
          <p className="font-mono text-xs text-gris-texte/60 mt-1">RGB : {info.rgb}</p>
        </div>
      )}
    </div>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r} ; ${g} ; ${b}`
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

/** The big hero section with gradient circles — Sagora style */
function PaletteHero() {
  const primaryColors = [
    { token: brand.colors.primary.teal, label: 'Primaire' },
    { token: brand.colors.primary.bleuNuit, label: 'Texte' },
  ]
  const secondaryColors = [
    { token: brand.colors.secondary.tealClair, label: 'Secondaire 1' },
    { token: brand.colors.secondary.prune, label: 'Secondaire 2' },
    { token: brand.colors.secondary.sauge, label: 'Secondaire 3' },
  ]

  return (
    <section className="mb-16">
      {/* Principale */}
      <div className="bg-white rounded-2xl p-8 mb-8 border border-gris-leger/30 overflow-hidden">
        <div className="text-center mb-2">
          <h2 className="text-3xl font-semibold text-bleu-nuit">Principale</h2>
          <p className="text-sm text-gris-texte/70 mt-2 max-w-lg mx-auto">
            En plus des couleurs du logo, on utilisera des déclinaisons de ces couleurs pour l'habillage des documents
            (physiques ou numériques). Les teintes restent les mêmes, seules la saturation et la luminosité pourront être
            modifiées.
          </p>
        </div>

        {primaryColors.map((c, i) => (
          <ColorGradientRow
            key={i}
            color={c.token}
            label={c.label}
            info={{ hex: c.token.hex, rgb: hexToRgb(c.token.hex) }}
            infoPosition={i % 2 === 0 ? 'left' : 'right'}
          />
        ))}

        {/* Blanc cassé — shown as a subtle band */}
        <div className="flex items-center my-6">
          <div className="w-48 shrink-0 text-right pr-6">
            <p className="font-mono text-sm font-bold text-gris-texte">{brand.colors.primary.blancCasse.hex}</p>
            <p className="font-mono text-xs text-gris-texte/60 mt-1">RGB : {hexToRgb(brand.colors.primary.blancCasse.hex)}</p>
          </div>
          <div className="flex-1 h-16 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.06)]" style={{ backgroundColor: brand.colors.primary.blancCasse.hex }} />
          <div className="w-48 shrink-0 pl-6">
            <p className="text-sm font-semibold text-gris-texte">Blanc cassé</p>
            <p className="text-xs text-gris-texte/60">Fond & clarté</p>
          </div>
        </div>
      </div>

      {/* Secondaires */}
      <div className="bg-white rounded-2xl p-8 border border-gris-leger/30 overflow-hidden">
        <div className="text-center mb-2">
          <h2 className="text-3xl font-semibold text-bleu-nuit">Secondaires</h2>
        </div>

        {secondaryColors.map((c, i) => (
          <ColorGradientRow
            key={i}
            color={c.token}
            label={c.label}
            info={{ hex: c.token.hex, rgb: hexToRgb(c.token.hex) }}
            infoPosition={i % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </section>
  )
}

/** Token grid section for reference */
function PaletteSection({ palette }: { palette: NamedPalette }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold mb-2">
        Tokens de référence
      </h2>
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
        title="Palette de couleurs"
        description="Système chromatique Emancia — 3 couleurs principales, 4 secondaires. Déclinaisons par saturation et luminosité uniquement. Max 3 couleurs par composition."
      />

      {/* Valeurs fondatrices */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-3">Valeurs fondatrices</h2>
        <p className="text-sm text-gris-texte/70 mb-8 max-w-2xl leading-relaxed">
          Chaque couleur Emancia a été choisie pour incarner une valeur fondatrice de la marque. Ce n&apos;est pas un choix esthétique : c&apos;est un langage visuel qui permet à chaque membre de l&apos;équipe de communiquer les bons messages, instinctivement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Rigueur & Qualité',
              color: brand.colors.primary.bleuNuit.hex,
              colorName: 'Bleu nuit',
              hex: '#1A2B3C',
              lightText: true,
              why: 'Couleur des institutions financières de confiance. Autorité intellectuelle, profondeur d\'analyse, sérieux.',
              meaning: 'Chaque contenu publié est fiable, sourcé et pédagogiquement solide. La crédibilité se construit par l\'excellence.',
              usage: 'Titres, texte principal, footer',
            },
            {
              title: 'Transparence',
              color: brand.colors.primary.teal.hex,
              colorName: 'Teal',
              hex: '#1A8F8A',
              lightText: true,
              why: 'Fusion du bleu (confiance) et du vert (clarté). Ouverture, honnêteté, équilibre. La colombe qui s\'envole vers la lumière.',
              meaning: 'Nous citons nos sources, mentionnons les risques. Pas de conflit d\'intérêt, pas de partenariats cachés.',
              usage: 'Logo, identité, couleur principale',
            },
            {
              title: 'Émancipation',
              color: brand.colors.secondary.prune.hex,
              colorName: 'Prune doux',
              hex: '#7A4F6D',
              lightText: true,
              why: 'Lié à la transformation et à la liberté conquise. Sa version adoucie rend l\'ambition accessible et chaleureuse.',
              meaning: 'Donner à chacun les clés de sa liberté financière. Les outils pour comprendre, décider et agir.',
              usage: 'CTA, accents, call-to-action',
            },
            {
              title: 'Authenticité',
              color: brand.colors.secondary.sauge.hex,
              colorName: 'Sauge',
              hex: '#A8C280',
              lightText: true,
              why: 'Croissance naturelle, sagesse et sincérité. L\'anti-marketing agressif : pas de flashy, juste du vrai.',
              meaning: 'Pas de fausses promesses. Une marque qui dit ce qu\'elle fait et fait ce qu\'elle dit.',
              usage: 'Illustrations, décorations',
            },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.08)] group bg-white">
              {/* Color header block */}
              <div className="relative px-6 py-8 overflow-hidden" style={{ backgroundColor: v.color }}>
                {/* Large letter watermark */}
                <span
                  className="absolute -right-4 -top-6 text-[120px] font-display font-bold leading-none pointer-events-none select-none"
                  style={{ color: 'rgba(255,255,255,0.1)' }}
                >
                  {v.title[0]}
                </span>
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-semibold mb-1" style={{ color: '#ffffff' }}>
                    {v.title}
                  </h3>
                  <p className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {v.colorName} — {v.hex}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white p-6 space-y-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: v.color }}>
                    Psychologie
                  </p>
                  <p className="text-sm text-gris-texte/80 leading-relaxed">{v.why}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: v.color }}>
                    Chez Emancia
                  </p>
                  <p className="text-sm text-gris-texte/80 leading-relaxed">{v.meaning}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gris-leger/30">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: v.color }} />
                  <p className="text-xs text-gris-texte/50">{v.usage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Color pills overview */}
      <section className="mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { hex: '#1A8F8A', name: 'TEAL', role: 'Primaire' },
            { hex: '#88C9C7', name: 'TEAL CLAIR', role: 'Secondaire 1' },
            { hex: '#7A4F6D', name: 'PRUNE DOUX', role: 'Secondaire 2' },
            { hex: '#A8C280', name: 'SAUGE', role: 'Secondaire 3' },
            { hex: '#F2F5EE', name: 'BLANC CASSÉ', role: 'Fond & clarté' },
          ].map((c) => (
            <div key={c.hex} className="flex items-center gap-3 bg-white rounded-full px-5 py-3 border border-gris-leger/30">
              <div className="w-8 h-8 rounded-full border border-gris-leger/40" style={{ backgroundColor: c.hex }} />
              <div>
                <p className="text-xs font-bold tracking-wide">{c.name}</p>
                <p className="text-xs text-gris-texte/60 font-mono">{c.hex} — {c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gradient circles — Sagora style */}
      <PaletteHero />

      {/* Token reference grid */}
      {brand.palettes.map((palette) => (
        <PaletteSection key={palette.id} palette={palette} />
      ))}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Couleurs fonctionnelles (communes)</h2>
        <p className="text-sm text-gris-texte/80 mb-6">
          Couleurs d'interface universelles pour les retours utilisateur.
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
            <h3 className="font-semibold mb-2">Max 3 couleurs par composition</h3>
            <p className="text-sm leading-relaxed">
              Ne jamais utiliser plus de <strong>3 couleurs brand</strong> dans une
              même composition. La surface du bloc indique l'importance de la couleur. Le fond domine,
              la couleur principale structure, l'accent ponctue.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gris-leger">
            <h3 className="font-semibold mb-2">Contraste WCAG AA</h3>
            <p className="text-sm leading-relaxed">
              Tout texte doit respecter un ratio de contraste minimum de <strong>4.5:1</strong> pour
              le texte courant et <strong>3:1</strong> pour les textes de grande taille (&ge; 18px bold
              ou &ge; 24px regular).
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gris-leger">
            <h3 className="font-semibold mb-2">Hierarchie chromatique 60-30-10</h3>
            <p className="text-sm leading-relaxed">
              Le fond (blanc cassé) domine a <strong>60%</strong>.
              La couleur principale (teal/bleu nuit) represente <strong>30%</strong>.
              L'accent (prune, sauge) reste rare a <strong>10%</strong>.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gris-leger">
            <h3 className="font-semibold mb-2">Déclinaisons autorisées</h3>
            <p className="text-sm leading-relaxed">
              Les déclinaisons de chaque couleur se font <strong>uniquement par saturation et luminosité</strong>.
              La teinte (hue) reste toujours identique. Pas de dégradés, pas de nouvelles couleurs inventées.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
