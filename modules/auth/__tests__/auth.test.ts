import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/setup'
import { createWrapper } from '@/test/providers'
import { useLogin, useForgotPassword, useResetPassword, useChangePassword } from '../hooks'

const API = 'http://localhost/api'

describe('Auth hooks', () => {
  describe('useLogin', () => {
    it('calls login endpoint', async () => {
      server.use(
        http.post(`${API}/login`, () =>
          HttpResponse.json({ data: { id: '1', name: 'Test', email: 'test@test.com' } })
        )
      )

      const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

      result.current.mutate({ email: 'test@test.com', password: 'password' })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useForgotPassword', () => {
    it('calls forgot-password endpoint', async () => {
      server.use(
        http.post(`${API}/forgot-password`, () =>
          HttpResponse.json({ message: 'Sent' })
        )
      )

      const { result } = renderHook(() => useForgotPassword(), { wrapper: createWrapper() })

      result.current.mutate({ email: 'test@test.com' })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useResetPassword', () => {
    it('calls reset-password endpoint', async () => {
      server.use(
        http.post(`${API}/reset-password`, () =>
          HttpResponse.json({ message: 'Reset' })
        )
      )

      const { result } = renderHook(() => useResetPassword(), { wrapper: createWrapper() })

      result.current.mutate({
        token: 'token123',
        email: 'test@test.com',
        password: 'New1!pass',
        password_confirmation: 'New1!pass',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })

  describe('useChangePassword', () => {
    it('calls change-password endpoint', async () => {
      server.use(
        http.put(`${API}/user/password`, () =>
          HttpResponse.json({ message: 'Changed' })
        )
      )

      const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() })

      result.current.mutate({
        current_password: 'Old1!',
        password: 'New1!',
        password_confirmation: 'New1!',
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))
    })
  })
})
