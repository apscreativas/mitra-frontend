import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import type { Role } from '../types'

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Editor',
    description: 'Can create and edit content',
    is_system: false,
    users_count: 3,
    permissions_count: 5,
    permissions: ['posts.view', 'posts.create'],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'super-admin',
    description: 'Full system access',
    is_system: true,
    users_count: 1,
    permissions_count: 20,
    permissions: ['*'],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

const meta: Meta = {
  title: 'Roles/columns',
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <DataTable columns={columns} data={mockRoles} />,
}
