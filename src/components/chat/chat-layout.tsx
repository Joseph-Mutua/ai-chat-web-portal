'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ConversationSidebar } from './conversation-sidebar'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ChatEntry } from './chat-entry'
import { useSendMessage, useConversationMessages } from '@/hooks/api/use-chat'
import { useSession } from '@/hooks/use-session'
import { useQueryClient } from '@tanstack/react-query'
import { ErrorDisplay } from '@/components/ui/error'
import { getErrorMessage } from '@/lib/utils/errors'
import type { MessageType } from '@/types'

interface ChatLayoutProps {
  conversationId?: string
}

export function ChatLayout({ conversationId }: ChatLayoutProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useSession()
  const sendMessage = useSendMessage()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId)

  const {
    data: conversationData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useConversationMessages({
    chatConversationId: currentConversationId || '',
    page: 1,
    limit: 50,
  })

  // Update current conversation ID when prop changes
  useEffect(() => {
    setCurrentConversationId(conversationId)
  }, [conversationId])

  // Update messages when conversation data changes
  useEffect(() => {
    if (conversationData && currentConversationId) {
      const allMessages = conversationData.pages.flatMap((page) => page.messages)
      setMessages(allMessages)
    } else if (!currentConversationId) {
      setMessages([])
    }
  }, [conversationData, currentConversationId])

  const handleSendMessage = async (messageText: string) => {
    setError(null)
    try {
      const response = await sendMessage.mutateAsync({
        message: messageText,
        conversationId: currentConversationId || undefined,
      })

      // Update conversation ID if this is a new conversation
      const isNewConversation = !currentConversationId && response.conversationId
      if (isNewConversation) {
        setCurrentConversationId(response.conversationId)
        // Update URL in the background without navigation
        if (typeof window !== 'undefined') {
          window.history.replaceState(
            { ...window.history.state, as: `/chat/${response.conversationId}` },
            '',
            `/chat/${response.conversationId}`
          )
        }
      }

      // Add user message immediately (optimistic update)
      const userMessage: MessageType = {
        id: `temp-${Date.now()}`,
        message: messageText,
        role: 'USER',
        type: 'message',
        createdAt: new Date().toISOString(),
        conversationId: response.conversationId,
        user: {
          firstName: user?.firstName || 'You',
          me: true,
        },
      }

      // Add assistant response
      const assistantMessage: MessageType = {
        id: response.id,
        message: response.message,
        role: 'ASSISTANT',
        type: 'assistant',
        createdAt: response.createdAt,
        conversationId: response.conversationId,
        metadata: response.metadata,
        citations: response.metadata?.citations,
        attachments: response.attachments,
      }

      // Add messages optimistically
      setMessages((prev) => [...prev, userMessage, assistantMessage])

      // Invalidate and refetch messages query after a delay
      // This ensures the server has processed the new message
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['conversation-messages', response.conversationId],
        })
      }, 1500)
    } catch (err) {
      setError(getErrorMessage(err))
      // Remove optimistic messages on error
      setMessages((prev) => prev.slice(0, -2))
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const hasMessages = messages.length > 0 || currentConversationId

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ConversationSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-text-secondary">Loading conversation...</div>
            </div>
          ) : error ? (
            <ErrorDisplay
              message={error}
              onRetry={() => {
                setError(null)
                refetchMessages()
              }}
            />
          ) : !hasMessages ? (
            <ChatEntry onSuggestionClick={handleSuggestionClick} />
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={sendMessage.isPending}
        />
      </div>
    </div>
  )
}
