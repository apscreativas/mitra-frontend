'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Shield, SlidersHorizontal, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { useUser, useLogout } from '@/lib/auth'
import { labels } from '@/lib/labels'

const navItems = [
  { href: '/users', label: labels.nav.users, icon: Users, permission: 'users.view' },
  { href: '/roles', label: labels.nav.roles, icon: Shield, permission: 'roles.view' },
  { href: '/data-scopes', label: labels.nav.dataScopes, icon: SlidersHorizontal, permission: 'data_scopes.view' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: user } = useUser()
  const logout = useLogout()

  const userPermissions = user?.permissions ?? []

  function hasPermission(permission: string): boolean {
    return userPermissions.some((p) => {
      if (p === permission) return true
      if (p.endsWith('.*')) {
        return permission.startsWith(p.slice(0, -1))
      }
      return false
    })
  }

  const visibleItems = navItems.filter((item) => hasPermission(item.permission))

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/users" className="text-lg font-bold">
          {labels.common.appName}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{labels.nav.security}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                    render={<Link href={item.href} />}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator />
        <div className="flex items-center justify-between pt-2">
          <div className="truncate">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="ml-2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={labels.auth.logout}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
