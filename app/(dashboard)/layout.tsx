'use client'

import { useUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingState } from '@/components/ui/states'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (error || !user)) {
      router.replace('/login')
    }
  }, [user, isLoading, error, router])

  if (isLoading) return <LoadingState />
  if (!user) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
