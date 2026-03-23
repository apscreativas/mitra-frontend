import { useQuery } from '@tanstack/react-query'
import { rrhhStatsKeys, getRrhhStats } from '../api/stats'

export function useRrhhStats() {
  return useQuery({
    queryKey: rrhhStatsKeys.detail(),
    queryFn: getRrhhStats,
  })
}
