import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RoleForm } from './RoleForm'

const meta: Meta<typeof RoleForm> = {
  title: 'Roles/RoleForm',
  component: RoleForm,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof RoleForm>

export const Create: Story = {
  args: { mode: 'create' },
}

export const Edit: Story = {
  args: {
    mode: 'edit',
    roleId: '1',
    defaultValues: { name: 'Editor', description: 'Can create and edit content' },
  },
}
