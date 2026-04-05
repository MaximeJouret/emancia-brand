'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'

const radiusTokens = [
  { name: 'sm', value: '4px', desc: 'Badges, tags, petits éléments' },
  { name: 'md', value: '8px', desc: 'Boutons, inputs, alertes' },
  { name: 'lg', value: '12px', desc: 'Cartes, modales, sections' },
  { name: 'xl', value: '16px', desc: 'Cartes héros, conteneurs principaux' },
  { name: 'full', value: '9999px', desc: 'Pills, avatars, badges ronds' },
]

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
                <p className="text-xs font-mono text-gris-texte/60">radius: {s.radius}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Radius tokens */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Tokens de rayon</h2>
        <div className="space-y-3">
          {radiusTokens.map((t) => (
            <div key={t.name} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gris-leger/30">
              <div
                className="w-16 h-16 shrink-0 border-2 border-teal"
                style={{ borderRadius: t.value }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm text-teal font-medium">radius-{t.name}</code>
                  <span className="font-mono text-xs text-gris-texte/50">{t.value}</span>
                </div>
                <p className="text-sm text-gris-texte/70 mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
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
              <p className="text-xs font-mono text-gris-texte/50">{s.shadow.slice(0, 30)}...</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
