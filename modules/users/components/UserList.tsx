'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useUsers } from '../hooks'
import { columns } from './columns'
import type { UserListParams } from '../types'

export function UserList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const params: UserListParams = {
    search: searchParams.get('search') ?? undefined,
    'filter[status]': searchParams.get('status') ?? undefined,
    page: Number(searchParams.get('page')) || 1,
    per_page: 15,
    sort: searchParams.get('sort') ?? '-created_at',
  }

  const { data, isLoading, error, refetch } = useUsers(params)

  function updateParams(updates: Record<string, string | null | undefined>) {
    const newParams = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    }
    newParams.delete('page')
    router.push(`?${newParams.toString()}`)
  }

  if (error) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder={labels.common.search}
          defaultValue={params.search ?? ''}
          onChange={(e) => updateParams({ search: e.target.value || undefined })}
          className="max-w-sm"
        />
        <Select
          value={searchParams.get('status') ?? 'all'}
          onValueChange={(v) => updateParams({ status: v === 'all' ? undefined : v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder={labels.users.filters.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{labels.common.filters}</SelectItem>
            <SelectItem value="active">{labels.users.statuses.active}</SelectItem>
            <SelectItem value="inactive">{labels.users.statuses.inactive}</SelectItem>
            <SelectItem value="blocked">{labels.users.statuses.blocked}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !data?.data.length ? (
        <EmptyState message={labels.users.empty} />
      ) : (
        <DataTable
          columns={columns}
          data={data.data}
          pagination={data.meta}
          onFiltersChange={(filters) => {
            if (filters.page) {
              const newParams = new URLSearchParams(searchParams.toString())
              newParams.set('page', String(filters.page))
              router.push(`?${newParams.toString()}`)
            }
          }}
        />
      )}
    </div>
  )
}
