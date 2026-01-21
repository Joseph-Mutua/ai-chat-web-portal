'use client'

import { use } from 'react'
import { ChatLayout } from '@/components/chat/chat-layout'
import { useSession } from '@/hooks/use-session'
import { LoadingContainer } from '@/components/ui/loading'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = use(params)
  const { user, isLoading, isAuthenticated } = useSession()
  const router = useRouter()

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

  return <ChatLayout conversationId={conversationId} />
}
