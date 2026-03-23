import { httpClient } from '@/lib/http-client'
import type { RrhhStats } from '../types'

export const rrhhStatsKeys = {
  all: ['rrhh', 'stats'] as const,
  detail: () => [...rrhhStatsKeys.all, 'detail'] as const,
}

export async function getRrhhStats(): Promise<{ data: RrhhStats }> {
  return httpClient.get('/api/rrhh/stats')
}
