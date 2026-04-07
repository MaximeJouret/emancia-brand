'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { brand } from '@/lib/brand'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'

const SLIDES = [
  {
    id: 'cover',
    title: '',
    category: '',
  },
  {
    id: 'mission',
    title: 'Notre mission',
    category: 'Identité',
  },
  {
    id: 'valeurs',
    title: 'Nos valeurs fondatrices',
    category: 'Identité',
  },
  {
    id: 'logo',
    title: 'Notre logo',
    category: 'Logo',
  },
  {
    id: 'couleurs-primaires',
    title: 'Couleurs primaires',
    category: 'Couleurs',
  },
  {
    id: 'couleurs-secondaires',
    title: 'Couleurs secondaires',
    category: 'Couleurs',
  },
  {
    id: 'couleurs-degrades',
    title: 'Dégradés',
    category: 'Couleurs',
  },
  {
    id: 'couleurs-harmonie',
    title: 'Harmonie chromatique',
    category: 'Couleurs',
  },
  {
    id: 'couleurs-valeurs',
    title: 'Couleurs & Valeurs',
    category: 'Couleurs',
  },
  {
    id: 'couleurs-dark',
    title: 'Mode sombre',
    category: 'Couleurs',
  },
  {
    id: 'typographie',
    title: 'Typographie',
    category: 'Typographie',
  },
  {
    id: 'ton',
    title: 'Ton éditorial',
    category: 'Communication',
  },
  {
    id: 'regles',
    title: 'Do & Don\'t',
    category: 'Règles',
  },
  {
    id: 'outils',
    title: 'Vos outils',
    category: 'Outils',
  },
  {
    id: 'end',
    title: '',
    category: '',
  },
]

function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <Image
        src="/logos/logo-main.svg"
        alt="Emancia"
        width={280}
        height={70}
        className="mb-5"
      />
      <div className="w-16 h-0.5 bg-teal mb-5" />
      <h1 className="font-display text-3xl font-bold text-bleu-nuit mb-2">
        Charte Graphique
      </h1>
      <p className="text-base text-bleu-nuit/50 max-w-md">
        Guide de marque et système de design pour l&apos;équipe Emancia
      </p>
      <div className="mt-10 flex items-center gap-2 text-sm text-bleu-nuit/30">
        <span>Utilisez les flèches</span>
        <kbd className="px-2 py-0.5 rounded border border-[#2A4A5C]/20 text-xs">←</kbd>
        <kbd className="px-2 py-0.5 rounded border border-[#2A4A5C]/20 text-xs">→</kbd>
        <span>pour naviguer</span>
      </div>
    </div>
  )
}

function MissionSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 max-w-3xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-4">Notre mission</p>
      <h2 className="font-display text-2xl font-bold text-bleu-nuit mb-5 leading-snug">
        {brand.tagline}
      </h2>
      <div className="w-12 h-0.5 bg-teal/30 mb-5" />
      <div className="space-y-4 w-full text-left">
        <div className="bg-teal/5 rounded-2xl px-5 py-4 border border-teal/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal mb-1">Vision</p>
          <p className="text-sm text-bleu-nuit/70 leading-relaxed">
            Un monde où chacun a les connaissances et la confiance nécessaires pour prendre des décisions financières éclairées, sans dépendance ni exclusion.
          </p>
        </div>
        <div className="bg-[#7A4F6D]/5 rounded-2xl px-5 py-4 border border-[#7A4F6D]/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7A4F6D] mb-1">Mission</p>
          <p className="text-sm text-bleu-nuit/70 leading-relaxed">
            Démocratiser l&apos;éducation financière en la rendant accessible, concrète et sans jargon, pour permettre à chacun de s&apos;émanciper financièrement.
          </p>
        </div>
        <div className="bg-bleu-nuit/5 rounded-2xl px-5 py-4 border border-bleu-nuit/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-bleu-nuit mb-1">Message clé</p>
          <p className="text-sm text-bleu-nuit/70 leading-relaxed italic">
            &laquo; Chez Emancia, on croit que comprendre ses finances n&apos;est pas un luxe réservé aux experts. C&apos;est un droit fondamental. &raquo;
          </p>
        </div>
      </div>
    </div>
  )
}

function ValeursSlide() {
  const valeurs = [
    { name: 'Rigueur & Qualité', color: '#1A2B3C', letter: 'R', desc: 'Excellence & précision' },
    { name: 'Transparence', color: '#1A8F8A', letter: 'T', desc: 'Clarté & honnêteté' },
    { name: 'Émancipation', color: '#7A4F6D', letter: 'É', desc: 'Autonomie & liberté' },
    { name: 'Authenticité', color: '#A8C280', letter: 'A', desc: 'Sincérité & cohérence' },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-4xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-6">Nos valeurs</p>
      <div className="grid grid-cols-4 gap-5 w-full">
        {valeurs.map((v) => (
          <div key={v.name} className="text-center">
            <div
              className="w-full aspect-square rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden"
              style={{ backgroundColor: v.color }}
            >
              <span className="text-white/10 text-[100px] font-display font-bold absolute">{v.letter}</span>
            </div>
            <h3 className="font-display text-sm font-semibold mb-0.5" style={{ color: '#1A2B3C' }}>{v.name}</h3>
            <p className="text-xs text-bleu-nuit/50">{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function LogoSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-3xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-6">Notre logo</p>
      <div className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-8 mb-6 w-full flex items-center justify-center">
        <Image
          src="/logos/logo-main.svg"
          alt="Emancia"
          width={260}
          height={65}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="bg-blanc-casse rounded-xl p-5 flex items-center justify-center">
          <Image src="/logos/logo-main.svg" alt="Fond clair" width={120} height={30} />
        </div>
        <div className="bg-bleu-nuit rounded-xl p-5 flex items-center justify-center">
          <Image src="/logos/logo-main.svg" alt="Fond sombre" width={120} height={30} className="brightness-0 invert" />
        </div>
        <div className="bg-teal rounded-xl p-5 flex items-center justify-center">
          <Image src="/logos/logo-main.svg" alt="Fond teal" width={120} height={30} className="brightness-0 invert" />
        </div>
      </div>
      <p className="text-xs text-bleu-nuit/40 mt-3">3 déclinaisons chromatiques pour tous les contextes</p>
    </div>
  )
}

function CouleursPrimairesSlide() {
  const primaires = [
    { name: 'Teal', hex: '#1A8F8A', role: 'Accent principal', textColor: '#fff' },
    { name: 'Bleu Nuit', hex: '#1A2B3C', role: 'Texte & fond sombre', textColor: '#fff' },
    { name: 'Blanc Cassé', hex: '#F2F5EE', role: 'Fond clair', textColor: '#1A2B3C' },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-4xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">Couleurs primaires</p>
      <p className="text-sm text-bleu-nuit/50 mb-6 max-w-lg text-center">
        Les 3 couleurs fondatrices de l&apos;identité Emancia.
      </p>
      <div className="grid grid-cols-3 gap-5 w-full mb-6">
        {primaires.map((c) => (
          <div key={c.name} className="text-center">
            <div
              className="w-full aspect-[4/3] rounded-2xl mb-3 shadow-sm flex items-end justify-between px-4 pb-3"
              style={{ backgroundColor: c.hex, border: c.hex === '#F2F5EE' ? '1px solid #e0e0e0' : undefined }}
            >
              <span className="text-xs font-mono font-medium" style={{ color: c.textColor, opacity: 0.7 }}>{c.hex}</span>
            </div>
            <p className="text-sm font-semibold text-bleu-nuit">{c.name}</p>
            <p className="text-xs text-teal mt-0.5">{c.role}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#2A4A5C]/10 px-5 py-3 max-w-md">
        <p className="text-xs text-bleu-nuit/50 text-center leading-relaxed">
          Le <strong className="text-teal">Teal</strong> attire l&apos;attention, le <strong className="text-bleu-nuit">Bleu Nuit</strong> structure, le <strong>Blanc Cassé</strong> donne de l&apos;air.
        </p>
      </div>
    </div>
  )
}

function CouleursSecondairesSlide() {
  const secondaires = [
    { name: 'Prune Doux', hex: '#7A4F6D' },
    { name: 'Teal Clair', hex: '#88C9C7' },
    { name: 'Sauge', hex: '#A8C280' },
    { name: 'Bleu Nuit Clair', hex: '#2A4A5C' },
  ]

  const proportions = [
    { label: 'Blanc Cassé (fond)', pct: 60, color: '#F2F5EE', border: true },
    { label: 'Bleu Nuit (texte)', pct: 20, color: '#1A2B3C', border: false },
    { label: 'Teal (accents)', pct: 10, color: '#1A8F8A', border: false },
    { label: 'Prune (CTAs)', pct: 5, color: '#7A4F6D', border: false },
    { label: 'Sauge+Teal Clair', pct: 5, color: '#A8C280', border: false },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-4xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">Couleurs secondaires</p>
      <p className="text-sm text-bleu-nuit/50 mb-5 max-w-lg text-center">
        4 couleurs complémentaires pour enrichir la palette.
      </p>
      <div className="grid grid-cols-4 gap-4 w-full mb-6">
        {secondaires.map((c) => (
          <div key={c.name} className="text-center">
            <div
              className="w-full aspect-[4/3] rounded-xl mb-2 shadow-sm"
              style={{ backgroundColor: c.hex }}
            />
            <p className="text-sm font-semibold text-bleu-nuit">{c.name}</p>
            <p className="text-[11px] text-bleu-nuit/40 font-mono">{c.hex}</p>
          </div>
        ))}
      </div>

      {/* Proportions bar */}
      <div className="w-full max-w-lg">
        <p className="text-[10px] text-bleu-nuit/30 uppercase tracking-wider mb-2 text-center">Proportions d&apos;usage recommandées</p>
        <div className="flex h-4 rounded-full overflow-hidden">
          {proportions.map((p) => (
            <div
              key={p.label}
              style={{ width: `${p.pct}%`, backgroundColor: p.color, border: p.border ? '1px solid #e0e0e0' : undefined }}
            />
          ))}
        </div>
        <div className="flex mt-2 gap-3 justify-center flex-wrap">
          {proportions.map((p) => (
            <div key={p.label} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color, border: p.border ? '1px solid #ccc' : undefined }} />
              <span className="text-[9px] text-bleu-nuit/40">{p.pct}% {p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CouleursDegradesSlide() {
  const gradients = [
    { dark: '#1A8F8A', light: '#88C9C7', darkName: 'Teal', lightName: 'Teal Clair' },
    { dark: '#1A2B3C', light: '#2A4A5C', darkName: 'Bleu Nuit', lightName: 'Bleu Nuit Clair' },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-3xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">Dégradés</p>
      <p className="text-sm text-bleu-nuit/50 mb-6 max-w-lg text-center">
        Chaque couleur primaire possède une variante plus claire pour créer de la profondeur.
      </p>
      <div className="w-full space-y-6">
        {gradients.map((g) => (
          <div key={g.darkName} className="bg-white rounded-2xl border border-[#2A4A5C]/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: g.dark }} />
                <div>
                  <p className="text-sm font-semibold text-bleu-nuit">{g.darkName}</p>
                  <p className="text-[10px] font-mono text-bleu-nuit/40">{g.dark}</p>
                </div>
              </div>
              <span className="text-bleu-nuit/20 text-lg">→</span>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-bleu-nuit text-right">{g.lightName}</p>
                  <p className="text-[10px] font-mono text-bleu-nuit/40 text-right">{g.light}</p>
                </div>
                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: g.light }} />
              </div>
            </div>
            <div
              className="w-full h-12 rounded-xl"
              style={{ background: `linear-gradient(to right, ${g.dark}, ${g.light})` }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-bleu-nuit/40 mt-5 text-center max-w-md">
        Utilisez les variantes claires pour les bordures, arrière-plans secondaires et éléments d&apos;interface subtils.
      </p>
    </div>
  )
}

function CouleursHarmonieSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-4xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-3">Harmonie chromatique</p>
      <p className="text-xs text-bleu-nuit/40 mb-5 max-w-md text-center">
        L&apos;axe principal Teal + Prune crée un contraste élégant entre raison (froid) et émotion (chaud).
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Harmony pair 1 */}
        <div className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#1A8F8A' }} />
            <span className="text-base font-bold text-bleu-nuit/20">+</span>
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#7A4F6D' }} />
          </div>
          <p className="text-sm font-semibold text-bleu-nuit mb-0.5">Teal + Prune Doux</p>
          <p className="text-[11px] text-bleu-nuit/50 leading-relaxed">
            Split-complémentaire. Structure &amp; liberté.
          </p>
          <div className="mt-2 px-2 py-0.5 rounded-lg text-[10px] font-semibold inline-block" style={{ backgroundColor: 'rgba(90,138,74,0.1)', color: '#5A8A4A' }}>Excellent</div>
        </div>

        {/* Harmony pair 2 */}
        <div className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#1A8F8A' }} />
            <span className="text-base font-bold text-bleu-nuit/20">+</span>
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#88C9C7' }} />
          </div>
          <p className="text-sm font-semibold text-bleu-nuit mb-0.5">Teal + Teal Clair</p>
          <p className="text-[11px] text-bleu-nuit/50 leading-relaxed">
            Famille chromatique. Profondeur et respiration.
          </p>
          <div className="mt-2 px-2 py-0.5 rounded-lg text-[10px] font-semibold inline-block" style={{ backgroundColor: 'rgba(90,138,74,0.1)', color: '#5A8A4A' }}>Excellent</div>
        </div>

        {/* Harmony pair 3 */}
        <div className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg border border-[#2A4A5C]/15" style={{ backgroundColor: '#F2F5EE' }} />
            <span className="text-base font-bold text-bleu-nuit/20">+</span>
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#1A8F8A' }} />
          </div>
          <p className="text-sm font-semibold text-bleu-nuit mb-0.5">Blanc Cassé + Teal</p>
          <p className="text-[11px] text-bleu-nuit/50 leading-relaxed">
            Ancrage idéal. Teinte verdâtre du blanc cassé harmonise avec le teal.
          </p>
          <div className="mt-2 px-2 py-0.5 rounded-lg text-[10px] font-semibold inline-block" style={{ backgroundColor: 'rgba(90,138,74,0.1)', color: '#5A8A4A' }}>Excellent</div>
        </div>

        {/* Harmony pair 4 — vigilance */}
        <div className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#A8C280' }} />
            <span className="text-base font-bold text-bleu-nuit/20">+</span>
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: '#7A4F6D' }} />
          </div>
          <p className="text-sm font-semibold text-bleu-nuit mb-0.5">Sauge + Prune</p>
          <p className="text-[11px] text-bleu-nuit/50 leading-relaxed">
            À surveiller. Séparer par du blanc ou du teal.
          </p>
          <div className="mt-2 px-2 py-0.5 rounded-lg bg-warning/10 text-warning text-[10px] font-semibold inline-block">Vigilance</div>
        </div>
      </div>

      <p className="text-[10px] text-bleu-nuit/30 text-center mt-4">
        Audit basé sur l&apos;analyse WCAG AA et la théorie split-complémentaire
      </p>
    </div>
  )
}

function CouleursValeursSlide() {
  const mappings = [
    { valeur: 'Rigueur & Qualité', color: '#1A2B3C', colorName: 'Bleu Nuit', why: 'Autorité, sérieux intellectuel, stabilité' },
    { valeur: 'Transparence', color: '#1A8F8A', colorName: 'Teal', why: 'Confiance, clarté, ouverture, dialogue' },
    { valeur: 'Émancipation', color: '#7A4F6D', colorName: 'Prune Doux', why: 'Empowerment, transformation, sagesse' },
    { valeur: 'Authenticité', color: '#A8C280', colorName: 'Sauge', why: 'Naturel, croissance organique, sincérité' },
  ]

  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const toggleReveal = (valeur: string) => {
    setRevealed(prev => ({ ...prev, [valeur]: !prev[valeur] }))
  }

  const allRevealed = Object.keys(revealed).length === mappings.length && Object.values(revealed).every(Boolean)

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-4xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">Couleurs &amp; Valeurs</p>
      <p className="text-sm text-bleu-nuit/50 mb-1 max-w-lg text-center">
        Chaque couleur incarne une valeur fondatrice. Devinez laquelle !
      </p>
      {!allRevealed && (
        <p className="text-xs text-teal/60 mb-4 animate-pulse">Cliquez sur chaque carte pour révéler la valeur</p>
      )}
      {allRevealed && (
        <p className="text-xs text-bleu-nuit/30 mb-4">Toutes les valeurs sont révélées</p>
      )}

      <div className="w-full space-y-2.5">
        {mappings.map((m) => {
          const isRevealed = revealed[m.valeur]
          return (
            <button
              key={m.valeur}
              onClick={() => toggleReveal(m.valeur)}
              className="w-full text-left flex items-stretch gap-0 bg-white rounded-2xl border border-[#2A4A5C]/15 overflow-hidden transition-all hover:shadow-md cursor-pointer"
            >
              {/* Color band */}
              <div className="w-2 shrink-0" style={{ backgroundColor: m.color }} />
              <div className="flex items-center gap-4 px-5 py-3 flex-1">
                <div className="w-10 h-10 rounded-xl shrink-0 transition-transform" style={{ backgroundColor: m.color }} />
                <div className="flex-1 min-w-0">
                  {isRevealed ? (
                    <>
                      <div className="flex items-center gap-3 mb-0.5">
                        <h3 className="font-display text-sm font-semibold" style={{ color: m.color }}>{m.valeur}</h3>
                        <span className="text-[10px] font-mono text-bleu-nuit/30">{m.colorName}</span>
                      </div>
                      <p className="text-xs text-bleu-nuit/50">{m.why}</p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-bleu-nuit/40">{m.colorName}</span>
                      <span className="text-[10px] text-teal/50 italic">cliquez pour révéler</span>
                    </div>
                  )}
                </div>
                <div className="text-bleu-nuit/20 text-xs shrink-0">
                  {isRevealed ? '✓' : '?'}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CouleursDarkSlide() {
  const darkColors = [
    { name: 'Fond', hex: '#0F1A24', desc: 'Arrière-plan principal' },
    { name: 'Surface', hex: '#162535', desc: 'Cartes, panneaux' },
    { name: 'Bleu Nuit Clair', hex: '#2A4A5C', desc: 'Bordures' },
    { name: 'Teal', hex: '#88C9C7', desc: 'Accent adapté' },
    { name: 'Texte', hex: '#E4E4E4', desc: 'Texte principal' },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-4xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-2">Mode sombre</p>
      <p className="text-sm text-bleu-nuit/50 mb-5 max-w-lg text-center">
        Palette adaptée pour les interfaces en mode sombre.
      </p>

      {/* Dark mode preview */}
      <div className="w-full rounded-2xl overflow-hidden mb-5" style={{ backgroundColor: '#0F1A24' }}>
        <div className="p-5">
          <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#162535', border: '1px solid #2A4A5C' }}>
            <p className="font-display text-base font-semibold mb-1" style={{ color: '#E4E4E4' }}>Exemple de surface</p>
            <p className="text-sm" style={{ color: '#E4E4E4', opacity: 0.6 }}>Texte secondaire sur fond surface</p>
            <div className="mt-2 flex gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#88C9C7', color: '#0F1A24' }}>Action primaire</span>
              <span className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#2A4A5C', color: '#E4E4E4' }}>Action secondaire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dark color swatches */}
      <div className="grid grid-cols-5 gap-3 w-full">
        {darkColors.map((c) => (
          <div key={c.name} className="text-center">
            <div
              className="w-full aspect-square rounded-xl mb-2 border border-[#2A4A5C]/20"
              style={{ backgroundColor: c.hex }}
            />
            <p className="text-xs font-semibold text-bleu-nuit">{c.name}</p>
            <p className="text-[10px] text-bleu-nuit/40 font-mono">{c.hex}</p>
            <p className="text-[10px] text-bleu-nuit/50 mt-0.5">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TypographieSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-3xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-6">Typographie</p>
      <div className="w-full space-y-5">
        <div className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-6">
          <p className="text-xs text-teal font-semibold uppercase tracking-wider mb-2">Display — Titres</p>
          <p className="font-display text-3xl font-bold text-bleu-nuit">Fraunces</p>
          <p className="font-display text-base text-bleu-nuit/50 mt-1">Élégante, éditoriale, avec du caractère</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-6">
          <p className="text-xs text-teal font-semibold uppercase tracking-wider mb-2">Body — Texte courant</p>
          <p className="font-body text-3xl font-bold text-bleu-nuit">DM Sans</p>
          <p className="font-body text-base text-bleu-nuit/50 mt-1">Moderne, lisible, géométrique</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-6">
          <p className="text-xs text-teal font-semibold uppercase tracking-wider mb-2">Mono — Données</p>
          <p className="font-mono text-2xl font-bold text-bleu-nuit">JetBrains Mono</p>
          <p className="font-mono text-sm text-bleu-nuit/50 mt-1">€12,450.00 · +8.3% · #1A8F8A</p>
        </div>
      </div>
    </div>
  )
}

function TonSlide() {
  const axes = [
    { label: 'Expert mais accessible', left: 'Jargon', right: 'Vulgarisation' },
    { label: 'Confiant mais humble', left: 'Arrogant', right: 'Hésitant' },
    { label: 'Motivant mais réaliste', left: 'Exagéré', right: 'Pessimiste' },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-3xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-6">Ton éditorial</p>
      <div className="w-full space-y-5">
        {axes.map((axis) => (
          <div key={axis.label} className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-5">
            <p className="font-display text-base font-semibold text-bleu-nuit text-center mb-3">{axis.label}</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-error/60 font-medium w-24 text-right">{axis.left}</span>
              <div className="flex-1 h-2 bg-bleu-nuit/5 rounded-full relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-teal rounded-full shadow-sm" />
              </div>
              <span className="text-xs text-error/60 font-medium w-24">{axis.right}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReglesSlide() {
  const rules = [
    { do: 'Utiliser les couleurs de la palette', dont: 'Inventer de nouvelles couleurs' },
    { do: 'Respecter les zones de protection du logo', dont: 'Déformer ou recadrer le logo' },
    { do: 'Utiliser Fraunces pour les titres', dont: 'Mélanger trop de polices' },
    { do: 'Maintenir un ton accessible et expert', dont: 'Utiliser du jargon financier complexe' },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-3xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-6">Les règles essentielles</p>
      <div className="w-full space-y-2.5">
        {rules.map((r, i) => (
          <div key={i} className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: 'rgba(90,138,74,0.05)', border: '1px solid rgba(90,138,74,0.15)' }}>
              <span className="text-base font-bold mt-[-2px]" style={{ color: '#5A8A4A' }}>✓</span>
              <p className="text-sm text-bleu-nuit/70">{r.do}</p>
            </div>
            <div className="bg-error/5 border border-error/15 rounded-xl p-3 flex items-start gap-2">
              <span className="text-error text-base font-bold mt-[-2px]">✗</span>
              <p className="text-sm text-bleu-nuit/70">{r.dont}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OutilsSlide() {
  const tools = [
    { name: 'Palette interactive', desc: 'Copier les couleurs en un clic', page: '/couleurs' },
    { name: 'Composants UI', desc: 'Boutons, cards, badges prêts à l\'emploi', page: '/composants' },
    { name: 'Export tokens', desc: 'CSS, JSON, Tailwind pour vos projets', page: '/tokens' },
    { name: 'Idées de contenus', desc: 'Board kanban collaboratif', page: '/idees-contenus' },
    { name: 'Commentaires', desc: 'Donnez votre avis sur chaque page', page: '' },
    { name: 'Mockups contextuels', desc: 'Voir le logo en situation réelle', page: '/contextes' },
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 max-w-3xl mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal mb-6">Vos outils</p>
      <div className="grid grid-cols-3 gap-3 w-full">
        {tools.map((t) => (
          <div key={t.name} className="bg-white rounded-2xl border border-[#2A4A5C]/15 p-4 text-center">
            <h3 className="font-display text-sm font-semibold mb-0.5" style={{ color: '#1A2B3C' }}>{t.name}</h3>
            <p className="text-xs text-bleu-nuit/50">{t.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-bleu-nuit/30 mt-5">Tout est accessible depuis la sidebar à gauche</p>
    </div>
  )
}

function EndSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <Image
        src="/logos/logo-icon.svg"
        alt="Emancia"
        width={64}
        height={64}
        className="mb-6 opacity-20"
      />
      <h2 className="font-display text-3xl font-bold text-bleu-nuit mb-3">
        Merci !
      </h2>
      <p className="text-base text-bleu-nuit/50 max-w-md mb-6">
        Explorez la charte à votre rythme et n&apos;hésitez pas à commenter chaque rubrique.
      </p>
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="px-6 py-2.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors"
        >
          Explorer la charte
        </a>
        <a
          href="/idees-contenus"
          className="px-6 py-2.5 bg-bleu-nuit/5 text-bleu-nuit text-sm font-medium rounded-lg hover:bg-bleu-nuit/10 transition-colors"
        >
          Idées de contenus
        </a>
      </div>
    </div>
  )
}

const SLIDE_COMPONENTS: Record<string, React.FC> = {
  cover: CoverSlide,
  mission: MissionSlide,
  valeurs: ValeursSlide,
  logo: LogoSlide,
  'couleurs-primaires': CouleursPrimairesSlide,
  'couleurs-secondaires': CouleursSecondairesSlide,
  'couleurs-degrades': CouleursDegradesSlide,
  'couleurs-harmonie': CouleursHarmonieSlide,
  'couleurs-valeurs': CouleursValeursSlide,
  'couleurs-dark': CouleursDarkSlide,
  typographie: TypographieSlide,
  ton: TonSlide,
  regles: ReglesSlide,
  outils: OutilsSlide,
  end: EndSlide,
}

export default function PresentationPage() {
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const goNext = useCallback(() => {
    setCurrent(prev => Math.min(prev + 1, SLIDES.length - 1))
  }, [])

  const goPrev = useCallback(() => {
    setCurrent(prev => Math.max(prev - 1, 0))
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen()
          setIsFullscreen(false)
        }
      }
      if (e.key === 'f' || e.key === 'F') { toggleFullscreen() }
    }
    window.addEventListener('keydown', handleKey)

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.removeEventListener('fullscreenchange', handleFsChange)
    }
  }, [goNext, goPrev, toggleFullscreen])

  const slide = SLIDES[current]
  const SlideComponent = SLIDE_COMPONENTS[slide.id]

  return (
    <div className="fixed inset-0 z-50 bg-blanc-casse flex flex-col" style={{ marginLeft: isFullscreen ? 0 : undefined }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#2A4A5C]/10">
        <div className="flex items-center gap-3">
          <a href="/" className="text-bleu-nuit/30 hover:text-bleu-nuit transition-colors">
            <X size={18} />
          </a>
          <span className="text-xs text-bleu-nuit/30">|</span>
          {slide.category && (
            <span className="text-xs font-semibold uppercase tracking-wider text-teal">{slide.category}</span>
          )}
          {slide.title && (
            <>
              <span className="text-xs text-bleu-nuit/20">·</span>
              <span className="text-xs text-bleu-nuit/50">{slide.title}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-bleu-nuit/30 font-mono">
            {current + 1} / {SLIDES.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-bleu-nuit/30 hover:text-bleu-nuit hover:bg-bleu-nuit/5 transition-colors"
            title="Plein écran (F)"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 relative overflow-hidden">
        <SlideComponent />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-[#2A4A5C]/10">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-bleu-nuit/50 hover:text-bleu-nuit hover:bg-bleu-nuit/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Précédent
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-6 h-2 bg-teal'
                  : 'w-2 h-2 bg-[#2A4A5C]/15 hover:bg-bleu-nuit/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={current === SLIDES.length - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-bleu-nuit/50 hover:text-bleu-nuit hover:bg-bleu-nuit/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          Suivant
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
