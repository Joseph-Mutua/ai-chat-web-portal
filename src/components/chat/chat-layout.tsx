'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ConversationSidebar } from './conversation-sidebar'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ChatEntry } from './chat-entry'
import { ProfileModal } from './profile-modal'
import { useSendMessage, useConversationMessages } from '@/hooks/api/use-chat'
import { useSession } from '@/hooks/use-session'
import { useQueryClient } from '@tanstack/react-query'
import { ErrorDisplay } from '@/components/ui/error'
import { getErrorMessage } from '@/lib/utils/errors'
import { useAppBanner } from '@/hooks/use-app-banner'
import logoImage from '@/assets/images/logo.png'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [userMessageCount, setUserMessageCount] = useState(0)
  const sessionStartTime = useRef(Date.now())

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
      
      // Increment user message count for banner logic
      setUserMessageCount((prev) => prev + 1)

      // Invalidate and refetch messages query after a delay
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

  const hasMessages = messages.length > 0 || currentConversationId

  const { shouldShow: shouldShowBanner, dismissBanner } = useAppBanner({
    messageCount: userMessageCount,
    sessionStartTime: sessionStartTime.current,
  })

  return (
    <div className="flex h-screen">
      {/* Sidebar - handles both desktop (always visible) and mobile (toggle) */}
      <ConversationSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F4F5FA]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-[#EBEBEB] bg-white">
          {/* Mobile: Logo and menu */}
          <div className="flex items-center gap-3 lg:hidden">
            <Image
              src={logoImage}
              alt="warpSpeed"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
            <span className="text-[#1E1E1E] font-semibold text-base">warpSpeed</span>
          </div>

          {/* Desktop: AI Chat title */}
          <h1 className="hidden lg:block text-xl font-semibold text-[#1E1E1E]">
            AI Chat
          </h1>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger menu */}
            <button 
              className="lg:hidden p-2 text-[#1E1E1E]"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop: User avatar */}
            <button
              className="hidden lg:flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsProfileModalOpen(true)}
            >
              {user?.profileImage?.url || user?.profileImageUrl ? (
                <Image
                  src={user.profileImage?.url || user.profileImageUrl || ''}
                  alt={user.firstName || 'User'}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#E8F5F5] flex items-center justify-center">
                  <span className="text-[#1A7A7A] font-medium">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Mobile App Banner */}
        {shouldShowBanner && (
          <div className="lg:hidden px-4 py-3 bg-white">
            <div 
              className="flex items-center justify-between rounded-2xl px-4 py-4 border border-[#CEB8F2]"
              style={{ background: 'linear-gradient(102deg, #EDE2FF 0%, #E9F7F6 100%)' }}
            >
              <p className="text-sm text-[#1E1E1E] font-medium">
                Unlock the full power of warpSpeed.
              </p>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={dismissBanner}
                  className="p-1 text-[#827F85] hover:text-[#1E1E1E] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 bg-[#1A7A7A] text-white text-sm font-medium rounded-full whitespace-nowrap hover:bg-[#156666] transition-colors"
                >
                  Get the App
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#F4F5FA]">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-[#827F85]">Loading conversation...</div>
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
            // Welcome screen with centered input
            <ChatEntry 
              onSendMessage={handleSendMessage} 
              isLoading={sendMessage.isPending}
            />
          ) : (
            // Conversation view with messages and bottom input
            <>
              <MessageList messages={messages} />
              <ChatInput
                onSend={handleSendMessage}
                isLoading={sendMessage.isPending}
              />
            </>
          )}
        </div>

        {/* Desktop App Banner - Shown based on engagement */}
        {shouldShowBanner && (
          <div className="hidden lg:block px-6 py-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <div 
                className="flex items-center justify-between rounded-3xl px-8 py-5 border border-[#CEB8F2] relative"
                style={{ background: 'linear-gradient(98deg, #EDE2FF 0%, #E9F7F6 100%)' }}
              >
                <button
                  type="button"
                  onClick={dismissBanner}
                  className="absolute top-4 right-4 p-1 text-[#827F85] hover:text-[#1E1E1E] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="pr-12">
                  <h3 className="text-[#1E1E1E] font-semibold text-lg mb-1">
                    Unlock Exclusive Features in the App
                  </h3>
                  <p className="text-sm text-[#827F85]">
                    Access offline chat, private notes, and personalized insights — only in our mobile app.
                  </p>
                </div>
                <button 
                  type="button"
                  className="flex-shrink-0 px-8 py-3 bg-[#1A7A7A] text-white text-sm font-medium rounded-full hover:bg-[#156666] transition-colors"
                >
                  Get The App
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </div>
  )
}
