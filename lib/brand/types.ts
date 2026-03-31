export interface ColorToken {
  hex: string
  name: string
  usage: string
}

export interface ColorPalette {
  primary: Record<string, ColorToken>
  secondary: Record<string, ColorToken>
  functional: Record<string, ColorToken>
  darkMode: Record<string, ColorToken>
}

export interface FontSpec {
  family: string
  fallback: string
  googleImport: string
  weights: number[]
  role: string
}

export interface TypographySystem {
  display: FontSpec
  body: FontSpec
  mono: FontSpec
}

export interface SpacingSystem {
  base: number
  scale: Record<string, number>
}

export interface LogoVersion {
  name: string
  description: string
  file: string
  ratio: string
  usage: string[]
}

export interface NamedPalette {
  id: string
  name: string
  subtitle: string
  description: string
  colors: Omit<ColorPalette, 'functional'>
}

export interface BrandKit {
  name: string
  fullName: string
  tagline: string
  colors: ColorPalette
  palettes: NamedPalette[]
  typography: TypographySystem
  spacing: SpacingSystem
  logos: LogoVersion[]
  borderRadius: Record<string, string>
}
