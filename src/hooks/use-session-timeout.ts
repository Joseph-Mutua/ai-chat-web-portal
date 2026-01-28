'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { storage, SESSION_CONFIG } from '@/lib/utils/storage'

interface UseSessionTimeoutOptions {
  /** Callback when warning should be shown (before logout) */
  onWarning?: () => void
  /** Callback when session times out */
  onTimeout?: () => void
  /** Whether to enable the timeout (default: true) */
  enabled?: boolean
  /** Custom warning timeout in ms (default: SESSION_CONFIG.WARNING_TIMEOUT) */
  warningTimeout?: number
  /** Custom logout timeout in ms (default: SESSION_CONFIG.LOGOUT_TIMEOUT) */
  logoutTimeout?: number
}

interface UseSessionTimeoutReturn {
  /** Reset the activity timer (call this to extend session) */
  resetActivity: () => void
  /** Whether the warning is currently showing */
  isWarningVisible: boolean
  /** Time remaining before logout (in seconds) */
  timeRemaining: number
  /** Dismiss the warning and reset activity */
  dismissWarning: () => void
}

export function useSessionTimeout({
  onWarning,
  onTimeout,
  enabled = true,
  warningTimeout = SESSION_CONFIG.WARNING_TIMEOUT,
  logoutTimeout = SESSION_CONFIG.LOGOUT_TIMEOUT,
}: UseSessionTimeoutOptions = {}): UseSessionTimeoutReturn {
  const [isWarningVisible, setIsWarningVisible] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
      warningTimerRef.current = null
    }
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current)
      logoutTimerRef.current = null
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
  }, [])

  // Start the countdown timer for the warning
  const startCountdown = useCallback(() => {
    const remainingMs = logoutTimeout - warningTimeout
    setTimeRemaining(Math.ceil(remainingMs / 1000))

    countdownTimerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [logoutTimeout, warningTimeout])

  // Reset activity and restart timers
  const resetActivity = useCallback(() => {
    if (!enabled) return

    const now = Date.now()
    lastActivityRef.current = now
    storage.setLastActivity(now)
    
    // Clear existing timers
    clearAllTimers()
    setIsWarningVisible(false)
    setTimeRemaining(0)

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setIsWarningVisible(true)
      onWarning?.()
      startCountdown()

      // Set logout timer (time after warning)
      const remainingTime = logoutTimeout - warningTimeout
      logoutTimerRef.current = setTimeout(() => {
        onTimeout?.()
      }, remainingTime)
    }, warningTimeout)
  }, [enabled, clearAllTimers, onWarning, onTimeout, warningTimeout, logoutTimeout, startCountdown])

  // Dismiss warning and reset activity
  const dismissWarning = useCallback(() => {
    setIsWarningVisible(false)
    resetActivity()
  }, [resetActivity])

  // Track user activity
  useEffect(() => {
    if (!enabled) return

    const handleActivity = () => {
      // Only reset if warning is not visible (don't reset during countdown)
      if (!isWarningVisible) {
        resetActivity()
      }
    }

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    // Throttle activity updates to avoid excessive calls
    let throttleTimer: NodeJS.Timeout | null = null
    const throttledActivity = () => {
      if (throttleTimer) return
      throttleTimer = setTimeout(() => {
        throttleTimer = null
        handleActivity()
      }, 1000) // Throttle to once per second
    }

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, throttledActivity, { passive: true })
    })

    // Initial activity timestamp
    resetActivity()

    // Check for existing session on mount
    const lastActivity = storage.getLastActivity()
    if (lastActivity) {
      const elapsed = Date.now() - lastActivity
      if (elapsed >= logoutTimeout) {
        // Session already expired
        onTimeout?.()
      } else if (elapsed >= warningTimeout) {
        // Show warning
        setIsWarningVisible(true)
        onWarning?.()
        const remainingTime = logoutTimeout - elapsed
        setTimeRemaining(Math.ceil(remainingTime / 1000))
        
        // Start countdown from remaining time
        countdownTimerRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current)
              }
              onTimeout?.()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, throttledActivity)
      })
      if (throttleTimer) {
        clearTimeout(throttleTimer)
      }
      clearAllTimers()
    }
  }, [enabled, isWarningVisible, resetActivity, clearAllTimers, onWarning, onTimeout, warningTimeout, logoutTimeout])

  return {
    resetActivity,
    isWarningVisible,
    timeRemaining,
    dismissWarning,
  }
}
