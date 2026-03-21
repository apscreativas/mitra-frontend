import { httpClient } from '@/lib/http-client'
import type {
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from './types'

export async function login(data: LoginInput) {
  return httpClient.post('/login', data)
}

export async function forgotPassword(data: ForgotPasswordInput) {
  return httpClient.post('/forgot-password', data)
}

export async function resetPassword(data: ResetPasswordInput) {
  return httpClient.post('/reset-password', data)
}

export async function changePassword(data: ChangePasswordInput) {
  return httpClient.put('/user/password', data)
}
