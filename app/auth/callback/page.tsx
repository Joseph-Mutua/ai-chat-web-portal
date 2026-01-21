'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { socialSignIn } from '@/lib/api/auth'
import { setToken } from '@/lib/api/base'
import { storage } from '@/lib/utils/storage'
import { Loading } from '@/components/ui/loading'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuth = async () => {
      const provider = searchParams.get('provider') as 'google' | 'apple' | 'facebook' | null
      const accessToken = searchParams.get('accessToken')
      const isRegistration = searchParams.get('isRegistration')

      // If we have a token from callback, use it
      if (accessToken) {
        try {
          const token = accessToken.split('#_=_')[0]
          setToken(token)
          storage.setToken(token)

          // TODO: Fetch user data and store it
          // For now, redirect to chat
          router.push('/chat')
        } catch (err) {
          setError('Failed to complete authentication')
        }
        return
      }

      // Otherwise, initiate OAuth flow
      if (provider) {
        try {
          const { authUrl } = await socialSignIn(provider)
          window.location.href = authUrl
        } catch (err) {
          setError('Failed to initiate authentication')
        }
      } else {
        setError('No provider specified')
      }
    }

    handleOAuth()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-error mb-2">Authentication Error</h1>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loading size="lg" />
        <p className="mt-4 text-text-secondary">Completing authentication...</p>
      </div>
    </div>
  )
}
