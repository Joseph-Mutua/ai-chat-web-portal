'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { ConversationSidebar } from './conversation-sidebar'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ChatEntry } from './chat-entry'
import { ProfileModal } from './profile-modal'
import { useSendMessage, useConversationMessages, useChatConversations } from '@/hooks/api/use-chat'
import { useSession } from '@/hooks/use-session'
import { useQueryClient } from '@tanstack/react-query'
import { ErrorDisplay } from '@/components/ui/error'
import { getErrorMessage } from '@/lib/utils/errors'
import logoImage from '@/assets/images/logo.png'
import type { MessageType } from '@/types'

interface ChatLayoutProps {
  conversationId?: string
}

export function ChatLayout({ conversationId }: ChatLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { user } = useSession()
  const sendMessage = useSendMessage()
  const [messages, setMessages] = useState<MessageType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const justCreatedConversationRef = useRef(false)

  const {
    data: conversationData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useConversationMessages({
    chatConversationId: currentConversationId || '',
    page: 1,
    limit: 50,
  })

  const { data: conversationsData } = useChatConversations({
    page: 1,
    limit: 100,
  })

  useEffect(() => {
    const prevConversationId = currentConversationId

    if (conversationId !== currentConversationId) {
      setCurrentConversationId(conversationId)
    }
    
    if (!conversationId && prevConversationId) {
      setMessages([])
      setError(null)
    } else if (conversationId && conversationId !== prevConversationId) {
      setMessages([])
      setError(null)
    }
  }, [conversationId]) 

  useEffect(() => {
    if (pathname === '/chat' && !conversationId && currentConversationId && !justCreatedConversationRef.current) {

      setCurrentConversationId(undefined)
      setMessages([])
      setError(null)
    }
  }, [pathname, conversationId, currentConversationId])

  // Update messages when conversation data changes
  useEffect(() => {
    if (conversationData && currentConversationId) {
      const allMessages = conversationData.pages.flatMap((page) => page.messages)
      // Normalize messages to ensure role and conversationId are always set
      const normalizedMessages = allMessages.map((msg) => {
        let messageRole = msg.role || msg.metadata?.role || 'ASSISTANT'
        
        // Normalize "model" to "ASSISTANT" (API returns "model" for assistant messages)
        if (messageRole === 'model' || messageRole === 'MODEL') {
          messageRole = 'ASSISTANT'
        }
        
        // Ensure uppercase for consistency
        if (messageRole === 'user') messageRole = 'USER'
        if (messageRole === 'assistant') messageRole = 'ASSISTANT'
        
        return {
          ...msg,
          role: messageRole as 'USER' | 'ASSISTANT',
  
          conversationId: msg.conversationId || currentConversationId,
         
          metadata: {
            ...msg.metadata,
            role: messageRole as 'USER' | 'ASSISTANT',
          },
        }
      })
      setMessages(normalizedMessages)
    } else if (!currentConversationId) {
      setMessages([])
    }
  }, [conversationData, currentConversationId])

  const handleSendMessage = async (messageText: string) => {
    setError(null)
    
    const userMessage: MessageType = {
      id: `temp-user-${Date.now()}`,
      message: messageText,
      role: 'USER',
      type: 'message',
      createdAt: new Date().toISOString(),
      conversationId: currentConversationId,
      user: {
        firstName: user?.firstName || 'You',
        me: true,
      },
    }

    const pendingAssistantMessage: MessageType = {
      id: `temp-pending-${Date.now()}`,
      message: '',
      role: 'ASSISTANT',
      type: 'assistant',
      createdAt: new Date().toISOString(),
      conversationId: currentConversationId,
      metadata: { role: 'ASSISTANT' },
    }

    setMessages((prev) => [...prev, userMessage, pendingAssistantMessage])
    
    try {
      const response = await sendMessage.mutateAsync({
        message: messageText,
        conversationId: currentConversationId || undefined,
      })

      // Update conversation ID if this is a new conversation
      const isNewConversation = !currentConversationId && response.conversationId
      if (isNewConversation) {
        setCurrentConversationId(response.conversationId)

        justCreatedConversationRef.current = true
        setTimeout(() => {
          justCreatedConversationRef.current = false
        }, 1000)
      }

      // Normalize metadata.role from "model" to "ASSISTANT" if needed
      const normalizedMetadata = {
        ...response.metadata,
        role: (response.metadata?.role === 'model' || response.metadata?.role === 'MODEL') 
          ? 'ASSISTANT' 
          : (response.metadata?.role || 'ASSISTANT'),
      }
      
      const assistantMessage: MessageType = {
        id: response.id,
        message: response.message,
        role: 'ASSISTANT',
        type: 'assistant',
        createdAt: response.createdAt,
        conversationId: response.conversationId,
        metadata: normalizedMetadata,
        citations: response.metadata?.citations,
        attachments: response.attachments,
      }

      setMessages((prev) => {
        const newMessages = [...prev]
        const pendingIndex = newMessages.findIndex(msg => msg.id === pendingAssistantMessage.id)
        if (pendingIndex !== -1) {
          newMessages[pendingIndex] = assistantMessage
        } else {
    
          newMessages.push(assistantMessage)
        }
        return newMessages
      })

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['conversation-messages', response.conversationId],
        })
      }, 1500)
    } catch (err) {
      setError(getErrorMessage(err))

      setMessages((prev) => {
        return prev.filter(msg => 
          msg.id !== userMessage.id && msg.id !== pendingAssistantMessage.id
        )
      })
    }
  }

  const hasMessages = messages.length > 0 || currentConversationId

  // Get conversation title from conversations list
  const conversationTitle = conversationsData?.pages
    .flatMap((page) => page.data)
    .find((conv) => conv.id === currentConversationId)?.title || undefined

  const handleOpenReport = (params: { conversationId: string; messageId: string }) => {
    // TODO: Implement report modal for web
    console.log('Open report modal:', params)
    if (typeof window !== 'undefined') {
      alert(`Report message: ${params.messageId}\nThis feature will be implemented with a proper modal.`)
    }
  }

  return (
    <div className="flex h-screen">
      <ConversationSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background-light lg:bg-background">
      
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 bg-background-light lg:bg-background">
      
          <div className="flex items-center gap-3 lg:hidden">
            <Image
              src={logoImage}
              alt="warpSpeed"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
            <span className="text-text font-semibold text-base">warpSpeed</span>
          </div>

  
          <h1 className="hidden lg:block text-3xl font-semibold text-text">
            AI Chat
          </h1>

          <div className="flex items-center gap-3">
     
            <button 
              className="lg:hidden p-2 text-text"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

      
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
                <div className="w-10 h-10 rounded-full bg-avatar-bg flex items-center justify-center">
                  <span className="text-primary-dark font-medium">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-background-light lg:bg-background">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-grey">Loading conversation...</div>
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
            
            <>
              {/* Mobile App Banner */}
              <div className="lg:hidden px-4 py-3">
                <div className="flex items-center justify-between rounded-2xl px-4 py-4 border border-secondary-medium bg-gradient-to-r from-secondary-light to-primary-light">
                  <p className="text-sm text-text font-medium">
                    Unlock the full power of warpSpeed.
                  </p>
                  <button 
                    type="button"
                    className="px-4 py-2 bg-primary-dark text-white text-sm font-medium rounded-full whitespace-nowrap hover:bg-primary-darker transition-colors"
                  >
                    Get the App
                  </button>
                </div>
              </div>

              <ChatEntry 
                onSendMessage={handleSendMessage} 
                isLoading={sendMessage.isPending}
              />

              {/* Desktop App Banner */}
              <div className="hidden lg:block px-6 py-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between rounded-3xl px-8 py-5 border border-secondary-medium bg-gradient-to-r from-secondary-light to-primary-light">
                    <div>
                      <h3 className="text-text font-semibold text-lg mb-1">
                        Unlock Exclusive Features in the App
                      </h3>
                      <p className="text-sm text-grey">
                        Access offline chat, private notes, and personalized insights — only in our mobile app.
                      </p>
                    </div>
                    <button 
                      type="button"
                      className="flex-shrink-0 px-8 py-3 bg-primary-dark text-white text-sm font-medium rounded-full hover:bg-primary-darker transition-colors"
                    >
                      Get The App
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Conversation view with messages and bottom input
            <>
              <MessageList 
                messages={messages}
                conversationId={currentConversationId}
                conversationTitle={conversationTitle}
                onOpenReport={handleOpenReport}
              />
              <ChatInput
                onSend={handleSendMessage}
                isLoading={sendMessage.isPending}
              />
            </>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </div>
  )
}
