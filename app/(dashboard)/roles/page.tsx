import { RoleList } from '@/modules/roles/components/RoleList'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import Link from 'next/link'

export default function RolesPage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{labels.roles.title}</h1>
        <Authorized permission="roles.create">
          <Button nativeButton={false} render={<Link href="/roles/new" />}>{labels.roles.create}</Button>
        </Authorized>
      </div>
      <RoleList />
    </div>
  )
}
