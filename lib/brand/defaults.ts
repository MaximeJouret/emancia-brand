import type { BrandKit, NamedPalette } from './types'

export const brand: BrandKit = {
  name: 'Emancia',
  fullName: 'Emancia — Éducation Financière',
  tagline: 'Donner à chacun les clés de sa liberté financière',

  colors: {
    primary: {
      teal: {
        hex: '#19908A',
        name: 'Teal Emancia',
        usage: 'Couleur principale — logo, titres, liens, éléments interactifs',
      },
      tealDark: {
        hex: '#0F5E5A',
        name: 'Teal foncé',
        usage: 'Hover, états actifs, contrastes renforcés',
      },
      blancNaturel: {
        hex: '#F4F7F0',
        name: 'Blanc naturel',
        usage: 'Fond principal, espaces de respiration',
      },
      prune: {
        hex: '#6B3A5D',
        name: 'Prune',
        usage: 'CTA, accents, éléments distinctifs',
      },
    },
    secondary: {
      tealClair: {
        hex: '#E6F2F1',
        name: 'Teal clair',
        usage: 'Fonds de sections, cartes, zones mises en avant',
      },
      grisTexte: {
        hex: '#4A4A4A',
        name: 'Gris texte',
        usage: 'Texte courant, paragraphes',
      },
      grisLeger: {
        hex: '#E8E8E8',
        name: 'Gris léger',
        usage: 'Bordures, séparateurs, fonds subtils',
      },
      bleuNuit: {
        hex: '#1A2B3C',
        name: 'Bleu nuit',
        usage: 'Texte sur fond clair, titres sombres, footer',
      },
    },
    functional: {
      success: {
        hex: '#4CAF82',
        name: 'Succès',
        usage: 'Messages de succès, validations, indicateurs positifs',
      },
      error: {
        hex: '#E05252',
        name: 'Erreur',
        usage: 'Messages d\'erreur, alertes critiques',
      },
      warning: {
        hex: '#F0A500',
        name: 'Alerte',
        usage: 'Avertissements, attention requise',
      },
      info: {
        hex: '#5BBAB5',
        name: 'Info',
        usage: 'Messages informatifs, tooltips',
      },
    },
    darkMode: {
      background: {
        hex: '#0D1B1A',
        name: 'Fond sombre',
        usage: 'Fond principal en mode sombre',
      },
      surface: {
        hex: '#142625',
        name: 'Surface sombre',
        usage: 'Cartes et conteneurs en mode sombre',
      },
      tealLight: {
        hex: '#22B5AE',
        name: 'Teal lumineux',
        usage: 'Couleur principale adaptée au mode sombre',
      },
      textPrimary: {
        hex: '#E8F0EF',
        name: 'Texte clair',
        usage: 'Texte principal en mode sombre',
      },
    },
  },

  palettes: [
    {
      id: 'A',
      name: 'Teal & Prune',
      subtitle: 'Palette originale',
      description: 'La palette fondatrice d\'Emancia. Le teal incarne la confiance et la sérénité, complété par le prune pour les accents distinctifs.',
      colors: {
        primary: {
          teal: { hex: '#19908A', name: 'Teal Emancia', usage: 'Couleur principale — logo, titres, liens, éléments interactifs' },
          tealDark: { hex: '#0F5E5A', name: 'Teal foncé', usage: 'Hover, états actifs, contrastes renforcés' },
          blancNaturel: { hex: '#F4F7F0', name: 'Blanc naturel', usage: 'Fond principal, espaces de respiration' },
          prune: { hex: '#6B3A5D', name: 'Prune', usage: 'CTA, accents, éléments distinctifs' },
        },
        secondary: {
          tealClair: { hex: '#E6F2F1', name: 'Teal clair', usage: 'Fonds de sections, cartes, zones mises en avant' },
          grisTexte: { hex: '#4A4A4A', name: 'Gris texte', usage: 'Texte courant, paragraphes' },
          grisLeger: { hex: '#E8E8E8', name: 'Gris léger', usage: 'Bordures, séparateurs, fonds subtils' },
          bleuNuit: { hex: '#1A2B3C', name: 'Bleu nuit', usage: 'Texte sur fond clair, titres sombres, footer' },
        },
        darkMode: {
          background: { hex: '#0D1B1A', name: 'Fond sombre', usage: 'Fond principal en mode sombre' },
          surface: { hex: '#142625', name: 'Surface sombre', usage: 'Cartes et conteneurs en mode sombre' },
          accent: { hex: '#22B5AE', name: 'Teal lumineux', usage: 'Couleur principale adaptée au mode sombre' },
          textPrimary: { hex: '#E8F0EF', name: 'Texte clair', usage: 'Texte principal en mode sombre' },
        },
      },
    },
    {
      id: 'B',
      name: 'Océan Profond',
      subtitle: 'Indigo & Sauge',
      description: 'La profondeur et la stabilité de l\'océan. L\'indigo évoque les institutions financières de confiance, adouci par le vert sauge.',
      colors: {
        primary: {
          indigo: { hex: '#2D5A8E', name: 'Indigo', usage: 'Couleur principale — titres, liens, éléments interactifs' },
          indigoFonce: { hex: '#1B3A5C', name: 'Indigo foncé', usage: 'Hover, états actifs, contrastes renforcés' },
          blancCreme: { hex: '#F5F3EE', name: 'Blanc crème', usage: 'Fond principal, espaces de respiration' },
          sauge: { hex: '#5A7A6B', name: 'Sauge', usage: 'CTA, accents, éléments distinctifs' },
        },
        secondary: {
          indigoClair: { hex: '#E8EEF5', name: 'Indigo clair', usage: 'Fonds de sections, cartes, zones mises en avant' },
          grisTexte: { hex: '#4A4A4A', name: 'Gris texte', usage: 'Texte courant, paragraphes' },
          grisLeger: { hex: '#E8E8E8', name: 'Gris léger', usage: 'Bordures, séparateurs, fonds subtils' },
          ardoise: { hex: '#2B3542', name: 'Ardoise', usage: 'Texte sur fond clair, titres sombres, footer' },
        },
        darkMode: {
          background: { hex: '#0E1520', name: 'Fond sombre', usage: 'Fond principal en mode sombre' },
          surface: { hex: '#162030', name: 'Surface sombre', usage: 'Cartes et conteneurs en mode sombre' },
          accent: { hex: '#4A8BD4', name: 'Indigo lumineux', usage: 'Couleur principale adaptée au mode sombre' },
          textPrimary: { hex: '#E5EAF0', name: 'Texte clair', usage: 'Texte principal en mode sombre' },
        },
      },
    },
    {
      id: 'C',
      name: 'Forêt & Pierre',
      subtitle: 'Vert forêt & Terracotta',
      description: 'La solidité de la pierre et la croissance naturelle. Le vert forêt symbolise la croissance organique, le terracotta apporte chaleur et authenticité.',
      colors: {
        primary: {
          vertForet: { hex: '#2E6B50', name: 'Vert forêt', usage: 'Couleur principale — titres, liens, éléments interactifs' },
          vertFonce: { hex: '#1D4A36', name: 'Vert foncé', usage: 'Hover, états actifs, contrastes renforcés' },
          blancLin: { hex: '#F6F3EF', name: 'Blanc lin', usage: 'Fond principal, espaces de respiration' },
          terracotta: { hex: '#8B5E4B', name: 'Terracotta doux', usage: 'CTA, accents, éléments distinctifs' },
        },
        secondary: {
          vertClair: { hex: '#E5F0EA', name: 'Vert clair', usage: 'Fonds de sections, cartes, zones mises en avant' },
          grisTexte: { hex: '#4A4A4A', name: 'Gris texte', usage: 'Texte courant, paragraphes' },
          grisLeger: { hex: '#E8E8E8', name: 'Gris léger', usage: 'Bordures, séparateurs, fonds subtils' },
          charbon: { hex: '#2A2F2E', name: 'Charbon', usage: 'Texte sur fond clair, titres sombres, footer' },
        },
        darkMode: {
          background: { hex: '#0F1A15', name: 'Fond sombre', usage: 'Fond principal en mode sombre' },
          surface: { hex: '#152820', name: 'Surface sombre', usage: 'Cartes et conteneurs en mode sombre' },
          accent: { hex: '#3FA87A', name: 'Vert lumineux', usage: 'Couleur principale adaptée au mode sombre' },
          textPrimary: { hex: '#E3EDE8', name: 'Texte clair', usage: 'Texte principal en mode sombre' },
        },
      },
    },
    {
      id: 'D',
      name: 'Crépuscule',
      subtitle: 'Bleu nuit & Vieux rose',
      description: 'Le moment entre jour et nuit, symbolisant la transformation vers l\'émancipation financière. Moderne, humain, anti-corporate.',
      colors: {
        primary: {
          bleuNuitProfond: { hex: '#3B4D7A', name: 'Bleu nuit profond', usage: 'Couleur principale — titres, liens, éléments interactifs' },
          encre: { hex: '#272F4A', name: 'Encre', usage: 'Hover, états actifs, contrastes renforcés' },
          blancCendre: { hex: '#F3F2F0', name: 'Blanc cendré', usage: 'Fond principal, espaces de respiration' },
          vieuxRose: { hex: '#9E6B7B', name: 'Vieux rose', usage: 'CTA, accents, éléments distinctifs' },
        },
        secondary: {
          bleuNuitClair: { hex: '#E8EBF2', name: 'Bleu nuit clair', usage: 'Fonds de sections, cartes, zones mises en avant' },
          grisTexte: { hex: '#4A4A4A', name: 'Gris texte', usage: 'Texte courant, paragraphes' },
          grisLeger: { hex: '#E8E8E8', name: 'Gris léger', usage: 'Bordures, séparateurs, fonds subtils' },
          graphite: { hex: '#2C2C34', name: 'Graphite', usage: 'Texte sur fond clair, titres sombres, footer' },
        },
        darkMode: {
          background: { hex: '#12131C', name: 'Fond sombre', usage: 'Fond principal en mode sombre' },
          surface: { hex: '#1C1E2A', name: 'Surface sombre', usage: 'Cartes et conteneurs en mode sombre' },
          accent: { hex: '#6B82C4', name: 'Bleu lumineux', usage: 'Couleur principale adaptée au mode sombre' },
          textPrimary: { hex: '#E4E3EF', name: 'Texte clair', usage: 'Texte principal en mode sombre' },
        },
      },
    },
  ] as NamedPalette[],

  typography: {
    display: {
      family: 'Fraunces',
      fallback: 'Georgia, serif',
      googleImport: 'Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900',
      weights: [400, 600, 700],
      role: 'Titres, en-têtes, éléments éditoriaux — apporte caractère et élégance',
    },
    body: {
      family: 'DM Sans',
      fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      googleImport: 'DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000',
      weights: [400, 500, 700],
      role: 'Corps de texte, navigation, UI — lisibilité et modernité',
    },
    mono: {
      family: 'JetBrains Mono',
      fallback: '"Fira Code", "Cascadia Code", monospace',
      googleImport: 'JetBrains+Mono:wght@400;500;700',
      weights: [400, 500, 700],
      role: 'Données financières, chiffres, tableaux, code — précision et lisibilité des nombres',
    },
  },

  spacing: {
    base: 4,
    scale: {
      '0': 0,
      '1': 4,
      '2': 8,
      '3': 12,
      '4': 16,
      '5': 20,
      '6': 24,
      '8': 32,
      '10': 40,
      '12': 48,
      '16': 64,
      '20': 80,
      '24': 96,
    },
  },

  logos: [
    {
      name: 'Logotype principal',
      description: 'Logo horizontal avec symbole intégré au texte',
      file: '/logos/logo-main.svg',
      ratio: '4.1:1',
      usage: ['En-tête de site', 'Documents officiels', 'Présentations'],
    },
    {
      name: 'Logotype + baseline',
      description: 'Logo avec mention "Éducation Financière"',
      file: '/logos/logo-baseline.svg',
      ratio: '3.6:1',
      usage: ['Première apparition', 'Supports institutionnels', 'Partenariats'],
    },
    {
      name: 'Symbole (favicon)',
      description: 'Colombe + E — version icône',
      file: '/logos/logo-icon.svg',
      ratio: '0.93:1',
      usage: ['Favicon', 'Avatar réseaux sociaux', 'Icône application'],
    },
  ],

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
}
