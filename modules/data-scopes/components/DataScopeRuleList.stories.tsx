import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DataScopeRuleList } from './DataScopeRuleList'

const meta: Meta<typeof DataScopeRuleList> = {
  title: 'DataScopes/DataScopeRuleList',
  component: DataScopeRuleList,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof DataScopeRuleList>

export const Default: Story = {}
