import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChangePasswordForm } from './ChangePasswordForm'

const meta: Meta<typeof ChangePasswordForm> = {
  title: 'Auth/ChangePasswordForm',
  component: ChangePasswordForm,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof ChangePasswordForm>

export const Default: Story = {}
