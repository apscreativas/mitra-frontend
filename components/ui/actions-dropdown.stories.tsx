import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ActionsDropdown } from './actions-dropdown'

const meta: Meta<typeof ActionsDropdown> = {
  title: 'UI/ActionsDropdown',
  component: ActionsDropdown,
}
export default meta
type Story = StoryObj<typeof ActionsDropdown>

export const Default: Story = {
  args: {
    viewHref: '/products/1',
    editHref: '/products/1/edit',
  },
}

export const ViewOnly: Story = {
  args: {
    viewHref: '/products/1',
  },
}

export const WithPermissions: Story = {
  args: {
    viewHref: '/products/1',
    editHref: '/products/1/edit',
    viewPermission: 'catalog.view',
    editPermission: 'catalog.update',
  },
}
