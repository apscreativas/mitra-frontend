'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ActionsDropdown } from '@/components/ui/actions-dropdown'
import { labels } from '@/lib/labels'
import type { DataScopeRule } from '../types'

export const columns: ColumnDef<DataScopeRule>[] = [
  {
    accessorKey: 'name',
    header: labels.dataScopes.fields.name,
  },
  {
    accessorKey: 'entity_label',
    header: labels.dataScopes.fields.entity,
  },
  {
    accessorKey: 'type',
    header: labels.dataScopes.fields.type,
    cell: ({ row }) => (
      <Badge variant="secondary">
        {labels.dataScopes.types[row.original.type]}
      </Badge>
    ),
  },
  {
    accessorKey: 'description',
    header: labels.dataScopes.fields.description,
    cell: ({ row }) => row.original.description ?? '—',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ActionsDropdown
        editHref={`/data-scopes/${row.original.id}/edit`}
        editPermission="data_scopes.update"
      />
    ),
  },
]
