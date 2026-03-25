import { env } from '@/config/env'
import { tokenStorage } from '@/lib/token-storage'

// --- Error types ---

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>
  code?: string

  constructor(status: number, message: string, errors?: Record<string, string[]>, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
    this.code = code
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error') {
    super(message)
    this.name = 'NetworkError'
  }
}

// --- Core request function ---

type RequestOptions = {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

async function request<T>(
  method: string,
  url: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  const fullUrl = new URL(`${env.NEXT_PUBLIC_API_URL}${url}`)

  if (options?.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        fullUrl.searchParams.set(key, String(value))
      }
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options?.headers,
  }

  const token = tokenStorage.get()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (data && !(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  let response: Response

  try {
    response = await fetch(fullUrl.toString(), {
      method,
      headers,
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    })
  } catch {
    throw new NetworkError()
  }

  if (!response.ok) {
    // Clear token on 401 — it's invalid or expired
    if (response.status === 401) {
      tokenStorage.clear()
    }

    const body = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      body.message ?? body.error?.message ?? `Request failed with status ${response.status}`,
      body.errors,
      body.error?.code
    )
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// --- Public API ---

export const httpClient = {
  get: <T>(url: string, options?: RequestOptions) => request<T>('GET', url, undefined, options),
  post: <T>(url: string, data?: unknown, options?: RequestOptions) => request<T>('POST', url, data, options),
  put: <T>(url: string, data?: unknown, options?: RequestOptions) => request<T>('PUT', url, data, options),
  patch: <T>(url: string, data?: unknown, options?: RequestOptions) => request<T>('PATCH', url, data, options),
  delete: <T>(url: string, options?: RequestOptions) => request<T>('DELETE', url, undefined, options),
}
