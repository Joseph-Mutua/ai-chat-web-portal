import { apiClient } from './base'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  SocialSignInResponse,
  User,
  OAuthProvider,
} from '@/types'

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
  return data
}

export async function register(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials)
  return data
}

export async function getUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/user')
  return data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function socialSignIn(
  provider: OAuthProvider
): Promise<SocialSignInResponse> {
  const { data } = await apiClient.get<SocialSignInResponse>(
    `/auth/user/${provider}`
  )
  return data
}

export async function requestResetPassword(email: string): Promise<void> {
  await apiClient.post('/auth/request-reset-password', { email })
}

export async function resetPassword(params: {
  id: string
  newPassword: string
  confirmNewPassword: string
}): Promise<void> {
  await apiClient.put('/auth/reset-password', params)
}

export async function resendVerifyEmail(email?: string): Promise<void> {
  await apiClient.post('/auth/resend-verify-email', email ? { email } : {})
}

export async function verifyEmail(id: string): Promise<void> {
  await apiClient.put('/auth/verify-email', { id })
}
