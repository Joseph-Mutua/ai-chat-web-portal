'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'
import type { MessageType } from '@/types'

interface MessageBubbleControlsProps {
  message: string
  messageId: string
  allMessages?: MessageType[]
  conversationId: string
  conversationTitle?: string
  isSpeaking: boolean
  onSpeak: (message: string) => void
  onStopSpeaking: () => void
  onThumbsPress: (thumbState: 'thumbsUp' | 'thumbsDown', conversationId: string, messageId: string) => void
  isThumbed: (thumbKey: 'thumbsUp' | 'thumbsDown') => boolean
  onOpenReport?: (params: { conversationId: string; messageId: string }) => void
}

export function MessageBubbleControls({
  message,
  messageId,
  allMessages,
  conversationId,
  conversationTitle,
  isSpeaking,
  onSpeak,
  onStopSpeaking,
  onThumbsPress,
  isThumbed,
  onOpenReport,
}: MessageBubbleControlsProps) {
  const [showCopyMenu, setShowCopyMenu] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const copyMenuRef = useRef<HTMLDivElement>(null)
  const downloadMenuRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (copyMenuRef.current && !copyMenuRef.current.contains(event.target as Node)) {
        setShowCopyMenu(false)
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false)
      }
    }

    if (showCopyMenu || showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCopyMenu, showDownloadMenu])

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setShowCopyMenu(false)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const handleCopyConversation = async () => {
    if (!allMessages || allMessages.length === 0) return

    try {
      const conversationText = allMessages
        .map((msg) => {
          const userName = msg.user?.firstName || 'User'
          return `**${userName}**:\n> ${msg.message}`
        })
        .join('\n\n')

      await navigator.clipboard.writeText(conversationText)
      setShowCopyMenu(false)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy conversation:', err)
    }
  }

  const handleExportAnswer = () => {
    // TODO: Implement export answer functionality
    setShowDownloadMenu(false)
  }

  const handleExportFullChat = () => {
    // TODO: Implement export full chat functionality
    setShowDownloadMenu(false)
  }

  const handleThumbsUp = () => {
    if (!isThumbed('thumbsDown')) {
      onThumbsPress('thumbsUp', conversationId, messageId)
    }
  }

  const handleThumbsDown = () => {
    if (!isThumbed('thumbsUp')) {
      if (onOpenReport) {
        onOpenReport({ conversationId, messageId })
      } else {
        onThumbsPress('thumbsDown', conversationId, messageId)
      }
    }
  }

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      onStopSpeaking()
    } else {
      onSpeak(message)
    }
  }

  return (
    <div className="flex items-center gap-3 mt-2">
      {/* Copy Menu */}
      <div className="relative" ref={copyMenuRef}>
        <button
          type="button"
          onClick={() => setShowCopyMenu(!showCopyMenu)}
          className="p-1.5 text-grey hover:text-text transition-colors"
          aria-label="Copy"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {showCopyMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-background-light rounded-lg shadow-lg border border-border py-2 min-w-[180px] z-50">
            <button
              type="button"
              onClick={handleCopyMessage}
              className="w-full px-4 py-2 text-left text-sm text-text hover:bg-background transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Copy message
            </button>
            <button
              type="button"
              onClick={handleCopyConversation}
              className="w-full px-4 py-2 text-left text-sm text-text hover:bg-background transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Copy conversation
            </button>
          </div>
        )}
      </div>

      {/* Download Menu */}
      <div className="relative" ref={downloadMenuRef}>
        <button
          type="button"
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          className="p-1.5 text-grey hover:text-text transition-colors"
          aria-label="Download"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
          </svg>
        </button>

        {showDownloadMenu && (
          <div className="absolute bottom-full left-0 mb-2 bg-background-light rounded-lg shadow-lg border border-border py-2 min-w-[180px] z-50">
            <button
              type="button"
              onClick={handleExportAnswer}
              className="w-full px-4 py-2 text-left text-sm text-text hover:bg-background transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Answer
            </button>
            <button
              type="button"
              onClick={handleExportFullChat}
              className="w-full px-4 py-2 text-left text-sm text-text hover:bg-background transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Export Full Chat
            </button>
          </div>
        )}
      </div>

      {/* Voice/Speaker Icon */}
      <button
        type="button"
        onClick={handleVoiceToggle}
        className="p-1.5 text-grey hover:text-text transition-colors"
        aria-label={isSpeaking ? 'Stop speaking' : 'Play audio'}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          {isSpeaking ? (
            <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
          ) : (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          )}
        </svg>
      </button>

      {/* Thumbs Up Icon */}
      {!isThumbed('thumbsDown') && (
        <button
          type="button"
          onClick={handleThumbsUp}
          className={cn(
            'p-1.5 transition-colors',
            isThumbed('thumbsUp') ? 'text-primary-dark' : 'text-grey hover:text-text'
          )}
          aria-label="Like"
        >
          <svg className="w-4 h-4" fill={isThumbed('thumbsUp') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </button>
      )}

      {/* Thumbs Down Icon */}
      {!isThumbed('thumbsUp') && (
        <button
          type="button"
          onClick={handleThumbsDown}
          className={cn(
            'p-1.5 transition-colors',
            isThumbed('thumbsDown') ? 'text-error-red' : 'text-grey hover:text-text'
          )}
          aria-label="Dislike"
        >
          <svg className="w-4 h-4" fill={isThumbed('thumbsDown') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
        </button>
      )}
    </div>
  )
}
