import { brand } from '@/lib/brand'
import { PageHeader } from '@/components/PageHeader'
import Image from 'next/image'
import { CommentsSection } from '@/components/CommentsSection'

export default function LogoPage() {
  return (
    <>
      <PageHeader
        title="Logo"
        description="Le logo Emancia est un logotype où le symbole — une colombe stylisée fusionnée avec la lettre E — s'intègre organiquement au texte. Il a été conçu par Studio 73 sous Adobe Illustrator."
      />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Versions</h2>
        <div className="space-y-6">
          {brand.logos.map((logo) => (
            <div
              key={logo.name}
              className="bg-white rounded-xl p-8 border border-gris-leger"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{logo.name}</h3>
                  <p className="text-sm text-bleu-nuit/70 mt-1">{logo.description}</p>
                </div>
                <span className="text-xs font-mono bg-teal-clair text-teal-dark px-2 py-1 rounded">
                  ratio {logo.ratio}
                </span>
              </div>
              <div className="bg-blanc-naturel rounded-lg p-8 flex items-center justify-center min-h-[120px] border border-gris-leger/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.file} alt={logo.name} className="max-h-20 w-auto" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {logo.usage.map((use) => (
                  <span
                    key={use}
                    className="text-xs bg-teal-clair/50 text-teal-dark px-3 py-1 rounded-full"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Zone de protection</h2>
        <div className="bg-white rounded-xl p-8 border border-gris-leger">
          <p className="leading-relaxed mb-6 text-bleu-nuit/70">
            Le module de référence <strong className="text-bleu-nuit">&quot;x&quot;</strong> correspond
            à la hauteur des minuscules dans le logotype (43,9 unités SVG). La zone de
            protection garantit la lisibilité du logo — aucun élément graphique ou texte
            ne peut y figurer.
          </p>

          <div className="space-y-10">
            {/* --- Logotype principal --- */}
            <div>
              <h3 className="text-sm font-semibold text-bleu-nuit mb-3 uppercase tracking-wider">
                Logotype principal — zone 1x
              </h3>
              <div className="bg-[#F2F5EE] rounded-lg p-12 flex items-center justify-center">
                <div className="relative inline-flex items-center justify-center">
                  {/* Protection zone (shaded) */}
                  <div className="absolute inset-0 -m-10 border-2 border-dashed border-[#2A4A5C]/40 bg-[#2A4A5C]/[0.04] rounded" />

                  {/* Top measurement */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[11px] font-mono font-semibold text-[#1A8F8A] mb-0.5">1x</span>
                    <svg width="2" height="24" className="text-[#1A8F8A]">
                      <line x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                  </div>

                  {/* Bottom measurement */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <svg width="2" height="24" className="text-[#1A8F8A]">
                      <line x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                    <span className="text-[11px] font-mono font-semibold text-[#1A8F8A] mt-0.5">1x</span>
                  </div>

                  {/* Left measurement */}
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="text-[11px] font-mono font-semibold text-[#1A8F8A] mr-0.5">1x</span>
                    <svg width="24" height="2" className="text-[#1A8F8A]">
                      <line x1="0" y1="1" x2="24" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                  </div>

                  {/* Right measurement */}
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex items-center">
                    <svg width="24" height="2" className="text-[#1A8F8A]">
                      <line x1="0" y1="1" x2="24" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                    <span className="text-[11px] font-mono font-semibold text-[#1A8F8A] ml-0.5">1x</span>
                  </div>

                  {/* Corner marks */}
                  {/* Top-left */}
                  <div className="absolute -top-10 -left-10">
                    <div className="w-2 h-2 border-t-2 border-l-2 border-[#2A4A5C]/30 rounded-tl-sm" />
                  </div>
                  {/* Top-right */}
                  <div className="absolute -top-10 -right-10">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-[#2A4A5C]/30 rounded-tr-sm" />
                  </div>
                  {/* Bottom-left */}
                  <div className="absolute -bottom-10 -left-10">
                    <div className="w-2 h-2 border-b-2 border-l-2 border-[#2A4A5C]/30 rounded-bl-sm" />
                  </div>
                  {/* Bottom-right */}
                  <div className="absolute -bottom-10 -right-10">
                    <div className="w-2 h-2 border-b-2 border-r-2 border-[#2A4A5C]/30 rounded-br-sm" />
                  </div>

                  {/* Logo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/logo-main.svg" alt="Emancia — logotype principal" className="h-12 w-auto relative z-10" />
                </div>
              </div>
            </div>

            {/* --- Logotype + baseline --- */}
            <div>
              <h3 className="text-sm font-semibold text-bleu-nuit mb-3 uppercase tracking-wider">
                Logotype + baseline — zone 1x
              </h3>
              <div className="bg-[#F2F5EE] rounded-lg p-12 flex items-center justify-center">
                <div className="relative inline-flex items-center justify-center">
                  {/* Protection zone (shaded) */}
                  <div className="absolute inset-0 -m-10 border-2 border-dashed border-[#2A4A5C]/40 bg-[#2A4A5C]/[0.04] rounded" />

                  {/* Top measurement */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[11px] font-mono font-semibold text-[#1A8F8A] mb-0.5">1x</span>
                    <svg width="2" height="24" className="text-[#1A8F8A]">
                      <line x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                  </div>

                  {/* Bottom measurement — from baseline text */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <svg width="2" height="24" className="text-[#1A8F8A]">
                      <line x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                    <span className="text-[11px] font-mono font-semibold text-[#1A8F8A] mt-0.5">1x</span>
                  </div>

                  {/* Left measurement */}
                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="text-[11px] font-mono font-semibold text-[#1A8F8A] mr-0.5">1x</span>
                    <svg width="24" height="2" className="text-[#1A8F8A]">
                      <line x1="0" y1="1" x2="24" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                  </div>

                  {/* Right measurement */}
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex items-center">
                    <svg width="24" height="2" className="text-[#1A8F8A]">
                      <line x1="0" y1="1" x2="24" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                    <span className="text-[11px] font-mono font-semibold text-[#1A8F8A] ml-0.5">1x</span>
                  </div>

                  {/* Corner marks */}
                  <div className="absolute -top-10 -left-10">
                    <div className="w-2 h-2 border-t-2 border-l-2 border-[#2A4A5C]/30 rounded-tl-sm" />
                  </div>
                  <div className="absolute -top-10 -right-10">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-[#2A4A5C]/30 rounded-tr-sm" />
                  </div>
                  <div className="absolute -bottom-10 -left-10">
                    <div className="w-2 h-2 border-b-2 border-l-2 border-[#2A4A5C]/30 rounded-bl-sm" />
                  </div>
                  <div className="absolute -bottom-10 -right-10">
                    <div className="w-2 h-2 border-b-2 border-r-2 border-[#2A4A5C]/30 rounded-br-sm" />
                  </div>

                  {/* Logo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/logo-baseline.svg" alt="Emancia — logotype avec baseline" className="h-14 w-auto relative z-10" />
                </div>
              </div>
              <p className="text-xs text-bleu-nuit/50 mt-2 italic">
                La mesure inférieure (1x) est prise depuis le bas du texte de la baseline.
              </p>
            </div>

            {/* --- Icône / Favicon --- */}
            <div>
              <h3 className="text-sm font-semibold text-bleu-nuit mb-3 uppercase tracking-wider">
                Icone / Favicon — zone 0.5x
              </h3>
              <div className="bg-[#F2F5EE] rounded-lg p-12 flex items-center justify-center">
                <div className="relative inline-flex items-center justify-center">
                  {/* Protection zone (shaded) */}
                  <div className="absolute inset-0 -m-6 border-2 border-dashed border-[#2A4A5C]/40 bg-[#2A4A5C]/[0.04] rounded" />

                  {/* Top measurement */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[10px] font-mono font-semibold text-[#1A8F8A] mb-px leading-none">0.5x</span>
                    <svg width="2" height="12" className="text-[#1A8F8A]">
                      <line x1="1" y1="0" x2="1" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                    </svg>
                  </div>

                  {/* Bottom measurement */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <svg width="2" height="12" className="text-[#1A8F8A]">
                      <line x1="1" y1="0" x2="1" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                    </svg>
                    <span className="text-[10px] font-mono font-semibold text-[#1A8F8A] mt-px leading-none">0.5x</span>
                  </div>

                  {/* Left measurement */}
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center">
                    <span className="text-[10px] font-mono font-semibold text-[#1A8F8A] mr-px leading-none">0.5x</span>
                    <svg width="12" height="2" className="text-[#1A8F8A]">
                      <line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                    </svg>
                  </div>

                  {/* Right measurement */}
                  <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex items-center">
                    <svg width="12" height="2" className="text-[#1A8F8A]">
                      <line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                    </svg>
                    <span className="text-[10px] font-mono font-semibold text-[#1A8F8A] ml-px leading-none">0.5x</span>
                  </div>

                  {/* Corner marks */}
                  <div className="absolute -top-6 -left-6">
                    <div className="w-1.5 h-1.5 border-t-2 border-l-2 border-[#2A4A5C]/30" />
                  </div>
                  <div className="absolute -top-6 -right-6">
                    <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-[#2A4A5C]/30" />
                  </div>
                  <div className="absolute -bottom-6 -left-6">
                    <div className="w-1.5 h-1.5 border-b-2 border-l-2 border-[#2A4A5C]/30" />
                  </div>
                  <div className="absolute -bottom-6 -right-6">
                    <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-[#2A4A5C]/30" />
                  </div>

                  {/* Icon */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logos/logo-icon.svg" alt="Emancia — icone" className="h-12 w-12 relative z-10" />
                </div>
              </div>
              <p className="text-xs text-bleu-nuit/50 mt-2 italic">
                Zone réduite à 0.5x pour l&apos;icone carrée (favicon, app icon).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Tailles minimales</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gris-leger">
            <h3 className="font-semibold mb-2">Écran</h3>
            <p className="text-sm text-bleu-nuit/70">
              Logotype : min. <strong className="font-mono">120px</strong> de large<br />
              Symbole seul : min. <strong className="font-mono">32px</strong>
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gris-leger">
            <h3 className="font-semibold mb-2">Impression</h3>
            <p className="text-sm text-bleu-nuit/70">
              Logotype : min. <strong className="font-mono">30mm</strong> de large<br />
              Symbole seul : min. <strong className="font-mono">10mm</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Déclinaisons chromatiques</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blanc-naturel rounded-xl p-8 flex flex-col items-center justify-center gap-3 border border-gris-leger min-h-[140px]">
            <Image src="/logos/logo-main.svg" alt="Logo sur fond clair" width={180} height={45} className="h-10 w-auto" />
            <p className="text-xs text-bleu-nuit/50">Fond clair</p>
          </div>
          <div className="bg-bleu-nuit rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[140px]">
            <Image src="/logos/logo-main.svg" alt="Logo sur fond sombre" width={180} height={45} className="h-10 w-auto brightness-0 invert" />
            <p className="text-xs text-white/30">Fond sombre</p>
          </div>
          <div className="bg-teal rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[140px]">
            <Image src="/logos/logo-main.svg" alt="Logo sur teal" width={180} height={45} className="h-10 w-auto brightness-0 invert" />
            <p className="text-xs text-white/40">Sur teal</p>
          </div>
          <div className="bg-prune rounded-xl p-8 flex flex-col items-center justify-center gap-3 min-h-[140px]">
            <Image src="/logos/logo-main.svg" alt="Logo sur prune" width={180} height={45} className="h-10 w-auto brightness-0 invert" />
            <p className="text-xs text-white/40">Sur prune</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-error">Usages interdits</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            'Déformer ou étirer le logo',
            'Modifier les couleurs hors déclinaisons',
            'Ajouter des effets (ombre, reflet, 3D)',
            'Placer sur un fond de contraste insuffisant',
            'Rogner ou masquer une partie',
            'Modifier les proportions du symbole',
            'Ajouter un contour au logo',
            'Utiliser le logo en filigrane',
            'Changer la typographie du logotype',
            'Animer le logo sans validation',
          ].map((rule) => (
            <div
              key={rule}
              className="flex items-start gap-3 bg-error/5 rounded-lg p-4 border border-error/10"
            >
              <span className="text-error font-bold text-lg leading-none">×</span>
              <p className="text-sm">{rule}</p>
            </div>
          ))}
        </div>
      </section>
      <CommentsSection pageSlug="logo" />
    </>
  )
}
