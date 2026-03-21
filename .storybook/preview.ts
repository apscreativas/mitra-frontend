import type { Preview } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import '../app/globals.css'

const preview: Preview = {
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })
      return createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(Story),
      )
    },
  ],
  parameters: {
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
