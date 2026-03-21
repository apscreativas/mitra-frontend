'use client'

import { use } from 'react'
import { useDataScopeRule } from '@/modules/data-scopes/hooks'
import { DataScopeRuleBuilder } from '@/modules/data-scopes/components/DataScopeRuleBuilder'
import { LoadingState, ErrorState, NotFoundState } from '@/components/ui/states'
import { labels } from '@/lib/labels'

export default function EditDataScopePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, error, refetch } = useDataScopeRule(id)

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data) return <NotFoundState />

  const rule = data.data

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {labels.common.edit} — {rule.name}
      </h1>
      <DataScopeRuleBuilder
        mode="edit"
        ruleId={id}
        defaultValues={{
          name: rule.name,
          entity: rule.entity,
          entity_label: rule.entity_label,
          type: rule.type,
          configuration: rule.configuration,
          description: rule.description,
        }}
      />
    </div>
  )
}
