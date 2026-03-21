import { httpClient } from '@/lib/http-client'
import type { PaginatedResponse } from '@/lib/types'
import type {
  DataScopeRule,
  ScopeableEntity,
  ScopePreviewResult,
  DataScopeRuleListParams,
  CreateDataScopeRuleInput,
  UpdateDataScopeRuleInput,
  DataScopeRulePreviewInput,
} from './types'

export const dataScopeRuleKeys = {
  all: ['data-scope-rules'] as const,
  lists: () => [...dataScopeRuleKeys.all, 'list'] as const,
  list: (params?: DataScopeRuleListParams) => [...dataScopeRuleKeys.lists(), params] as const,
  details: () => [...dataScopeRuleKeys.all, 'detail'] as const,
  detail: (id: string) => [...dataScopeRuleKeys.details(), id] as const,
}

export const scopeableEntityKeys = {
  all: ['scopeable-entities'] as const,
}

export async function getDataScopeRules(
  params?: DataScopeRuleListParams
): Promise<PaginatedResponse<DataScopeRule>> {
  return httpClient.get('/data-scope-rules', { params: params as Record<string, unknown> })
}

export async function getDataScopeRule(id: string): Promise<{ data: DataScopeRule }> {
  return httpClient.get(`/data-scope-rules/${id}`)
}

export async function createDataScopeRule(
  data: CreateDataScopeRuleInput
): Promise<{ data: DataScopeRule }> {
  return httpClient.post('/data-scope-rules', data)
}

export async function updateDataScopeRule(
  id: string,
  data: UpdateDataScopeRuleInput
): Promise<{ data: DataScopeRule }> {
  return httpClient.put(`/data-scope-rules/${id}`, data)
}

export async function deleteDataScopeRule(id: string): Promise<void> {
  return httpClient.delete(`/data-scope-rules/${id}`)
}

export async function previewDataScopeRule(
  input: DataScopeRulePreviewInput
): Promise<{ data: ScopePreviewResult }> {
  return httpClient.post('/data-scope-rules/preview', input)
}

export async function getScopeableEntities(): Promise<{ data: ScopeableEntity[] }> {
  return httpClient.get('/scopeable-entities')
}

export const roleDataScopeKeys = {
  assigned: (roleId: string) => ['role-data-scopes', roleId] as const,
}

export const userDataScopeKeys = {
  assigned: (userId: string) => ['user-data-scopes', userId] as const,
}

export async function getRoleDataScopes(roleId: string): Promise<{ data: number[] }> {
  return httpClient.get(`/roles/${roleId}/data-scope-rules`)
}

export async function getUserDataScopes(userId: string): Promise<{ data: number[] }> {
  return httpClient.get(`/users/${userId}/data-scope-rules`)
}

export async function syncRoleDataScopes(
  roleId: string,
  data_scope_rule_ids: string[]
): Promise<void> {
  return httpClient.put(`/roles/${roleId}/data-scope-rules`, { data_scope_rule_ids })
}

export async function syncUserDataScopes(
  userId: string,
  data_scope_rule_ids: string[]
): Promise<void> {
  return httpClient.put(`/users/${userId}/data-scope-rules`, { data_scope_rule_ids })
}
