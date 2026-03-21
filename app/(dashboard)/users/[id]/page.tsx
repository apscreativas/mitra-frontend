'use client'

import { use } from 'react'
import { UserDetail } from '@/modules/users/components/UserDetail'

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <UserDetail id={id} />
}
