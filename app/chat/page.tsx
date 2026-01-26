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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <LoadingContainer />
  }

  if (!isAuthenticated) {
    return null
  }

  // Use query parameter as key to force remount when clicking New Chat
  // This ensures a fresh state when navigating to /chat?new=timestamp
  const newChatKey = searchParams.get('new')
  
  // Clean up query parameter after component mounts (but don't cause remount)
  useEffect(() => {
    if (newChatKey) {
      // Use replaceState to remove query without navigation
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/chat')
      }
    }
  }, [newChatKey])

  return <ChatLayout key={newChatKey || 'default'} />
}
