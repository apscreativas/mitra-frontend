'use client'

import {
  FormDrawer,
  FormDrawerContent,
  FormDrawerHeader,
  FormDrawerTitle,
} from '@/components/ui/form-drawer'
import { LoadingState } from '@/components/ui/states'
import { labels } from '@/lib/labels'
import { useUser } from '../hooks'
import { UserForm } from './UserForm'

interface UserFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  userId?: string
}

export function UserFormDrawer({ open, onOpenChange, mode, userId }: UserFormDrawerProps) {
  const isEdit = mode === 'edit'
  const { data, isLoading } = useUser(userId ?? '', { enabled: isEdit && !!userId && open })
  const user = data?.data

  const title = isEdit
    ? `${labels.common.edit}: ${user?.name ?? ''}`
    : labels.users.create

  function handleSuccess() {
    onOpenChange(false)
  }

  return (
    <FormDrawer key={`${mode}-${userId}`} open={open} onOpenChange={onOpenChange}>
      <FormDrawerContent>
        <FormDrawerHeader>
          <FormDrawerTitle>{title}</FormDrawerTitle>
        </FormDrawerHeader>
        {isEdit && isLoading ? (
          <LoadingState />
        ) : (
          <UserForm
            mode={mode}
            userId={userId}
            defaultValues={
              isEdit && user
                ? {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    status: user.status,
                  }
                : undefined
            }
            onSuccess={handleSuccess}
          />
        )}
      </FormDrawerContent>
    </FormDrawer>
  )
}
