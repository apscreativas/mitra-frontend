'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useUser, useSyncUserRoles } from '@/modules/users/hooks'
import { useRoles } from '@/modules/roles/hooks'
import { useDataScopeRules, useUserDataScopes, useSyncUserDataScopes } from '@/modules/data-scopes/hooks'
import { LoadingState, ErrorState, NotFoundState } from '@/components/ui/states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import Link from 'next/link'

interface UserDetailProps {
  id: string
}

export function UserDetail({ id }: UserDetailProps) {
  const { data, isLoading, error, refetch } = useUser(id)
  const { data: rolesData } = useRoles({ per_page: 100 })
  const syncRoles = useSyncUserRoles()
  const { data: allScopeRulesData } = useDataScopeRules({ per_page: 100 })
  const { data: assignedScopeData } = useUserDataScopes(id)
  const syncDataScopes = useSyncUserDataScopes()

  const user = data?.data
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)
  const [scopesInitialized, setScopesInitialized] = useState(false)

  useEffect(() => {
    if (user && !initialized) {
      setSelectedRoleIds(user.roles.map((r) => r.id))
      setInitialized(true)
    }
  }, [user, initialized])

  useEffect(() => {
    if (assignedScopeData && !scopesInitialized) {
      setSelectedScopeIds(assignedScopeData.data.map(String))
      setScopesInitialized(true)
    }
  }, [assignedScopeData, scopesInitialized])

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data || !user) return <NotFoundState />

  function handleRoleToggle(roleId: number, checked: boolean) {
    setSelectedRoleIds((prev) =>
      checked ? [...prev, roleId] : prev.filter((r) => r !== roleId)
    )
  }

  async function handleSaveRoles() {
    try {
      await syncRoles.mutateAsync({ userId: id, roles: selectedRoleIds })
      toast.success(labels.users.rolesUpdated)
      refetch()
    } catch {
      toast.error(labels.common.error)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <Authorized permission="users.update">
          <Button variant="outline" nativeButton={false} render={<Link href={`/users/${id}/edit`} />}>
            {labels.common.edit}
          </Button>
        </Authorized>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4 space-y-2">
          <p>
            <span className="text-muted-foreground">{labels.users.fields.email}:</span> {user.email}
          </p>
          <p>
            <span className="text-muted-foreground">{labels.users.fields.phone}:</span>{' '}
            {user.phone ?? '—'}
          </p>
          <p>
            <span className="text-muted-foreground">{labels.users.fields.status}:</span>{' '}
            <Badge>
              {labels.users.statuses[user.status as keyof typeof labels.users.statuses]}
            </Badge>
          </p>
          <p>
            <span className="text-muted-foreground">{labels.users.lastLogin}:</span>{' '}
            {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : '—'}
          </p>
          <p>
            <span className="text-muted-foreground">{labels.common.createdAt}:</span>{' '}
            {new Date(user.created_at).toLocaleString()}
          </p>
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <h3 className="font-semibold">{labels.users.roles}</h3>
          {user.roles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <Badge key={role.id} variant="secondary">{role.name}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </div>
      </div>

      <Authorized permission="users.manage_roles">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{labels.users.roles}</h2>
          <div className="rounded-lg border p-4 space-y-2">
            {rolesData?.data.map((role) => (
              <label
                key={role.id}
                className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedRoleIds.includes(Number(role.id))}
                  onCheckedChange={(checked) => handleRoleToggle(Number(role.id), !!checked)}
                  disabled={syncRoles.isPending}
                />
                <div>
                  <span className="text-sm font-medium">{role.name}</span>
                  {role.description && (
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
          <Button onClick={handleSaveRoles} disabled={syncRoles.isPending}>
            {syncRoles.isPending ? labels.common.loading : labels.common.save}
          </Button>
        </div>
      </Authorized>

      <Authorized permission="users.update">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{labels.dataScopes.title}</h2>
          <div className="rounded-lg border p-4 space-y-2">
            {allScopeRulesData?.data.map((rule) => (
              <label
                key={rule.id}
                className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedScopeIds.includes(rule.id)}
                  onCheckedChange={(checked) =>
                    setSelectedScopeIds((prev) =>
                      checked ? [...prev, rule.id] : prev.filter((s) => s !== rule.id)
                    )
                  }
                  disabled={syncDataScopes.isPending}
                />
                <div>
                  <span className="text-sm font-medium">{rule.name}</span>
                  <p className="text-xs text-muted-foreground">
                    {rule.entity_label} — {labels.dataScopes.types[rule.type]}
                  </p>
                </div>
              </label>
            ))}
            {!allScopeRulesData?.data.length && (
              <p className="text-sm text-muted-foreground">{labels.dataScopes.empty}</p>
            )}
          </div>
          <Button
            onClick={async () => {
              try {
                await syncDataScopes.mutateAsync({ userId: id, ids: selectedScopeIds })
                toast.success(labels.dataScopes.rulesSynced)
              } catch {
                toast.error(labels.common.error)
              }
            }}
            disabled={syncDataScopes.isPending}
          >
            {syncDataScopes.isPending ? labels.common.loading : labels.common.save}
          </Button>
        </div>
      </Authorized>
    </div>
  )
}
