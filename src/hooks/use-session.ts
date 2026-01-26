'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUser, logout as logoutApi } from '@/lib/api/auth'
import { storage } from '@/lib/utils/storage'
import { clearToken } from '@/lib/api/base'
import type { User } from '@/types'

export function useSession() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(true)
  const [hasToken, setHasToken] = useState(false)

  // Check for token on mount (client-side only)
  useEffect(() => {
    setHasToken(!!storage.getToken())
  }, [])

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    setIsLoading(userLoading)
  }, [userLoading])

  // Update hasToken when user changes
  useEffect(() => {
    if (user) {
      setHasToken(true)
    }
  }, [user])

  const handleLogout = () => {
    queryClient.removeQueries()
    queryClient.clear()
    clearToken()
    setHasToken(false)
    queryClient.invalidateQueries({ queryKey: ['user'] })
    queryClient.cancelQueries({ queryKey: ['user'] })
    
    logoutApi().catch(() => {
      // Ignore API errors - we're logging out locally anyway
    })
    
    if (typeof window !== 'undefined') {
      window.location.replace('/login')
    } else {
      router.replace('/login')
    }
  }

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated: !!user && hasToken,
    logout: handleLogout,
  }
}
