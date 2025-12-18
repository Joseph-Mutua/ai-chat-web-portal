import { useNetInfo } from '@react-native-community/netinfo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useEffect } from 'react'
import { Text, TextInput } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useFonts } from 'expo-font'
import { RelativePathString, Stack, usePathname, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'

import { Theme } from '@/constants/Colors'

import { initializeRemoteConfig } from '@/utils/firebase-remote-config'

import { BugsnagErrorBoundary } from '@/services/bugsnag'


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

const RootView = () => {
  const router = useRouter()

  const netInfo = useNetInfo()

  useEffect(() => {
    configureReanimatedLogger({
      level: ReanimatedLogLevel.warn,
      strict: false,
    })

    if (netInfo?.isConnected === false) {
      router.replace('/offline' as RelativePathString)
    }
  }, [netInfo?.isConnected, router])

  return (
    <Stack
      screenOptions={{ headerStyle: { backgroundColor: Theme.brand.black } }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="register/one" options={{ headerShown: false }} />
      <Stack.Screen name="register/verify" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="offline" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}

export default function RootLayout() {
  const pathname = usePathname()

  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter-VariableFont.ttf'),
  })

  // Initialize notifications and background message handler
  useEffect(() => {
    initializeRemoteConfig()
  }, [])


  const TextWithAny = Text as any
  const TextInputWithAny = TextInput as any
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }

    if (TextWithAny.defaultProps == null) TextWithAny.defaultProps = {}
    TextWithAny.defaultProps.maxFontSizeMultiplier = 1.2

    if (TextInputWithAny.defaultProps == null)
      TextInputWithAny.defaultProps = {}
    TextInputWithAny.defaultProps.maxFontSizeMultiplier = 1.2
  }, [loaded])

  useEffect(() => {
    console.log('pathname', pathname)
  }, [pathname])

  return (
    <BugsnagErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <RootView />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </BugsnagErrorBoundary>
  )
}
