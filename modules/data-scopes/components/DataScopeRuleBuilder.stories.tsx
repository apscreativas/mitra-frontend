import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DataScopeRuleBuilder } from './DataScopeRuleBuilder'

const meta: Meta<typeof DataScopeRuleBuilder> = {
  title: 'DataScopes/DataScopeRuleBuilder',
  component: DataScopeRuleBuilder,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof DataScopeRuleBuilder>

export const Create: Story = {
  args: { mode: 'create' },
}

export const Edit: Story = {
  args: {
    mode: 'edit',
    ruleId: '1',
    defaultValues: {
      name: 'Solo propios',
      entity: 'App\\Models\\Order',
      entity_label: 'Pedido',
      type: 'own',
      configuration: { owner_column: 'created_by' },
      description: 'El usuario solo ve sus pedidos',
    },
  },
}
