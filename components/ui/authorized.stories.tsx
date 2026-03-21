import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Authorized } from './authorized'

function withUser(permissions: string[]) {
  return function Decorator(Story: React.ComponentType) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    queryClient.setQueryData(['user'], {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      permissions,
    })
    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  }
}

const meta: Meta<typeof Authorized> = {
  title: 'UI/Authorized',
  component: Authorized,
  args: {
    permission: 'orders.create',
    children: (
      <div className="rounded bg-green-100 p-4">Authorized content visible</div>
    ),
  },
}

export default meta
type Story = StoryObj<typeof Authorized>

export const Default: Story = {
  decorators: [withUser(['orders.create', 'orders.view'])],
}

export const Unauthorized: Story = {
  decorators: [withUser([])],
}

export const WithFallback: Story = {
  decorators: [withUser([])],
  args: {
    fallback: (
      <div className="rounded bg-red-100 p-4">
        No permission — fallback shown
      </div>
    ),
  },
}
