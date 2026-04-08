'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  User, Lightbulb, Play, X,
  Fingerprint, ImageIcon, Palette, Type,
  MessageSquareText, Smile, Blocks, Circle,
  BarChart3, Code2, Layout, Scale,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavSection {
  title: string
  items: NavItem[]
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navSections: NavSection[] = [
  {
    title: 'Fondamentaux',
    items: [
      { href: '/', label: 'Identité', icon: Fingerprint },
      { href: '/logo', label: 'Logo', icon: ImageIcon },
      { href: '/couleurs', label: 'Couleurs', icon: Palette },
      { href: '/typographie', label: 'Typographie', icon: Type },
    ],
  },
  {
    title: 'Communication',
    items: [
      { href: '/ton-editorial', label: 'Ton éditorial', icon: MessageSquareText },
    ],
  },
  {
    title: 'Outils',
    items: [
      { href: '/icones', label: 'Icônes', icon: Smile },
      { href: '/composants', label: 'Composants', icon: Blocks },
      { href: '/formes', label: 'Formes', icon: Circle },
      { href: '/graphiques', label: 'Graphiques', icon: BarChart3 },
      { href: '/tokens', label: 'Tokens', icon: Code2 },
    ],
  },
  {
    title: 'Mise en pratique',
    items: [
      { href: '/contextes', label: 'Contextes', icon: Layout },
      { href: '/regles', label: 'Do / Don\'t', icon: Scale },
      { href: '/conformite', label: 'Conformité', icon: ShieldCheck },
    ],
  },
]

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleNavClick = () => {
    if (onClose) onClose()
  }

  const sidebarContent = (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-teal text-white flex flex-col sidebar-scroll z-40">
      {/* Close button - mobile only */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors md:hidden"
        aria-label="Fermer le menu"
      >
        <X size={20} />
      </button>

      <div className="p-5 pb-4 border-b border-white/15">
        <Link href="/" className="block group" onClick={handleNavClick}>
          <Image
            src="/logos/logo-main.svg"
            alt="Emancia"
            width={160}
            height={40}
            className="brightness-0 invert transition-transform group-hover:scale-[1.02]"
          />
          <p className="text-[11px] text-white/50 mt-1.5 ml-0.5">Charte Graphique</p>
        </Link>
      </div>

      {/* CTA Idées de contenus */}
      <div className="px-4 pt-4">
        <Link
          href="/idees-contenus"
          onClick={handleNavClick}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname === '/idees-contenus'
              ? 'bg-white text-teal shadow-sm'
              : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
          }`}
        >
          <Lightbulb size={16} />
          Idées de contenus
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto" aria-label="Navigation principale">
        {navSections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="text-[10px] uppercase tracking-widest text-white/35 px-3 mb-2 font-medium">{section.title}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative ${
                        isActive
                          ? 'bg-white/20 text-white font-medium'
                          : 'text-white/65 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-white" />
                      )}
                      <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/15 space-y-2">
        <Link
          href="/presentation"
          onClick={handleNavClick}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/presentation'
              ? 'bg-white text-teal shadow-sm'
              : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
          }`}
        >
          <Play size={14} />
          Présentation
        </Link>
        <Link
          href="/profil"
          onClick={handleNavClick}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/profil'
              ? 'bg-white/20 text-white font-medium'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <User size={16} />
          Mon profil
        </Link>
        <p className="text-xs text-white/30 px-4 pt-1">v2.0 — Avril 2026</p>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar - always visible */}
      <div className="hidden md:block">
        {sidebarContent}
      </div>

      {/* Mobile sidebar - overlay with backdrop */}
      {isOpen && (
        <div className="md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={onClose}
            aria-hidden="true"
          />
          {sidebarContent}
        </div>
      )}
    </>
  )
}
