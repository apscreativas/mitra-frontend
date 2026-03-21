'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useRoles } from '../hooks'
import { columns } from './columns'
import type { RoleListParams } from '../types'

export function RoleList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const params: RoleListParams = {
    search: searchParams.get('search') ?? undefined,
    page: Number(searchParams.get('page')) || 1,
    per_page: 15,
  }

  const { data, isLoading, error, refetch } = useRoles(params)

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
      <Input
        placeholder={labels.common.search}
        defaultValue={params.search ?? ''}
        onChange={(e) => updateParams({ search: e.target.value || undefined })}
        className="max-w-sm"
      />

      {isLoading ? (
        <LoadingState />
      ) : !data?.data.length ? (
        <EmptyState message={labels.roles.empty} />
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
