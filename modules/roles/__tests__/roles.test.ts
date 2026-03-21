import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/setup'
import { createWrapper } from '@/test/providers'
import { useRoles, useRole, useCreateRole, usePermissionsList, useEffectiveAccess } from '../hooks'

const API = 'http://localhost/api'

const mockRole = {
  id: '1',
  name: 'Editor',
  description: null,
  is_system: false,
  users_count: 3,
  permissions_count: 5,
  permissions: ['posts.view'],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('Roles hooks', () => {
  describe('useRoles', () => {
    it('fetches paginated roles', async () => {
      server.use(
        http.get(`${API}/roles`, () =>
          HttpResponse.json({
            data: [mockRole],
            meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
          })
        )
      )
      const { result } = renderHook(() => useRoles(), { wrapper: createWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].name).toBe('Editor')
    })
  })

  describe('useRole', () => {
    it('fetches a single role', async () => {
      server.use(
        http.get(`${API}/roles/1`, () => HttpResponse.json({ data: mockRole }))
      )
      const { result } = renderHook(() => useRole('1'), { wrapper: createWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data.name).toBe('Editor')
    })
  })

  describe('useCreateRole', () => {
    it('creates a role', async () => {
      server.use(
        http.post(`${API}/roles`, () =>
          HttpResponse.json({ data: mockRole }, { status: 201 })
        )
      )
      const { result } = renderHook(() => useCreateRole(), { wrapper: createWrapper() })
      result.current.mutate({ name: 'Editor' })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('usePermissionsList', () => {
    it('fetches permissions grouped by module', async () => {
      server.use(
        http.get(`${API}/permissions`, () =>
          HttpResponse.json({
            data: {
              posts: [
                {
                  id: 1,
                  name: 'posts.view',
                  module: 'posts',
                  action: 'view',
                  label: 'View posts',
                  description: null,
                },
              ],
            },
          })
        )
      )
      const { result } = renderHook(() => usePermissionsList(), { wrapper: createWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data.posts).toHaveLength(1)
    })
  })

  describe('useEffectiveAccess', () => {
    it('fetches effective access for a user', async () => {
      server.use(
        http.get(`${API}/users/1/effective-access`, () =>
          HttpResponse.json({
            data: {
              permissions: [
                { name: 'posts.view', source: 'role', role_name: 'Editor', effective: true },
              ],
            },
          })
        )
      )
      const { result } = renderHook(() => useEffectiveAccess('1'), { wrapper: createWrapper() })
      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data.permissions).toHaveLength(1)
      expect(result.current.data?.data.permissions[0].source).toBe('role')
    })
  })
})
