import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ResetPasswordForm } from './ResetPasswordForm'

const meta: Meta<typeof ResetPasswordForm> = {
  title: 'Auth/ResetPasswordForm',
  component: ResetPasswordForm,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof ResetPasswordForm>

export const Default: Story = {}
