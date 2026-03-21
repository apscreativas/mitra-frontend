import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LoadingState, EmptyState, ErrorState, NotFoundState } from './states'

const meta: Meta = {
  title: 'UI/States',
}
export default meta

export const Loading: StoryObj = {
  render: () => <LoadingState />,
}

export const Empty: StoryObj = {
  render: () => <EmptyState />,
}

export const EmptyWithMessage: StoryObj = {
  render: () => <EmptyState message="No hay productos registrados" />,
}

export const ErrorDefault: StoryObj = {
  render: () => <ErrorState />,
}

export const ErrorWithRetry: StoryObj = {
  render: () => <ErrorState error={new Error('Failed to fetch')} onRetry={() => alert('retry')} />,
}

export const NotFound: StoryObj = {
  render: () => <NotFoundState />,
}
