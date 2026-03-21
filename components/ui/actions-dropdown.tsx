'use client'

import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePermissions } from '@/lib/permissions'
import { labels } from '@/lib/labels'

interface ActionsDropdownProps {
  viewHref?: string
  editHref?: string
  viewPermission?: string
  editPermission?: string
}

export function ActionsDropdown({
  viewHref,
  editHref,
  viewPermission,
  editPermission,
}: ActionsDropdownProps) {
  const { can } = usePermissions()

  const showView = viewHref && (!viewPermission || can(viewPermission))
  const showEdit = editHref && (!editPermission || can(editPermission))

  if (!showView && !showEdit) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{labels.common.actions}</span>
          </Button>
        }
      />
      <DropdownMenuContent>
        {showView && (
          <DropdownMenuItem render={<Link href={viewHref!} />}>
            {labels.common.view}
          </DropdownMenuItem>
        )}
        {showEdit && (
          <DropdownMenuItem render={<Link href={editHref!} />}>
            {labels.common.edit}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
