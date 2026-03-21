import { RoleForm } from '@/modules/roles/components/RoleForm'
import { labels } from '@/lib/labels'

export default function NewRolePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">{labels.roles.create}</h1>
      <RoleForm mode="create" />
    </div>
  )
}
