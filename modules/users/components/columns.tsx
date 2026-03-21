'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ActionsDropdown } from '@/components/ui/actions-dropdown'
import { labels } from '@/lib/labels'
import type { User } from '../types'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  active: 'default',
  inactive: 'secondary',
  blocked: 'destructive',
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: labels.users.fields.name,
  },
  {
    accessorKey: 'email',
    header: labels.users.fields.email,
  },
  {
    accessorKey: 'status',
    header: labels.users.fields.status,
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      return (
        <Badge variant={statusVariant[status] ?? 'secondary'}>
          {labels.users.statuses[status as keyof typeof labels.users.statuses] ?? status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'last_login_at',
    header: labels.users.lastLogin,
    cell: ({ row }) => {
      const date = row.getValue<string | null>('last_login_at')
      return date ? new Date(date).toLocaleDateString() : '—'
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ActionsDropdown
        viewHref={`/users/${row.original.id}`}
        editHref={`/users/${row.original.id}/edit`}
        viewPermission="users.view"
        editPermission="users.update"
      />
    ),
  },
]
