'use client'

import { use } from 'react'
import { useUser } from '@/modules/users/hooks'
import { UserForm } from '@/modules/users/components/UserForm'
import { LoadingState, ErrorState, NotFoundState } from '@/components/ui/states'
import { labels } from '@/lib/labels'

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, error, refetch } = useUser(id)

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!data) return <NotFoundState />

  const user = data.data

  return (
    <div className="container mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold">
        {labels.common.edit}: {user.name}
      </h1>
      <UserForm
        mode="edit"
        userId={id}
        defaultValues={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status,
        }}
      />
    </div>
  )
}
