'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { User, Lightbulb, Play } from 'lucide-react'

interface NavItem {
  href: string
  label: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Fondamentaux',
    items: [
      { href: '/', label: 'Identité' },
      { href: '/logo', label: 'Logo' },
      { href: '/couleurs', label: 'Couleurs' },
      { href: '/typographie', label: 'Typographie' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { href: '/ton-editorial', label: 'Ton éditorial' },
    ],
  },
  {
    title: 'Outils',
    items: [
      { href: '/icones', label: 'Icônes' },
      { href: '/composants', label: 'Composants' },
      { href: '/formes', label: 'Formes' },
      { href: '/graphiques', label: 'Graphiques' },
      { href: '/tokens', label: 'Tokens' },
    ],
  },
  {
    title: 'Mise en pratique',
    items: [
      { href: '/contextes', label: 'Contextes' },
      { href: '/regles', label: 'Do / Don\'t' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-teal text-white flex flex-col sidebar-scroll">
      <div className="p-5 pb-4 border-b border-white/15">
        <Link href="/" className="block group">
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
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            pathname === '/idees-contenus'
              ? 'bg-white text-teal shadow-sm'
              : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
          }`}
        >
          <Lightbulb size={16} />
          Idées de contenus
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-white/35 px-4 mb-1.5">{section.title}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white font-medium'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/profil'
              ? 'bg-white/20 text-white font-medium'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <User size={16} />
          Mon profil
        </Link>
        <p className="text-xs text-white/30 px-4">v2.0 — Avril 2026</p>
      </div>
    </aside>
  )
}
