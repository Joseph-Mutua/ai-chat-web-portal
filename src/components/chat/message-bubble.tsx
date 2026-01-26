'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { MessageBubbleControls } from './message-bubble-controls'
import type { MessageType } from '@/types'
import typingGif from '@/assets/animations/typing.gif'

interface MessageBubbleProps {
  message: MessageType
  allMessages?: MessageType[]
  conversationId?: string
  conversationTitle?: string
  onOpenReport?: (params: { conversationId: string; messageId: string }) => void
}

type ThumbsRegister = {
  conversationId: string
  messageId: string
}

export function MessageBubble({
  message,
  allMessages,
  conversationId,
  conversationTitle,
  onOpenReport,
}: MessageBubbleProps) {
  // Get role from message.role or fallback to metadata.role
  // Normalize "model" to "ASSISTANT" (API returns "model" for assistant messages)
  let messageRole = message.role || message.metadata?.role
  if (messageRole === 'model' || messageRole === 'MODEL') {
    messageRole = 'ASSISTANT'
  }
  // Normalize case for consistency
  if (messageRole === 'user') messageRole = 'USER'
  if (messageRole === 'assistant') messageRole = 'ASSISTANT'
  
  const isUser = messageRole === 'USER'
  const isAssistant = messageRole === 'ASSISTANT'
  const isPending = isAssistant && (!message.message || message.message.trim() === '') && message.id.startsWith('temp-pending')

  const [thumbMessages, setThumbMessages] = useState<Record<string, ThumbsRegister[]>>({
    thumbsUp: [],
    thumbsDown: [],
  })

  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  
  // Typing effect for assistant messages
  // Initialize displayedText as empty for assistant messages to trigger typing effect
  const [displayedText, setDisplayedText] = useState(() => {
    // For pending messages, keep empty (will show typing.gif)
    // For assistant messages with content, start empty to trigger typing
    // For user messages, show immediately
    const messageRole = message.role || message.metadata?.role
    const isAssistantMsg = messageRole === 'ASSISTANT' || messageRole === 'model' || messageRole === 'MODEL'
    const isPendingMsg = isAssistantMsg && (!message.message || message.message.trim() === '') && message.id.startsWith('temp-pending')
    
    if (isPendingMsg) {
      return '' // Pending messages will show typing.gif
    }
    return isAssistantMsg ? '' : (message.message || '')
  })
  const [isTyping, setIsTyping] = useState(false)
  const messageIdRef = useRef<string | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const wordsRef = useRef<string[]>([])
  const currentIndexRef = useRef<number>(0)
  const hasTypedRef = useRef<Set<string>>(new Set())

  // Reset and start typing effect when message changes
  useEffect(() => {
    // Cleanup any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (isAssistant && message.message) {
      const isNewMessage = messageIdRef.current !== message.id
      const hasNotTyped = !hasTypedRef.current.has(message.id)
      
      // If it's a new message that hasn't been typed yet, start typing
      if (isNewMessage && hasNotTyped) {
        messageIdRef.current = message.id
        hasTypedRef.current.add(message.id)
        setDisplayedText('')
        setIsTyping(true)
        currentIndexRef.current = 0
        
        // Split message into words while preserving spaces
        wordsRef.current = message.message.split(/(\s+)/)
        
        const typeNextWord = () => {
          if (currentIndexRef.current < wordsRef.current.length) {
            setDisplayedText(prev => prev + wordsRef.current[currentIndexRef.current])
            currentIndexRef.current++
            typingTimeoutRef.current = setTimeout(typeNextWord, 30) // 30ms per word
          } else {
            setIsTyping(false)
            setDisplayedText(message.message) // Ensure full text is set
          }
        }
        
        // Start typing immediately
        typeNextWord()
      } else {
        // Same message or already typed, ensure full text is displayed
        if (displayedText !== message.message) {
          setDisplayedText(message.message)
        }
        setIsTyping(false)
        if (isNewMessage) {
          messageIdRef.current = message.id
        }
      }
    } else {
      // User message or no message, show immediately
      setDisplayedText(message.message || '')
      setIsTyping(false)
      if (message.id) {
        messageIdRef.current = message.id
      }
    }
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [message.id, message.message, isAssistant])

  const isThumbed = useCallback(
    (thumbKey: 'thumbsUp' | 'thumbsDown') =>
      thumbMessages[thumbKey]?.some(v => v.messageId === message.id) || false,
    [thumbMessages, message.id]
  )

  const handleThumbsPress = useCallback(
    (thumbKey: 'thumbsUp' | 'thumbsDown', convId: string, msgId: string) => {
      if (thumbKey === 'thumbsDown' && onOpenReport) {
        onOpenReport({ conversationId: convId, messageId: msgId })
        return
      }

      setThumbMessages(prev => ({
        ...prev,
        [thumbKey]: [...(prev[thumbKey] || []), { conversationId: convId, messageId: msgId }],
      }))
    },
    [onOpenReport]
  )

  const handleSpeak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesisRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const handleStopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  useEffect(() => {
    return () => handleStopSpeaking()
  }, [handleStopSpeaking])

  return (
    <div className="w-full mb-6 flex flex-row">
      {/* 🔑 Alignment happens HERE */}
      <div
        className={cn(
          'flex flex-col',
          isUser ? 'ml-auto items-end' : 'mr-auto items-start'
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-white text-[#1E1E1E] max-w-[90%] sm:max-w-[380px]'
              : 'text-[#1E1E1E] max-w-[95%] sm:max-w-[837px]'
          )}
        >
          {/* Message Content */}
          {isAssistant ? (
            isPending ? (
              // Show typing animation for pending messages
              <div className="flex items-center justify-start py-2">
                <Image
                  src={typingGif}
                  alt="Typing..."
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className={cn(
                    'text-sm leading-relaxed',
                    '[&>p]:mb-2 [&>p]:last:mb-0',
                    '[&>h1]:text-lg [&>h1]:font-bold',
                    '[&>h2]:text-base [&>h2]:font-bold',
                    '[&>ul]:list-disc [&>ul]:ml-4',
                    '[&>ol]:list-decimal [&>ol]:ml-4',
                    '[&>code]:px-1.5 [&>code]:py-0.5 [&>code]:bg-white/50 [&>code]:rounded [&>code]:font-mono',
                    '[&>pre]:p-3 [&>pre]:bg-white/50 [&>pre]:rounded-lg [&>pre]:overflow-x-auto'
                  )}
                >
                  {displayedText}
                </ReactMarkdown>
                {isTyping && (
                  <span className="inline-block w-2 h-4 ml-1 bg-[#1E1E1E] animate-pulse" />
                )}
              </div>
            )
          ) : (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.message}
            </p>
          )}

          {/* Citations - only show when typing is complete */}
          {!isTyping && message.citations?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#EBEBEB]">
              <div className="text-xs font-medium mb-2">Sources:</div>
              <div className="space-y-1">
                {message.citations.map((citation, idx) => (
                  <a
                    key={idx}
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#1A7A7A] hover:underline block truncate"
                  >
                    {citation.title || citation.source || citation.url}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls — AI only, aligned left (not for pending messages) */}
        {isAssistant && !isPending && conversationId && (
          <MessageBubbleControls
            message={message.message || ''}
            messageId={message.id}
            allMessages={allMessages}
            conversationId={conversationId}
            conversationTitle={conversationTitle}
            isSpeaking={isSpeaking}
            onSpeak={handleSpeak}
            onStopSpeaking={handleStopSpeaking}
            onThumbsPress={handleThumbsPress}
            isThumbed={isThumbed}
            onOpenReport={onOpenReport}
          />
        )}
      </div>
    </div>
  )
}
