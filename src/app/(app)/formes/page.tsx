'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { CommentsSection } from '@/components/CommentsSection'

const radiusTokens = [
  { name: 'sm', value: '4px', desc: 'Badges, tags, petits éléments', status: 'standard' as const },
  { name: 'md', value: '8px', desc: 'Boutons, inputs, alertes — maximum standard recommandé', status: 'standard' as const },
  { name: 'lg', value: '12px', desc: 'Cartes, modales — exception rare, à justifier', status: 'exception' as const },
  { name: 'xl', value: '16px', desc: 'Conteneurs principaux — exception rare, à justifier', status: 'exception' as const },
  { name: 'full', value: '9999px', desc: 'Réservé aux pills et avatars uniquement', status: 'reserved' as const },
]

const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]

const brandColors = [
  { name: 'Teal', hex: '#1A8F8A' },
  { name: 'Bleu nuit', hex: '#1A2B3C' },
  { name: 'Prune', hex: '#7A4F6D' },
  { name: 'Sauge', hex: '#A8C280' },
  { name: 'Teal clair', hex: '#88C9C7' },
  { name: 'Blanc cassé', hex: '#F2F5EE' },
]

const shapes = [
  { name: 'Rectangle', width: 160, height: 80, radius: '12px' },
  { name: 'Carré', width: 100, height: 100, radius: '12px' },
  { name: 'Cercle', width: 100, height: 100, radius: '9999px' },
  { name: 'Pill', width: 160, height: 48, radius: '9999px' },
  { name: 'Petit radius', width: 120, height: 80, radius: '4px' },
  { name: 'Grand radius', width: 120, height: 80, radius: '16px' },
]

export default function FormesPage() {
  const [selectedColor, setSelectedColor] = useState('#1A8F8A')

  return (
    <>
      <PageHeader
        title="Formes & Rayons"
        description="Playground interactif pour les formes et rayons de bordure de la charte Emancia. Sélectionnez une couleur pour visualiser les différentes formes."
      />

      {/* Color picker */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Couleur active</h2>
        <div className="flex flex-wrap gap-2">
          {brandColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => setSelectedColor(c.hex)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                selectedColor === c.hex
                  ? 'border-bleu-nuit shadow-md scale-105'
                  : 'border-gris-leger/30 hover:border-gris-leger'
              }`}
            >
              <div className="w-5 h-5 rounded-full border border-gris-leger/30" style={{ backgroundColor: c.hex }} />
              <span className="text-xs font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Shape playground */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Formes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {shapes.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-3 bg-white rounded-xl p-6 border border-gris-leger/30">
              <div
                className="transition-all duration-300"
                style={{
                  width: s.width,
                  height: s.height,
                  borderRadius: s.radius,
                  backgroundColor: selectedColor,
                }}
              />
              <div className="text-center">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs font-mono text-bleu-nuit/60">radius: {s.radius}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Radius tokens */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Tokens de rayon</h2>
        <div className="bg-teal-clair/20 border border-teal/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-bleu-nuit/70">
            <strong className="text-bleu-nuit">Maximum standard : 8px (md).</strong> Les rayons sm et md couvrent la majorit&eacute; des cas d&apos;usage. Les rayons lg et xl sont r&eacute;serv&eacute;s aux exceptions justifi&eacute;es.
          </p>
        </div>
        <div className="space-y-3">
          {radiusTokens.map((t) => (
            <div key={t.name} className={`flex items-center gap-4 bg-white rounded-xl p-4 border ${
              t.status === 'standard' ? 'border-teal/20' : t.status === 'exception' ? 'border-warning/20' : 'border-gris-leger/30'
            }`}>
              <div
                className="w-16 h-16 shrink-0 border-2 border-teal"
                style={{ borderRadius: t.value }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm text-teal font-medium">radius-{t.name}</code>
                  <span className="font-mono text-xs text-bleu-nuit/50">{t.value}</span>
                  {t.status === 'standard' && (
                    <span className="text-[10px] font-medium bg-teal/10 text-teal px-2 py-0.5 rounded-full">Recommand&eacute;</span>
                  )}
                  {t.status === 'exception' && (
                    <span className="text-[10px] font-medium bg-warning/10 text-warning px-2 py-0.5 rounded-full">Exception rare</span>
                  )}
                  {t.status === 'reserved' && (
                    <span className="text-[10px] font-medium bg-prune/10 text-prune px-2 py-0.5 rounded-full">R&eacute;serv&eacute;</span>
                  )}
                </div>
                <p className="text-sm text-bleu-nuit/70 mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual examples: recommended vs exception */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Comparaison visuelle</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-teal/20">
            <h3 className="text-sm font-semibold text-teal mb-4">Standard (sm / md)</h3>
            <div className="flex items-center gap-4">
              <div className="bg-teal/10 border border-teal/20 w-24 h-12" style={{ borderRadius: '4px' }} />
              <div className="bg-teal/10 border border-teal/20 w-24 h-12" style={{ borderRadius: '8px' }} />
            </div>
            <p className="text-xs text-bleu-nuit/60 mt-3">4px et 8px : la majorit&eacute; des composants UI</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-warning/20">
            <h3 className="text-sm font-semibold text-warning mb-4">Exceptions (lg / xl / full)</h3>
            <div className="flex items-center gap-4">
              <div className="bg-warning/10 border border-warning/20 w-24 h-12" style={{ borderRadius: '12px' }} />
              <div className="bg-warning/10 border border-warning/20 w-24 h-12" style={{ borderRadius: '16px' }} />
              <div className="bg-prune/10 border border-prune/20 w-16 h-8" style={{ borderRadius: '9999px' }} />
            </div>
            <p className="text-xs text-bleu-nuit/60 mt-3">&Agrave; justifier : cartes h&eacute;ros, modales, pills uniquement</p>
          </div>
        </div>
      </section>

      {/* Shadow tokens */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Ombres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'xs', shadow: '0 1px 2px rgba(0,0,0,0.05)' },
            { name: 'sm', shadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)' },
            { name: 'md', shadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)' },
            { name: 'lg', shadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)' },
          ].map((s) => (
            <div
              key={s.name}
              className="bg-white rounded-xl p-6 flex flex-col items-center gap-3"
              style={{ boxShadow: s.shadow }}
            >
              <p className="text-sm font-medium">shadow-{s.name}</p>
              <p className="text-xs font-mono text-bleu-nuit/50">{s.shadow.slice(0, 30)}...</p>
            </div>
          ))}
        </div>
      </section>
      {/* Spacing principles */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Principes d&apos;espacement</h2>
        <div className="bg-white rounded-xl p-8 border border-gris-leger/30">
          <p className="text-sm text-bleu-nuit/70 mb-2">
            Le syst&egrave;me d&apos;espacement Emancia repose sur une <strong className="text-bleu-nuit">unit&eacute; de base de 4px</strong>.
            Tous les espacements (margins, paddings, gaps) sont des multiples de cette unit&eacute;.
          </p>
          <p className="text-sm text-bleu-nuit/70 mb-6">
            &Eacute;chelle compl&egrave;te : 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px.
          </p>
          <div className="flex items-end gap-3 flex-wrap">
            {spacingScale.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <div
                  className="bg-teal/20 border border-teal/30 rounded"
                  style={{ width: Math.max(size, 12), height: Math.max(size, 12) }}
                />
                <span className="text-[10px] font-mono text-bleu-nuit/60">{size}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CommentsSection pageSlug="formes" />
    </>
  )
}
