import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UserForm } from './UserForm'

const meta: Meta<typeof UserForm> = {
  title: 'Users/UserForm',
  component: UserForm,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof UserForm>

export const Create: Story = {
  args: { mode: 'create' },
}

export const Edit: Story = {
  args: {
    mode: 'edit',
    userId: '1',
    defaultValues: { name: 'John Doe', email: 'john@example.com', phone: '+1234', status: 'active' },
  },
}
