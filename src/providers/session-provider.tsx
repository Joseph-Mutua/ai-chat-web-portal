'use client'

import { createContext, useContext, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { useSessionTimeout } from '@/hooks/use-session-timeout'
import { SessionTimeoutModal } from '@/components/auth/session-timeout-modal'

interface SessionContextValue {
  /** Reset the activity timer */
  resetActivity: () => void
  /** Whether the warning modal is visible */
  isWarningVisible: boolean
  /** Time remaining before logout (in seconds) */
  timeRemaining: number
}

const SessionContext = createContext<SessionContextValue | null>(null)

// Pages that don't require session timeout tracking
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/auth']

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useSession()
  
  // Check if we're on a public path
  const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path))
  
  // Only enable timeout for authenticated users on protected pages
  const shouldTrackSession = isAuthenticated && !isPublicPath

  const handleTimeout = useCallback(() => {
    logout()
  }, [logout])

  const {
    resetActivity,
    isWarningVisible,
    timeRemaining,
    dismissWarning,
  } = useSessionTimeout({
    enabled: shouldTrackSession,
    onTimeout: handleTimeout,
  })

  const contextValue = useMemo(() => ({
    resetActivity,
    isWarningVisible,
    timeRemaining,
  }), [resetActivity, isWarningVisible, timeRemaining])

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
      <SessionTimeoutModal
        isOpen={isWarningVisible && shouldTrackSession}
        timeRemaining={timeRemaining}
        onStayLoggedIn={dismissWarning}
        onLogout={logout}
      />
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider')
  }
  return context
}
