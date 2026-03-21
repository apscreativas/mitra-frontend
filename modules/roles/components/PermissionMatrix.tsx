'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { LoadingState } from '@/components/ui/states'
import { usePermissionsList } from '../hooks'
import type { Permission } from '../types'

interface PermissionMatrixProps {
  selectedPermissionIds: number[]
  onToggle: (permissionId: number, checked: boolean) => void
  disabled?: boolean
}

export function PermissionMatrix({
  selectedPermissionIds,
  onToggle,
  disabled,
}: PermissionMatrixProps) {
  const { data, isLoading } = usePermissionsList()

  if (isLoading) return <LoadingState />
  if (!data) return null

  const grouped = data.data

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([module, permissions]) => (
        <div key={module} className="rounded-lg border p-4">
          <h3 className="mb-3 font-semibold capitalize">{module}</h3>
          <div className="grid gap-2">
            {(permissions as Permission[]).map((permission) => (
              <label
                key={permission.id}
                className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedPermissionIds.includes(permission.id)}
                  onCheckedChange={(checked) => onToggle(permission.id, !!checked)}
                  disabled={disabled}
                />
                <div>
                  <span className="text-sm font-medium">{permission.label}</span>
                  {permission.description && (
                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
