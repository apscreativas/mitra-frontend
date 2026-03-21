import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const meta: Meta<typeof ForgotPasswordForm> = {
  title: 'Auth/ForgotPasswordForm',
  component: ForgotPasswordForm,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof ForgotPasswordForm>

export const Default: Story = {}
