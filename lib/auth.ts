import { useState, useEffect } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'
import { tokenStorage } from '@/lib/token-storage'

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  avatar_url: string | null
  permissions: string[]
  roles: string[]
}

export const userKeys = {
  current: ['user'] as const,
}

/**
 * Track whether we're on the client and have a token.
 * Returns `undefined` during SSR/hydration, then the real value after mount.
 * This prevents hydration mismatch from localStorage access.
 */
function useHasToken() {
  const [hasToken, setHasToken] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    setHasToken(!!tokenStorage.get())
  }, [])

  return hasToken
}

export function useUser() {
  const hasToken = useHasToken()

  return useQuery({
    queryKey: userKeys.current,
    queryFn: () => httpClient.get<{ data: User }>('/user').then((res) => res.data),
    retry: false,
    enabled: hasToken === true,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => httpClient.post('/logout'),
    onSettled: () => {
      tokenStorage.clear()
      queryClient.clear()
      window.location.href = '/login'
    },
  })
}
