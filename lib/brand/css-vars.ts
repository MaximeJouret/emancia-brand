import { brand } from './defaults'
import type { ColorToken } from './types'

export function generateCSSVars(): string {
  const vars: string[] = []

  // Colors
  for (const [group, tokens] of Object.entries(brand.colors)) {
    for (const [key, token] of Object.entries(tokens as Record<string, ColorToken>)) {
      vars.push(`  --color-${group}-${key}: ${token.hex};`)
    }
  }

  // Typography
  vars.push(`  --font-display: '${brand.typography.display.family}', ${brand.typography.display.fallback};`)
  vars.push(`  --font-body: '${brand.typography.body.family}', ${brand.typography.body.fallback};`)
  vars.push(`  --font-mono: '${brand.typography.mono.family}', ${brand.typography.mono.fallback};`)

  // Spacing
  for (const [key, value] of Object.entries(brand.spacing.scale)) {
    vars.push(`  --space-${key}: ${value}px;`)
  }

  // Border radius
  for (const [key, value] of Object.entries(brand.borderRadius)) {
    vars.push(`  --radius-${key}: ${value};`)
  }

  return `:root {\n${vars.join('\n')}\n}`
}

export function getGoogleFontsUrl(): string {
  const families = [
    brand.typography.display.googleImport,
    brand.typography.body.googleImport,
    brand.typography.mono.googleImport,
  ]
  return `https://fonts.googleapis.com/css2?${families.map(f => `family=${f}`).join('&')}&display=swap`
}
