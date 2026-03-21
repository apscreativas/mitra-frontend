import { httpClient } from '@/lib/http-client'
import type { PaginatedResponse } from '@/lib/types'
import type {
  Role,
  PermissionsGrouped,
  RoleListParams,
  CreateRoleInput,
  UpdateRoleInput,
  UserPermissionEntry,
  EffectiveAccess,
} from './types'

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: RoleListParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
}

export const permissionKeys = {
  all: ['permissions'] as const,
}

export const effectiveAccessKeys = {
  user: (userId: string) => ['effective-access', userId] as const,
}

export async function getRoles(params?: RoleListParams): Promise<PaginatedResponse<Role>> {
  return httpClient.get('/roles', { params: params as Record<string, unknown> })
}

export async function getRole(id: string): Promise<{ data: Role }> {
  return httpClient.get(`/roles/${id}`)
}

export async function createRole(data: CreateRoleInput): Promise<{ data: Role }> {
  return httpClient.post('/roles', data)
}

export async function updateRole(id: string, data: UpdateRoleInput): Promise<{ data: Role }> {
  return httpClient.put(`/roles/${id}`, data)
}

export async function deleteRole(id: string): Promise<void> {
  return httpClient.delete(`/roles/${id}`)
}

export async function duplicateRole(id: string, name: string): Promise<{ data: Role }> {
  return httpClient.post(`/roles/${id}/duplicate`, { name })
}

export async function syncRolePermissions(
  roleId: string,
  permissions: number[]
): Promise<{ data: Role }> {
  return httpClient.put(`/roles/${roleId}/permissions`, { permissions })
}

export async function getPermissions(): Promise<{ data: PermissionsGrouped }> {
  return httpClient.get('/permissions')
}

export async function syncUserDirectPermissions(
  userId: string,
  permissions: UserPermissionEntry[]
): Promise<void> {
  return httpClient.put(`/users/${userId}/permissions`, { permissions })
}

export async function getEffectiveAccess(userId: string): Promise<{ data: EffectiveAccess }> {
  return httpClient.get(`/users/${userId}/effective-access`)
}
