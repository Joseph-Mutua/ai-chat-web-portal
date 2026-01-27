'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MessageBubble } from './message-bubble'
import type { MessageType } from '@/types'

interface MessageListProps {
  messages: MessageType[]
  conversationId?: string
  conversationTitle?: string
  onOpenReport?: (params: { conversationId: string; messageId: string }) => void
}

export function MessageList({ messages, conversationId, conversationTitle, onOpenReport }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const previousMessagesLength = useRef(messages.length)
  const lastMessageIdRef = useRef<string | undefined>(messages[messages.length - 1]?.id)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()


  const isAtBottom = useCallback(() => {
    if (!containerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
  
    const threshold = 10
    return scrollHeight - scrollTop - clientHeight < threshold
  }, [])


  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrollingRef.current) return
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    const atBottom = isAtBottom()
    setShouldAutoScroll(atBottom)
  }, [isAtBottom])

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    const lastMessageId = lastMessage?.id
    const hasNewMessages = lastMessageId && lastMessageId !== lastMessageIdRef.current
    
    
    previousMessagesLength.current = messages.length
    if (lastMessageId) {
      lastMessageIdRef.current = lastMessageId
    }

    // Only auto-scroll if:
    // 1. There are actually new messages (different last message ID)
    // 2. User is near the bottom (shouldAutoScroll is true)
    // 3. We're not currently programmatically scrolling
    // 4. Container exists and is ready
    if (
      hasNewMessages && 
      shouldAutoScroll && 
      !isScrollingRef.current &&
      containerRef.current &&
      messagesEndRef.current
    ) {
      const stillAtBottom = isAtBottom()
      if (stillAtBottom) {
        isScrollingRef.current = true
        setTimeout(() => {
          if (messagesEndRef.current && containerRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
           
            setTimeout(() => {
              isScrollingRef.current = false
            }, 500)
          }
        }, 50)
      }
    }
  }, [messages, shouldAutoScroll, isAtBottom])

  useEffect(() => {
    if (messages.length > 0 && containerRef.current) {
      const isAtBottom = containerRef.current.scrollHeight === containerRef.current.clientHeight
      if (isAtBottom) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
        }, 100)
      }
    }
  }, []) 

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto px-4 lg:px-6 py-4 lg:py-6"
      onScroll={handleScroll}
      style={{ height: '100%' }}
    >
      <div className="flex flex-col w-full space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-[#827F85] py-12">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              allMessages={messages}
              conversationId={conversationId}
              conversationTitle={conversationTitle}
              onOpenReport={onOpenReport}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
