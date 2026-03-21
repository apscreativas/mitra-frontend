import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EffectiveAccessViewer } from './EffectiveAccessViewer'

const meta: Meta<typeof EffectiveAccessViewer> = {
  title: 'Roles/EffectiveAccessViewer',
  component: EffectiveAccessViewer,
  parameters: { nextjs: { appDirectory: true } },
}

export default meta
type Story = StoryObj<typeof EffectiveAccessViewer>

export const Default: Story = {
  args: {
    userId: '1',
  },
}
