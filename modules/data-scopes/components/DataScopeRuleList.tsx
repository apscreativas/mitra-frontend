'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { labels } from '@/lib/labels'
import { useDataScopeRules, useScopeableEntities } from '../hooks'
import { columns } from './columns'
import type { DataScopeRuleListParams } from '../types'

const ALL_ENTITIES = '__all__'

export function DataScopeRuleList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const entityFilter = searchParams.get('entity') ?? undefined

  const params: DataScopeRuleListParams = {
    'filter[entity]': entityFilter,
    page: Number(searchParams.get('page')) || 1,
    per_page: 15,
  }

  const { data, isLoading, error, refetch } = useDataScopeRules(params)
  const { data: entitiesData } = useScopeableEntities()

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
      <div className="flex items-center gap-4">
        <Select
          value={entityFilter ?? ALL_ENTITIES}
          onValueChange={(value) =>
            updateParams({ entity: value === ALL_ENTITIES ? null : value })
          }
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder={labels.dataScopes.selectEntity} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ENTITIES}>{labels.common.filters}</SelectItem>
            {entitiesData?.data.map((entity) => (
              <SelectItem key={entity.entity} value={entity.entity}>
                {entity.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !data?.data.length ? (
        <EmptyState message={labels.dataScopes.empty} />
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
