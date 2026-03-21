import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScopeRulePreview } from './ScopeRulePreview'

const meta: Meta<typeof ScopeRulePreview> = {
  title: 'DataScopes/ScopeRulePreview',
  component: ScopeRulePreview,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof ScopeRulePreview>

export const Default: Story = {
  args: {
    entity: 'App\\Models\\Order',
    type: 'own',
    configuration: { owner_column: 'created_by' },
  },
}

export const Empty: Story = {
  args: {
    entity: '',
    type: '',
    configuration: {},
  },
}
