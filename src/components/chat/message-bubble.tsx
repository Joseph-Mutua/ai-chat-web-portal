'use client'

import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { MessageBubbleControls } from './message-bubble-controls'
import type { MessageType } from '@/types'
import typingGif from '@/assets/animations/typing.gif'
import logoImage from '@/assets/images/logo.png'

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

const MARKDOWN_STYLES = cn(
  'text-sm leading-relaxed',
  '[&>p]:mb-2 [&>p]:last:mb-0',
  '[&>h1]:text-lg [&>h1]:font-bold',
  '[&>h2]:text-base [&>h2]:font-bold',
  '[&>ul]:list-disc [&>ul]:ml-4',
  '[&>ol]:list-decimal [&>ol]:ml-4',
  '[&>code]:px-1.5 [&>code]:py-0.5 [&>code]:bg-white/50 [&>code]:rounded [&>code]:font-mono',
  '[&>pre]:p-3 [&>pre]:bg-white/50 [&>pre]:rounded-lg [&>pre]:overflow-x-auto'
)

function normalizeRole(role: string | undefined): 'USER' | 'ASSISTANT' | undefined {
  if (!role) return undefined
  const normalized = role.toUpperCase()
  if (normalized === 'MODEL') return 'ASSISTANT'
  if (normalized === 'USER' || normalized === 'ASSISTANT') return normalized as 'USER' | 'ASSISTANT'
  return undefined
}

function MessageBubbleComponent({
  message,
  allMessages,
  conversationId,
  conversationTitle,
  onOpenReport,
}: MessageBubbleProps) {
  const messageRole = useMemo(() => {
    const role = message.role || message.metadata?.role
    return normalizeRole(role)
  }, [message.role, message.metadata?.role])
  
  const isUser = messageRole === 'USER'
  const isAssistant = messageRole === 'ASSISTANT'
  const isPending = useMemo(() => {
    return isAssistant && (!message.message || message.message.trim() === '') && message.id.startsWith('temp-pending')
  }, [isAssistant, message.message, message.id])

  const [thumbMessages, setThumbMessages] = useState<Record<string, ThumbsRegister[]>>({
    thumbsUp: [],
    thumbsDown: [],
  })

  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

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
      <div className={cn('flex flex-col', isUser ? 'ml-auto items-end' : 'mr-auto items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-grey-light lg:bg-background-light text-text max-w-[90%] sm:max-w-sm md:max-w-md'
              : 'text-text max-w-[95%] sm:max-w-2xl lg:max-w-4xl'
          )}
        >
          {isAssistant ? (
            isPending ? (
              <div className="flex items-center justify-start py-2">
                <Image src={typingGif} alt="Typing..." width={48} height={48} className="object-contain" unoptimized />
              </div>
            ) : (
              <>
                <div className="lg:hidden mb-2">
                  <Image src={logoImage} alt="warpSpeed" width={18} height={18} className="w-[18px] h-[18px] object-contain" />
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className={MARKDOWN_STYLES}>
                    {message.message}
                  </ReactMarkdown>
                </div>
              </>
            )
          ) : (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
          )}

          {(() => {
            const citations = message.citations
            if (!citations || citations.length === 0) return null
            return (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs font-medium mb-2">Sources:</div>
                <div className="space-y-1">
                  {citations.map((citation, idx) => (
                    <a
                      key={idx}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-dark hover:underline block truncate"
                    >
                      {citation.title || citation.source || citation.url}
                    </a>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>

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

export const MessageBubble = memo(MessageBubbleComponent, (prevProps, nextProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.message === nextProps.message.message &&
    prevProps.conversationId === nextProps.conversationId
  )
})
