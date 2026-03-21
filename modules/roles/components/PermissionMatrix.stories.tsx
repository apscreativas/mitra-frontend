import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PermissionMatrix } from './PermissionMatrix'

const meta: Meta<typeof PermissionMatrix> = {
  title: 'Roles/PermissionMatrix',
  component: PermissionMatrix,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof PermissionMatrix>

export const Default: Story = {
  args: {
    selectedPermissionIds: [1],
    onToggle: () => {},
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    selectedPermissionIds: [1, 2],
    onToggle: () => {},
    disabled: true,
  },
}
