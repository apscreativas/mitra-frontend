import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UserList } from './UserList'

const meta: Meta<typeof UserList> = {
  title: 'Users/UserList',
  component: UserList,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof UserList>

export const Default: Story = {}
