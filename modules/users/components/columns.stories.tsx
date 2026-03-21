import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import type { User } from '../types'

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234',
    status: 'active',
    avatar_url: null,
    last_login_at: '2026-01-01T00:00:00Z',
    roles: [{ id: 1, name: 'admin' }],
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

const meta: Meta = {
  title: 'Users/Columns',
  component: DataTable,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    columns,
    data: mockUsers,
  },
}
