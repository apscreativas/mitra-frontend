'use client'

import { use } from 'react'
import { RoleDetail } from '@/modules/roles/components/RoleDetail'

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <RoleDetail id={id} />
}
