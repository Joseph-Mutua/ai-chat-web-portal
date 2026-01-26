'use client'

import { useState, useEffect } from 'react'

const BANNER_DISMISSED_KEY = 'app_banner_dismissed'
const BANNER_DISMISSED_DURATION = 7 * 24 * 60 * 60 * 1000
const MIN_MESSAGES_TO_SHOW = 3 // Show after user sends 3 messages
const MIN_SESSION_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds
const MIN_MESSAGES_MOBILE = 1 // Show after 1 message on mobile web
const MIN_SESSION_TIME_MOBILE = 2 * 60 * 1000 // 2 minutes on mobile web

interface UseAppBannerOptions {
  messageCount: number
  sessionStartTime: number
}

export function useAppBanner({ messageCount, sessionStartTime }: UseAppBannerOptions) {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setShouldShow(false)
      return
    }

    // Check if user is on mobile web (they might want the native app)
    const isMobileWeb = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

    // Check if banner was dismissed recently
    const dismissedTimestamp = localStorage.getItem(BANNER_DISMISSED_KEY)
    if (dismissedTimestamp) {
      const dismissedTime = parseInt(dismissedTimestamp, 10)
      const now = Date.now()
      const timeSinceDismissed = now - dismissedTime

      // If dismissed less than 7 days ago, don't show
      if (timeSinceDismissed < BANNER_DISMISSED_DURATION) {
        setShouldShow(false)
        return
      }
    }

    const sessionDuration = Date.now() - sessionStartTime

    // Different thresholds for mobile web vs desktop
    if (isMobileWeb) {
      // On mobile web: show after 1 message or 2 minutes (lower threshold)
      const hasEngaged = messageCount >= MIN_MESSAGES_MOBILE || sessionDuration >= MIN_SESSION_TIME_MOBILE
      setShouldShow(hasEngaged)
    } else {
      // On desktop: show after 3 messages or 5 minutes (higher threshold)
      const hasEngaged = messageCount >= MIN_MESSAGES_TO_SHOW || sessionDuration >= MIN_SESSION_TIME
      setShouldShow(hasEngaged)
    }
  }, [messageCount, sessionStartTime])

  const dismissBanner = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, Date.now().toString())
    setShouldShow(false)
  }

  return {
    shouldShow,
    dismissBanner,
  }
}
