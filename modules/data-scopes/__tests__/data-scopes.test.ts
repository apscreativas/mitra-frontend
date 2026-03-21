import { renderHook, waitFor, act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/setup'
import { createWrapper } from '@/test/providers'
import {
  useDataScopeRules,
  useDataScopeRule,
  useCreateDataScopeRule,
  useUpdateDataScopeRule,
  useDeleteDataScopeRule,
  useScopeableEntities,
  usePreviewDataScope,
} from '../hooks'

const API = 'http://localhost/api'

const mockRule = {
  id: '1',
  name: 'Solo propios',
  entity: 'App\\Models\\Order',
  entity_label: 'Pedido',
  type: 'own',
  configuration: { owner_column: 'created_by' },
  description: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const mockEntities = [
  { class: 'App\\Models\\Order', label: 'Pedido' },
  { class: 'App\\Models\\Sale', label: 'Venta' },
]

describe('Data Scopes hooks', () => {
  describe('useDataScopeRules', () => {
    it('fetches paginated data scope rules', async () => {
      server.use(
        http.get(`${API}/data-scope-rules`, () =>
          HttpResponse.json({
            data: [mockRule],
            meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
          })
        )
      )

      const { result } = renderHook(() => useDataScopeRules(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data).toHaveLength(1)
      expect(result.current.data?.data[0].name).toBe('Solo propios')
    })

    it('fetches rules filtered by entity', async () => {
      server.use(
        http.get(`${API}/data-scope-rules`, ({ request }) => {
          const url = new URL(request.url)
          const entity = url.searchParams.get('filter[entity]')
          if (entity === 'App\\Models\\Order') {
            return HttpResponse.json({
              data: [mockRule],
              meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
            })
          }
          return HttpResponse.json({
            data: [],
            meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 },
          })
        })
      )

      const { result } = renderHook(
        () => useDataScopeRules({ 'filter[entity]': 'App\\Models\\Order' }),
        { wrapper: createWrapper() }
      )

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data).toHaveLength(1)
    })
  })

  describe('useDataScopeRule', () => {
    it('fetches a single rule', async () => {
      server.use(
        http.get(`${API}/data-scope-rules/1`, () =>
          HttpResponse.json({ data: mockRule })
        )
      )

      const { result } = renderHook(() => useDataScopeRule('1'), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data.name).toBe('Solo propios')
      expect(result.current.data?.data.type).toBe('own')
    })

    it('does not fetch when id is empty', async () => {
      const { result } = renderHook(() => useDataScopeRule(''), { wrapper: createWrapper() })
      expect(result.current.fetchStatus).toBe('idle')
    })
  })

  describe('useCreateDataScopeRule', () => {
    it('creates a rule and invalidates the list', async () => {
      server.use(
        http.post(`${API}/data-scope-rules`, () =>
          HttpResponse.json({ data: mockRule }, { status: 201 })
        )
      )

      const { result } = renderHook(() => useCreateDataScopeRule(), { wrapper: createWrapper() })

      await act(async () => {
        result.current.mutate({
          name: 'Solo propios',
          entity: 'App\\Models\\Order',
          entity_label: 'Pedido',
          type: 'own',
          configuration: { owner_column: 'created_by' },
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useUpdateDataScopeRule', () => {
    it('updates a rule', async () => {
      server.use(
        http.put(`${API}/data-scope-rules/1`, () =>
          HttpResponse.json({ data: { ...mockRule, name: 'Actualizado' } })
        )
      )

      const { result } = renderHook(() => useUpdateDataScopeRule(), { wrapper: createWrapper() })

      await act(async () => {
        result.current.mutate({ id: '1', data: { name: 'Actualizado' } })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useDeleteDataScopeRule', () => {
    it('deletes a rule', async () => {
      server.use(
        http.delete(`${API}/data-scope-rules/1`, () =>
          new HttpResponse(null, { status: 204 })
        )
      )

      const { result } = renderHook(() => useDeleteDataScopeRule(), { wrapper: createWrapper() })

      await act(async () => {
        result.current.mutate('1')
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useScopeableEntities', () => {
    it('fetches scopeable entities', async () => {
      server.use(
        http.get(`${API}/scopeable-entities`, () =>
          HttpResponse.json({ data: mockEntities })
        )
      )

      const { result } = renderHook(() => useScopeableEntities(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data).toHaveLength(2)
      expect(result.current.data?.data[0].label).toBe('Pedido')
    })
  })

  describe('usePreviewDataScope', () => {
    it('previews a scope rule', async () => {
      server.use(
        http.post(`${API}/data-scope-rules/preview`, () =>
          HttpResponse.json({
            data: {
              count: 5,
              sample: [
                { id: 1, label: 'Pedido #001' },
                { id: 2, label: 'Pedido #002' },
              ],
            },
          })
        )
      )

      const { result } = renderHook(() => usePreviewDataScope(), { wrapper: createWrapper() })

      await act(async () => {
        result.current.mutate({
          entity: 'App\\Models\\Order',
          type: 'own',
          configuration: { owner_column: 'created_by' },
          user_id: '1',
        })
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
      expect(result.current.data?.data.count).toBe(5)
      expect(result.current.data?.data.sample).toHaveLength(2)
    })
  })
})
