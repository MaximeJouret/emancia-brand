'use client'

import { useState } from 'react'
import { CopyButton } from './CopyButton'
import { brand } from '@/lib/brand'

function generateCssTokens(): string {
  const { colors, typography, borderRadius } = brand
  return `/* Emancia Design Tokens — CSS Custom Properties */
:root {
  /* Primary */
  --emancia-teal: ${colors.primary.teal.hex};
  --emancia-bleu-nuit: ${colors.primary.bleuNuit.hex};
  --emancia-blanc-casse: ${colors.primary.blancCasse.hex};

  /* Secondary */
  --emancia-prune: ${colors.secondary.prune.hex};
  --emancia-teal-clair: ${colors.secondary.tealClair.hex};
  --emancia-gris-texte: ${colors.secondary.grisTexte.hex};
  --emancia-sauge: ${colors.secondary.sauge.hex};

  /* Functional */
  --emancia-success: ${colors.functional.success.hex};
  --emancia-error: ${colors.functional.error.hex};
  --emancia-warning: ${colors.functional.warning.hex};
  --emancia-info: ${colors.functional.info.hex};

  /* Typography */
  --emancia-font-display: '${typography.display.family}', ${typography.display.fallback};
  --emancia-font-body: '${typography.body.family}', ${typography.body.fallback};
  --emancia-font-mono: '${typography.mono.family}', ${typography.mono.fallback};

  /* Border Radius */
  --emancia-radius-sm: ${borderRadius.sm};
  --emancia-radius-md: ${borderRadius.md};
  --emancia-radius-lg: ${borderRadius.lg};
  --emancia-radius-xl: ${borderRadius.xl};
}`
}

function generateJsonTokens(): string {
  const { colors, typography, borderRadius, spacing } = brand
  return JSON.stringify({
    color: {
      primary: {
        teal: { value: colors.primary.teal.hex },
        bleuNuit: { value: colors.primary.bleuNuit.hex },
        blancCasse: { value: colors.primary.blancCasse.hex },
      },
      secondary: {
        prune: { value: colors.secondary.prune.hex },
        tealClair: { value: colors.secondary.tealClair.hex },
        grisTexte: { value: colors.secondary.grisTexte.hex },
        sauge: { value: colors.secondary.sauge.hex },
      },
      functional: {
        success: { value: colors.functional.success.hex },
        error: { value: colors.functional.error.hex },
        warning: { value: colors.functional.warning.hex },
        info: { value: colors.functional.info.hex },
      },
    },
    typography: {
      display: { family: typography.display.family, fallback: typography.display.fallback },
      body: { family: typography.body.family, fallback: typography.body.fallback },
      mono: { family: typography.mono.family, fallback: typography.mono.fallback },
    },
    radius: {
      sm: { value: borderRadius.sm },
      md: { value: borderRadius.md },
      lg: { value: borderRadius.lg },
      xl: { value: borderRadius.xl },
    },
    spacing: { base: spacing.base, scale: spacing.scale },
  }, null, 2)
}

function generateTailwindTokens(): string {
  const { colors, typography, borderRadius } = brand
  return `/* Emancia Tailwind Theme — @theme inline */
@theme {
  /* Primary */
  --color-teal: ${colors.primary.teal.hex};
  --color-bleu-nuit: ${colors.primary.bleuNuit.hex};
  --color-blanc-casse: ${colors.primary.blancCasse.hex};

  /* Secondary */
  --color-prune: ${colors.secondary.prune.hex};
  --color-teal-clair: ${colors.secondary.tealClair.hex};
  --color-gris-texte: ${colors.secondary.grisTexte.hex};
  --color-sauge: ${colors.secondary.sauge.hex};

  /* Functional */
  --color-success: ${colors.functional.success.hex};
  --color-error: ${colors.functional.error.hex};
  --color-warning: ${colors.functional.warning.hex};
  --color-info: ${colors.functional.info.hex};

  /* Typography */
  --font-display: '${typography.display.family}', ${typography.display.fallback};
  --font-body: '${typography.body.family}', ${typography.body.fallback};
  --font-mono: '${typography.mono.family}', ${typography.mono.fallback};

  /* Radius */
  --radius-sm: ${borderRadius.sm};
  --radius-md: ${borderRadius.md};
  --radius-lg: ${borderRadius.lg};
  --radius-xl: ${borderRadius.xl};
}`
}

export function TokenExporter() {
  const [active, setActive] = useState('css')

  const formats = [
    { id: 'css', label: 'CSS', content: generateCssTokens() },
    { id: 'json', label: 'JSON', content: generateJsonTokens() },
    { id: 'tailwind', label: 'Tailwind', content: generateTailwindTokens() },
  ]
  const format = formats.find(f => f.id === active)!

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {formats.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              active === id
                ? 'bg-teal text-white'
                : 'bg-white text-gris-texte hover:bg-teal/10 hover:text-teal border border-gris-leger/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="relative">
        <div className="absolute top-3 right-3">
          <CopyButton text={format.content} label="Copier tout" />
        </div>
        <pre className="rounded-xl bg-bleu-nuit p-5 pr-32 overflow-x-auto text-xs text-teal-clair font-mono leading-relaxed">
          {format.content}
        </pre>
      </div>
    </div>
  )
}
