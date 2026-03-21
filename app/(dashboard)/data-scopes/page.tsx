import { DataScopeRuleList } from '@/modules/data-scopes/components/DataScopeRuleList'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import Link from 'next/link'

export default function DataScopesPage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{labels.dataScopes.title}</h1>
        <Authorized permission="data_scopes.create">
          <Button nativeButton={false} render={<Link href="/data-scopes/new" />}>{labels.dataScopes.create}</Button>
        </Authorized>
      </div>
      <DataScopeRuleList />
    </div>
  )
}
