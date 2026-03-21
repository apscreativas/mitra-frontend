import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/setup'
import { createWrapper } from '@/test/providers'
import { useUsers, useUser, useCreateUser, useUpdateUser } from '../hooks'

const API = 'http://localhost/api'

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: null,
  status: 'active',
  avatar_url: null,
  last_login_at: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('Users hooks', () => {
  describe('useUsers', () => {
    it('fetches paginated users', async () => {
      server.use(
        http.get(`${API}/users`, () =>
          HttpResponse.json({
            data: [mockUser],
            meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
          })
        )
      )

      const { result } = renderHook(() => useUsers(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].name).toBe('John Doe')
    })
  })

  describe('useUser', () => {
    it('fetches a single user', async () => {
      server.use(
        http.get(`${API}/users/1`, () =>
          HttpResponse.json({ data: mockUser })
        )
      )

      const { result } = renderHook(() => useUser('1'), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data.email).toBe('john@example.com')
    })
  })

  describe('useCreateUser', () => {
    it('creates a user', async () => {
      server.use(
        http.post(`${API}/users`, () =>
          HttpResponse.json({ data: mockUser }, { status: 201 })
        )
      )

      const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() })

      result.current.mutate({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password1!',
        password_confirmation: 'Password1!',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useUpdateUser', () => {
    it('updates a user', async () => {
      server.use(
        http.put(`${API}/users/1`, () =>
          HttpResponse.json({ data: { ...mockUser, name: 'Updated' } })
        )
      )

      const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() })

      result.current.mutate({ id: '1', data: { name: 'Updated' } })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })
})
