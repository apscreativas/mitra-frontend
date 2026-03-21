import { UserList } from '@/modules/users/components/UserList'
import { Button } from '@/components/ui/button'
import { Authorized } from '@/components/ui/authorized'
import { labels } from '@/lib/labels'
import Link from 'next/link'

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{labels.users.title}</h1>
        <Authorized permission="users.create">
          <Button nativeButton={false} render={<Link href="/users/new" />}>{labels.users.create}</Button>
        </Authorized>
      </div>
      <UserList />
    </div>
  )
}
