'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { User } from 'lucide-react'

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
      { href: '/idees-contenus', label: 'Idées de contenus' },
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
      <div className="p-6 border-b border-white/15">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logos/logo-icon.svg"
            alt="Emancia"
            width={32}
            height={32}
            className="brightness-0 invert transition-transform group-hover:scale-105"
          />
          <div>
            <h1 className="font-display text-lg font-semibold text-white leading-tight">
              Emancia
            </h1>
            <p className="text-[11px] text-white/50 leading-tight">Charte Graphique</p>
          </div>
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
