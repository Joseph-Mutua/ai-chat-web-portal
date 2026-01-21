'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login, register, requestResetPassword } from '@/lib/api/auth'
import { setToken } from '@/lib/api/base'
import { storage } from '@/lib/utils/storage'
import type { LoginCredentials, RegisterCredentials } from '@/types'

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token)
      storage.setUser(data.user)
      queryClient.setQueryData(['user'], data.user)
      router.push('/chat')
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setToken(data.token)
      storage.setUser(data.user)
      queryClient.setQueryData(['user'], data.user)
      if (data.user.emailVerified) {
        router.push('/chat')
      } else {
        router.push('/register/verify')
      }
    },
  })
}

export function useRequestResetPassword() {
  return useMutation({
    mutationFn: requestResetPassword,
  })
}
