'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { CommentsSection } from '@/components/CommentsSection'
import {
  Check,
  Copy,
  Palette,
  Moon,
  AlertTriangle,
  Layers,
  BookOpen,
  Sparkles,
  PieChart,
  Eye,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Color data
   ───────────────────────────────────────────── */

interface ColorDef {
  hex: string
  name: string
  usage: string
  twClass?: string
}

const primaires: ColorDef[] = [
  { hex: '#1A8F8A', name: 'Teal', usage: 'Logo, liens, boutons primaires, icônes actives', twClass: 'bg-teal' },
  { hex: '#1A2B3C', name: 'Bleu Nuit', usage: 'Titres, texte principal, footer, navbar', twClass: 'bg-bleu-nuit' },
  { hex: '#F2F5EE', name: 'Blanc Cassé', usage: 'Fond de page, espaces de respiration', twClass: 'bg-blanc-casse' },
]

const secondaires: ColorDef[] = [
  { hex: '#7A4F6D', name: 'Prune', usage: 'CTAs secondaires, accents, badges, témoignages', twClass: 'bg-prune' },
  { hex: '#88C9C7', name: 'Teal Clair', usage: 'Fonds de sections, badges info, tags, hover states', twClass: 'bg-teal-clair' },
  { hex: '#A8C280', name: 'Sauge', usage: 'Illustrations, décorations, fonds secondaires', twClass: 'bg-sauge' },
  { hex: '#2A4A5C', name: 'Bleu Nuit Clair', usage: 'Bordures, délimitations subtiles', twClass: 'bg-bleu-nuit-clair' },
]

const blancCasseGradient = [
  { hex: '#E8E0D4', label: 'Beige chaud' },
  { hex: '#ECE6DC', label: 'Sable doux' },
  { hex: '#F0EDE4', label: 'Crème' },
  { hex: '#F2F5EE', label: 'Blanc Cassé' },
  { hex: '#F6F8F3', label: 'Brume' },
  { hex: '#FAFBF8', label: 'Givre' },
  { hex: '#FFFFFF', label: 'Blanc pur' },
]

const darkModeColors: ColorDef[] = [
  { hex: '#0F1A24', name: 'Fond sombre', usage: 'Background principal en mode sombre' },
  { hex: '#162535', name: 'Surface sombre', usage: 'Cartes, modales, surfaces élevées' },
  { hex: '#88C9C7', name: 'Teal dark', usage: 'Accent principal en mode sombre' },
  { hex: '#E4E4E4', name: 'Texte clair', usage: 'Texte principal sur fond sombre' },
]

const functionalColors: ColorDef[] = [
  { hex: '#5A8A4A', name: 'Succès', usage: 'Validation, confirmation, étape réussie' },
  { hex: '#E05252', name: 'Erreur', usage: 'Erreur, suppression, alerte critique' },
  { hex: '#F0A500', name: 'Avertissement', usage: 'Attention, action requise' },
  { hex: '#88C9C7', name: 'Information', usage: 'Info neutre, aide contextuelle' },
]

const usageGuide = [
  { color: '#1A8F8A', name: 'Teal', elements: 'Logo, liens, boutons primaires, icônes actives, progress bars' },
  { color: '#1A2B3C', name: 'Bleu Nuit', elements: 'Titres, texte principal, footer, navbar fond' },
  { color: '#F2F5EE', name: 'Blanc Cassé', elements: 'Fond de page, espaces de respiration' },
  { color: '#7A4F6D', name: 'Prune', elements: 'CTAs secondaires, accents, badges, témoignages' },
  { color: '#88C9C7', name: 'Teal Clair', elements: 'Fonds de sections, badges info, tags, hover states' },
  { color: '#A8C280', name: 'Sauge', elements: 'Illustrations, décorations, fonds secondaires' },
  { color: '#2A4A5C', name: 'Bleu Nuit Clair', elements: 'Bordures, délimitations subtiles' },
]

const colorMeaning = [
  {
    hex: '#1A8F8A',
    name: 'Teal',
    psychology: 'Expertise, confiance, sérénité.',
    whyEmancia: 'Choisi car Emancia veut rassurer sur les finances. Couleur entre le bleu (confiance) et le vert (croissance).',
    brand: 'Positionne la marque comme un guide calme et compétent dans un domaine souvent anxiogène.',
  },
  {
    hex: '#1A2B3C',
    name: 'Bleu Nuit',
    psychology: 'Profondeur, sérieux, fiabilité.',
    whyEmancia: 'Ancre la marque dans la crédibilité financière sans être austère.',
    brand: 'Donne une autorité naturelle aux contenus pédagogiques et renforce la confiance du lecteur.',
  },
  {
    hex: '#F2F5EE',
    name: 'Blanc Cassé',
    psychology: 'Pureté, accessibilité, respiration.',
    whyEmancia: 'Plus chaleureux qu\'un blanc pur, crée un espace accueillant.',
    brand: 'Invite à la lecture longue et réduit la fatigue visuelle, essentiel pour un média éducatif.',
  },
  {
    hex: '#7A4F6D',
    name: 'Prune',
    psychology: 'Émancipation, originalité, audace.',
    whyEmancia: 'Complémentaire du teal (harmonie split-complémentaire). Apporte une touche humaine et distinctive.',
    brand: 'Différencie Emancia des marques financières classiques, souvent froides et masculines.',
  },
  {
    hex: '#88C9C7',
    name: 'Teal Clair',
    psychology: 'Légèreté, ouverture, fraîcheur.',
    whyEmancia: 'Déclinaison du teal pour les éléments secondaires, évite la monotonie.',
    brand: 'Crée de la profondeur dans la palette sans introduire de dissonance chromatique.',
  },
  {
    hex: '#A8C280',
    name: 'Sauge',
    psychology: 'Nature, douceur, croissance.',
    whyEmancia: 'Rappelle la croissance financière organique, jamais agressive.',
    brand: 'Humanise la communication financière et évoque un progrès naturel et durable.',
  },
  {
    hex: '#2A4A5C',
    name: 'Bleu Nuit Clair',
    psychology: 'Structure, subtilité, cohésion.',
    whyEmancia: 'Pour les délimitations discrètes qui structurent sans alourdir.',
    brand: 'Permet un design propre et organisé sans bordures lourdes ni contrastes agressifs.',
  },
]

/* ─────────────────────────────────────────────
   Utility helpers
   ───────────────────────────────────────────── */

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

function CopyableHex({ hex, light = false }: { hex: string; light?: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 font-mono text-xs transition-colors hover:opacity-80"
      title="Copier le code hex"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      <span className={light ? 'text-white/80' : 'text-bleu-nuit/60'}>{hex}</span>
    </button>
  )
}

function ColorCard({ color }: { color: ColorDef }) {
  const light = !isLightColor(color.hex)

  return (
    <div className="rounded-2xl overflow-hidden border border-[#2A4A5C]/15 shadow-sm">
      <div
        className="h-32 flex flex-col justify-end p-4"
        style={{ backgroundColor: color.hex }}
      >
        <p className={`font-display text-lg font-semibold ${light ? 'text-white' : 'text-bleu-nuit'}`}>
          {color.name}
        </p>
        <CopyableHex hex={color.hex} light={light} />
      </div>
      <div className="bg-white p-4">
        <p className="text-xs text-bleu-nuit/70 leading-relaxed">{color.usage}</p>
        <p className="text-[10px] text-bleu-nuit/40 font-mono mt-2">RGB: {hexToRgb(color.hex)}</p>
      </div>
    </div>
  )
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
          <Icon size={20} className="text-teal" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-bleu-nuit">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-bleu-nuit/70 max-w-2xl leading-relaxed ml-[52px]">{subtitle}</p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────── */

export default function CouleursPage() {
  return (
    <>
      <PageHeader
        title="Palette de couleurs"
        description="Système chromatique Emancia — 3 couleurs primaires, 4 secondaires. Chaque couleur incarne une valeur de la marque et sert un rôle précis dans l'interface."
      />

      {/* ── Couleurs primaires ── */}
      <section className="mb-16">
        <SectionHeading
          icon={Palette}
          title="Couleurs primaires"
          subtitle="Les trois piliers chromatiques d'Emancia. Elles définissent l'identité visuelle principale et sont présentes dans chaque support."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {primaires.map((c) => (
            <ColorCard key={c.hex} color={c} />
          ))}
        </div>
      </section>

      {/* ── Gradient Blanc Casse ── */}
      <section className="mb-16">
        <SectionHeading
          icon={Eye}
          title="Échelle du Blanc Cassé"
          subtitle="Du beige chaud au blanc pur : les nuances de fond utilisables pour créer de la profondeur et de la hiérarchie sans recourir à la couleur."
        />

        <div className="grid grid-cols-7 gap-0 rounded-2xl overflow-hidden border border-[#2A4A5C]/15 shadow-sm">
          {blancCasseGradient.map((shade) => (
            <div key={shade.hex} className="flex flex-col">
              <div
                className="h-28 border-r border-[#2A4A5C]/10 last:border-r-0"
                style={{ backgroundColor: shade.hex }}
              />
              <div className="bg-white p-3 text-center border-r border-[#2A4A5C]/10 last:border-r-0">
                <p className="text-[11px] font-semibold text-bleu-nuit">{shade.label}</p>
                <p className="text-[10px] font-mono text-bleu-nuit/50 mt-0.5">{shade.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Couleurs secondaires ── */}
      <section className="mb-16">
        <SectionHeading
          icon={Layers}
          title="Couleurs secondaires"
          subtitle="Elles complètent la palette primaire pour les accents, décorations et éléments d'interface secondaires. Chacune a un rôle défini."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaires.map((c) => (
            <ColorCard key={c.hex} color={c} />
          ))}
        </div>
      </section>

      {/* ── Mode sombre ── */}
      <section className="mb-16">
        <SectionHeading
          icon={Moon}
          title="Mode sombre"
          subtitle="Adaptation de la palette pour les interfaces en mode sombre. Les fonds deviennent des bleus nuit profonds, le teal s'éclaircit pour conserver sa lisibilité."
        />

        <div className="rounded-2xl overflow-hidden border border-[#2A4A5C]/15">
          <div className="p-8" style={{ backgroundColor: '#0F1A24' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {darkModeColors.map((c) => {
                const light = !isLightColor(c.hex)
                return (
                  <div key={c.hex} className="rounded-xl overflow-hidden border border-white/10">
                    <div
                      className="h-24 flex items-end p-3"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className={`font-display text-sm font-semibold ${light ? 'text-white' : 'text-bleu-nuit'}`}>
                        {c.name}
                      </span>
                    </div>
                    <div className="p-3" style={{ backgroundColor: '#162535' }}>
                      <p className="text-xs text-white/60 leading-relaxed">{c.usage}</p>
                      <p className="text-[10px] font-mono text-white/40 mt-1">{c.hex}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Couleurs fonctionnelles ── */}
      <section className="mb-16">
        <SectionHeading
          icon={AlertTriangle}
          title="Couleurs fonctionnelles"
          subtitle="Couleurs d'interface pour les retours utilisateur. Le succès utilise une sauge foncée cohérente avec la palette ; erreur, avertissement et info restent standards."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {functionalColors.map((c) => (
            <div key={c.hex} className="rounded-2xl overflow-hidden border border-[#2A4A5C]/15 shadow-sm">
              <div
                className="h-20 flex items-end p-4"
                style={{ backgroundColor: c.hex }}
              >
                <span className="text-white font-display font-semibold text-sm">{c.name}</span>
              </div>
              <div className="bg-white p-4">
                <p className="text-xs text-bleu-nuit/70 leading-relaxed">{c.usage}</p>
                <p className="text-[10px] font-mono text-bleu-nuit/40 mt-2">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Guide d'utilisation ── */}
      <section className="mb-16">
        <SectionHeading
          icon={BookOpen}
          title="Guide d'utilisation des couleurs"
          subtitle="Référence rapide : quel élément utilise quelle couleur. À consulter avant chaque création de composant ou de support."
        />

        <div className="rounded-2xl overflow-hidden border border-[#2A4A5C]/15 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-bleu-nuit text-white">
                <th className="text-left px-6 py-4 font-display text-sm font-semibold">Couleur</th>
                <th className="text-left px-6 py-4 font-display text-sm font-semibold">Code</th>
                <th className="text-left px-6 py-4 font-display text-sm font-semibold">Éléments</th>
              </tr>
            </thead>
            <tbody>
              {usageGuide.map((row, i) => (
                <tr
                  key={row.color}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-blanc-casse/50'}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg shrink-0 border border-[#2A4A5C]/15"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="text-sm font-semibold text-bleu-nuit">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-bleu-nuit/60">{row.color}</td>
                  <td className="px-6 py-4 text-sm text-bleu-nuit/70">{row.elements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Signification des couleurs ── */}
      <section className="mb-16">
        <SectionHeading
          icon={Sparkles}
          title="Signification des couleurs"
          subtitle="Chaque couleur Emancia a été choisie pour incarner une valeur fondatrice. Ce n'est pas un choix esthétique : c'est un langage visuel."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colorMeaning.map((c) => {
            const light = !isLightColor(c.hex)
            return (
              <div key={c.hex} className="rounded-2xl overflow-hidden border border-[#2A4A5C]/15 shadow-sm bg-white">
                {/* Color header */}
                <div className="relative px-6 py-8 overflow-hidden" style={{ backgroundColor: c.hex }}>
                  <span
                    className="absolute -right-4 -top-6 text-[120px] font-display font-bold leading-none pointer-events-none select-none"
                    style={{ color: light ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                  >
                    {c.name[0]}
                  </span>
                  <div className="relative z-10">
                    <h3 className="font-display text-xl font-semibold mb-1" style={{ color: light ? '#FFFFFF' : '#1A2B3C' }}>
                      {c.name}
                    </h3>
                    <p className="text-sm font-mono" style={{ color: light ? 'rgba(255,255,255,0.7)' : 'rgba(26,43,60,0.5)' }}>
                      {c.hex}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: isLightColor(c.hex) ? '#1A8F8A' : c.hex }}>
                      Psychologie
                    </p>
                    <p className="text-sm text-bleu-nuit/70 leading-relaxed">{c.psychology}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: isLightColor(c.hex) ? '#1A8F8A' : c.hex }}>
                      Pourquoi chez Emancia
                    </p>
                    <p className="text-sm text-bleu-nuit/70 leading-relaxed">{c.whyEmancia}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: isLightColor(c.hex) ? '#1A8F8A' : c.hex }}>
                      Bénéfice pour la marque
                    </p>
                    <p className="text-sm text-bleu-nuit/70 leading-relaxed">{c.brand}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Proportions ── */}
      <section className="mb-16">
        <SectionHeading
          icon={PieChart}
          title="Proportions chromatiques"
          subtitle="La règle de répartition des couleurs dans chaque composition. Respecter ces proportions garantit la cohérence visuelle sur tous les supports."
        />

        <div className="rounded-2xl overflow-hidden border border-[#2A4A5C]/15 shadow-sm bg-white p-8">
          {/* Visual proportion bar */}
          <div className="flex h-16 rounded-xl overflow-hidden mb-8 border border-[#2A4A5C]/15">
            <div className="flex items-center justify-center" style={{ width: '60%', backgroundColor: '#F2F5EE' }}>
              <span className="text-xs font-semibold text-bleu-nuit">60%</span>
            </div>
            <div className="flex items-center justify-center" style={{ width: '20%', backgroundColor: '#1A2B3C' }}>
              <span className="text-xs font-semibold text-white">20%</span>
            </div>
            <div className="flex items-center justify-center" style={{ width: '10%', backgroundColor: '#1A8F8A' }}>
              <span className="text-xs font-semibold text-white">10%</span>
            </div>
            <div className="flex items-center justify-center" style={{ width: '5%', backgroundColor: '#7A4F6D' }}>
              <span className="text-[10px] font-semibold text-white">5%</span>
            </div>
            <div className="flex items-center justify-center" style={{ width: '5%', backgroundColor: '#A8C280' }}>
              <span className="text-[10px] font-semibold text-bleu-nuit">5%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { color: '#F2F5EE', name: 'Blanc Cassé', pct: '60%', role: 'Fond' },
              { color: '#1A2B3C', name: 'Bleu Nuit', pct: '20%', role: 'Texte' },
              { color: '#1A8F8A', name: 'Teal', pct: '10%', role: 'Accents' },
              { color: '#7A4F6D', name: 'Prune', pct: '5%', role: 'CTAs' },
              { color: '#A8C280', name: 'Sauge + Teal Clair', pct: '5%', role: 'Décorations' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-md shrink-0 border border-[#2A4A5C]/15"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-xs font-semibold text-bleu-nuit">
                    {item.pct} {item.name}
                  </p>
                  <p className="text-[10px] text-bleu-nuit/50">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regles d'application ── */}
      <section className="mb-16">
        <SectionHeading
          icon={AlertTriangle}
          title="Règles d'application"
          subtitle="Principes inviolables pour garantir la cohérence chromatique de la marque."
        />

        <div className="space-y-4">
          {[
            {
              title: 'Max 3 couleurs par composition',
              body: 'Ne jamais utiliser plus de 3 couleurs brand dans une même composition. La surface du bloc indique l\'importance de la couleur. Le fond domine, la couleur principale structure, l\'accent ponctue.',
            },
            {
              title: 'Contraste WCAG AA',
              body: 'Tout texte doit respecter un ratio de contraste minimum de 4.5:1 pour le texte courant et 3:1 pour les textes de grande taille (>= 18px bold ou >= 24px regular).',
            },
            {
              title: 'Déclinaisons autorisées',
              body: 'Les déclinaisons de chaque couleur se font uniquement par saturation et luminosité. La teinte (hue) reste toujours identique. Pas de dégradés, pas de nouvelles couleurs inventées.',
            },
            {
              title: 'Pas de gris pour le texte',
              body: 'Le texte principal utilise Bleu Nuit (#1A2B3C). Le texte secondaire utilise Bleu Nuit à 70% d\'opacité. Jamais de gris neutre : cela préserve la chaleur de la palette.',
            },
          ].map((rule) => (
            <div key={rule.title} className="bg-white rounded-xl p-6 border border-[#2A4A5C]/15">
              <h3 className="font-display font-semibold text-bleu-nuit mb-2">{rule.title}</h3>
              <p className="text-sm text-bleu-nuit/70 leading-relaxed font-body">{rule.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CommentsSection pageSlug="couleurs" />
    </>
  )
}
