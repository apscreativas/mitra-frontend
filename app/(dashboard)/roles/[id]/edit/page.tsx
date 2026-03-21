'use client'

import { use } from 'react'
import { useRole } from '@/modules/roles/hooks'
import { RoleForm } from '@/modules/roles/components/RoleForm'
import { LoadingState, ErrorState, NotFoundState } from '@/components/ui/states'
import { labels } from '@/lib/labels'

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, error, refetch } = useRole(id)

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data) return <NotFoundState />

  const role = data.data

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {labels.common.edit} — {role.name}
      </h1>
      <RoleForm
        mode="edit"
        roleId={id}
        defaultValues={{ name: role.name, description: role.description ?? '' }}
      />
    </div>
  )
}
