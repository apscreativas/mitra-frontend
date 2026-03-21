import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { httpClient } from '@/lib/http-client'

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

export function useUser() {
  return useQuery({
    queryKey: userKeys.current,
    queryFn: () => httpClient.get<{ data: User }>('/user').then((res) => res.data),
    retry: false,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => httpClient.post('/logout'),
    onSuccess: () => {
      queryClient.clear()
      window.location.href = '/login'
    },
  })
}
