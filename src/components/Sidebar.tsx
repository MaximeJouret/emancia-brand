'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bleu-nuit text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-display text-xl font-semibold text-white">
          Emancia
        </h1>
        <p className="text-sm text-white/60 mt-1">Charte Graphique</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-white/30 px-4 mb-1.5">{section.title}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-teal text-white font-medium'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
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

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/40">v2.0 — Avril 2026</p>
      </div>
    </aside>
  )
}
