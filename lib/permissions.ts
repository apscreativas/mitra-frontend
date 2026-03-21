import { useUser } from '@/lib/auth'

function matchesWildcard(userPermission: string, requiredPermission: string): boolean {
  if (userPermission === requiredPermission) return true

  // Support wildcard: "posts.*" matches "posts.view", "posts.create", etc.
  if (userPermission.endsWith('.*')) {
    const prefix = userPermission.slice(0, -1) // "posts."
    return requiredPermission.startsWith(prefix)
  }

  return false
}

export function usePermissions() {
  const { data: user } = useUser()

  const can = (permission: string): boolean =>
    user?.permissions?.some((p) => matchesWildcard(p, permission)) ?? false

  const canAny = (permissions: string[]): boolean =>
    permissions.some((p) => can(p))

  return { can, canAny }
}
