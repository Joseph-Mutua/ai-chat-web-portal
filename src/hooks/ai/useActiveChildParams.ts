import {
  NavigationState,
  Route,
  useNavigationState,
} from '@react-navigation/native'

import { usePathname } from 'expo-router'

/**
 * Recursively finds the currently active route (deepest child)
 */
function getActiveRoute(state?: NavigationState): Route<string> | undefined {
  if (!state) return undefined
  const route = state.routes[state.index ?? 0]
  // @ts-expect-error: route.state exists on nested navigators
  if (route?.state) return getActiveRoute(route.state)
  return route
}

/**
 * Hook to get the current active child screen's pathname and params
 * Works even in outer layout or tab components.
 */
export function useActiveChildParams() {
  const pathname = usePathname()
  const navState = useNavigationState((state) => state)

  const getCurrentPageInfo = (): {
    path: string
    params: string
  } => {
    const activeRoute = getActiveRoute(navState)
    const params = activeRoute?.params ?? {}

    return { path: pathname, params: JSON.stringify(params) }
  }

  return { getCurrentPageInfo }
}
