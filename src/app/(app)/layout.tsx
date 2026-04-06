import { Sidebar } from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-64 p-12 max-w-6xl">
        {children}
      </main>
    </>
  )
}
