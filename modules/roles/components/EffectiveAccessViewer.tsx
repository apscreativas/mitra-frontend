'use client'

import { Badge } from '@/components/ui/badge'
import { LoadingState, ErrorState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useEffectiveAccess } from '../hooks'
import type { EffectivePermission, EffectiveDataScopeEntry } from '../types'

interface EffectiveAccessViewerProps {
  userId: string
}

const sourceColors: Record<string, 'default' | 'secondary' | 'destructive'> = {
  role: 'default',
  direct_grant: 'secondary',
  direct_deny: 'destructive',
}

const sourceLabels: Record<string, string> = {
  role: labels.permissions.source.role,
  direct_grant: labels.permissions.source.directGrant,
  direct_deny: labels.permissions.source.directDeny,
}

const scopeSourceColors: Record<string, 'default' | 'secondary'> = {
  role: 'default',
  direct: 'secondary',
}

const scopeSourceLabels: Record<string, string> = {
  role: labels.permissions.source.role,
  direct: labels.permissions.source.directGrant,
}

export function EffectiveAccessViewer({ userId }: EffectiveAccessViewerProps) {
  const { data, isLoading, error, refetch } = useEffectiveAccess(userId)

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data) return null

  const grouped: Record<string, EffectivePermission[]> = {}
  for (const perm of data.data.permissions) {
    const mod = perm.name.split('.')[0]
    if (!grouped[mod]) grouped[mod] = []
    grouped[mod].push(perm)
  }

  const dataScopes = data.data.data_scopes ?? []
  const scopesByEntity: Record<string, EffectiveDataScopeEntry[]> = {}
  for (const scope of dataScopes) {
    const key = scope.entity_label
    if (!scopesByEntity[key]) scopesByEntity[key] = []
    scopesByEntity[key].push(scope)
  }

  return (
    <div className="space-y-6">
      {/* Permissions section */}
      <div className="space-y-4">
        <h3 className="font-semibold">{labels.permissions.effective}</h3>
        {Object.entries(grouped).map(([module, perms]) => (
          <div key={module} className="rounded-lg border p-4">
            <h4 className="mb-2 font-medium capitalize">{module}</h4>
            <div className="space-y-1">
              {perms.map((perm) => (
                <div
                  key={perm.name}
                  className="flex items-center justify-between rounded px-2 py-1 text-sm"
                >
                  <span className={perm.effective ? '' : 'line-through text-muted-foreground'}>
                    {perm.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant={sourceColors[perm.source]}>
                      {sourceLabels[perm.source]}
                    </Badge>
                    {perm.role_name && (
                      <span className="text-xs text-muted-foreground">({perm.role_name})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Data Scopes section */}
      {dataScopes.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">{labels.dataScopes.title}</h3>
          {Object.entries(scopesByEntity).map(([entityLabel, scopes]) => (
            <div key={entityLabel} className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">{entityLabel}</h4>
              <div className="space-y-1">
                {scopes.map((scope) => (
                  <div
                    key={scope.rule_id}
                    className="flex items-center justify-between rounded px-2 py-1 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span>{scope.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {labels.dataScopes.types[scope.type as keyof typeof labels.dataScopes.types] ?? scope.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={scopeSourceColors[scope.source]}>
                        {scopeSourceLabels[scope.source]}
                      </Badge>
                      {scope.role_name && (
                        <span className="text-xs text-muted-foreground">({scope.role_name})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
