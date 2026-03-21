import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RoleList } from './RoleList'

const meta: Meta<typeof RoleList> = {
  title: 'Roles/RoleList',
  component: RoleList,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof RoleList>

export const Default: Story = {}
