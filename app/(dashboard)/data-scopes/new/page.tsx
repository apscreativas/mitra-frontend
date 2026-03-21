import { DataScopeRuleBuilder } from '@/modules/data-scopes/components/DataScopeRuleBuilder'
import { labels } from '@/lib/labels'

export default function NewDataScopePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{labels.dataScopes.create}</h1>
      <DataScopeRuleBuilder mode="create" />
    </div>
  )
}
