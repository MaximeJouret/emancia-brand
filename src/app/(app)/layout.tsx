'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header with hamburger */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center h-14 px-4 bg-white border-b border-gray-200 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <main className="flex-1 ml-0 md:ml-64 pt-14 md:pt-0 px-6 md:px-12 pb-12 pt-20 md:pt-10 max-w-6xl">
        {children}
      </main>
    </>
  )
}
