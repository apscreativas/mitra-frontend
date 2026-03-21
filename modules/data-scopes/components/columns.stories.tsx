import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import type { DataScopeRule } from '../types'

const mockRules: DataScopeRule[] = [
  {
    id: '1',
    name: 'Solo propios',
    entity: 'App\\Models\\Order',
    entity_label: 'Pedido',
    type: 'own',
    configuration: { owner_column: 'created_by' },
    description: 'El usuario solo ve sus pedidos',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Acceso total ventas',
    entity: 'App\\Models\\Sale',
    entity_label: 'Venta',
    type: 'all',
    configuration: {},
    description: null,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
]

const meta: Meta = {
  title: 'DataScopes/columns',
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <DataTable columns={columns} data={mockRules} />,
}
