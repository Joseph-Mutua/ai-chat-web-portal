'use client'

import { ChatLayout } from '@/components/chat/chat-layout'
import { useSession } from '@/hooks/use-session'
import { LoadingContainer } from '@/components/ui/loading'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ChatPage() {
  const { user, isLoading, isAuthenticated } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Use query parameter as key to force remount when clicking New Chat
  // This ensures a fresh state when navigating to /chat?new=timestamp
  const newChatKey = searchParams.get('new')

  // All hooks must be called before any early returns
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Clean up query parameter after component mounts (but don't cause remount)
  useEffect(() => {
    if (newChatKey) {
      // Use replaceState to remove query without navigation
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/chat')
      }
    }
  }, [newChatKey])

  // Early returns after all hooks
  if (isLoading) {
    return <LoadingContainer />
  }

  if (!isAuthenticated) {
    return null
  }

  return <ChatLayout key={newChatKey || 'default'} />
}
