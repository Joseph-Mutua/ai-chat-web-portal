import { type AxiosError } from 'axios'

import { useEffect, useState } from 'react'

import { Redirect, Stack } from 'expo-router'

import { ErrorContainer } from '@/components/page/ErrorContainer'
import { LoadingContainer } from '@/components/page/LoadingContainer'

import {
  getIsRegistrationFromStorage,
  getTokenFromStorage,
  removeIsRegistrationFromStorage,
} from '@/utils/storage'

import { CollapsibleHeaderProvider } from '@/contexts/collapsible-header-provider'
import { NetworkProvider } from '@/providers/network-provider'
import { setToken } from '@/services/api'
import { useUser } from '@/hooks/api'

export default function AppLayout() {
  const [tokenLoaded, setTokenLoaded] = useState(false)

  const user = useUser({
    retry: false,
    enabled: tokenLoaded,
  })

  const loadToken = async () => {
    const token = await getTokenFromStorage()
    const isRegistration = await getIsRegistrationFromStorage()
    if (isRegistration) {
      await removeIsRegistrationFromStorage()
    }

    if (token) {
      setToken(token)
    }
    setTokenLoaded(true)
  }

  useEffect(() => {
    void loadToken()
  }, [])

  if (!tokenLoaded || user.isLoading) {
    return <LoadingContainer size={100} />
  }

  if (user.isError && (user.error as AxiosError).status !== 401) {
    return (
      <ErrorContainer
        handleRetry={() => {
          user.refetch()
        }}
      />
    )
  }

  if (user.isError && (user.error as AxiosError).status === 401) {
    return <Redirect href="/login" />
  }

  if (!user || !user.data) {
    return <Redirect href="/login" />
  }

  if (!user.data.emailVerified) {
    return <Redirect href="/register/verify" />
  }

  return (
    <NetworkProvider>
      <CollapsibleHeaderProvider>
        <Stack>
          <Stack.Screen
            name="(drawer)"
            options={{ headerShown: false }}
          />
        </Stack>
      </CollapsibleHeaderProvider>
    </NetworkProvider>
  )
}
