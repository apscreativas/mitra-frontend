'use client'

import type { ReactNode } from 'react'
import { usePermissions } from '@/lib/permissions'

interface AuthorizedProps {
  permission: string
  fallback?: ReactNode
  children: ReactNode
}

export function Authorized({ permission, fallback = null, children }: AuthorizedProps) {
  const { can } = usePermissions()

  if (!can(permission)) return <>{fallback}</>

  return <>{children}</>
}
