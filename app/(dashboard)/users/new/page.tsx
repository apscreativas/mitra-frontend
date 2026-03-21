import { UserForm } from '@/modules/users/components/UserForm'
import { labels } from '@/lib/labels'

export default function NewUserPage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold">{labels.users.create}</h1>
      <UserForm mode="create" />
    </div>
  )
}
