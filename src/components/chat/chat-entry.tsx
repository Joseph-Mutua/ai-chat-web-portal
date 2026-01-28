'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils/cn'

interface ChatEntryProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export function ChatEntry({ onSendMessage, isLoading = false }: ChatEntryProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Keep textarea at single line height for the entry input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Welcome text */}
        <h1 className="text-3xl lg:text-5xl text-text">
          Hello there !
        </h1>
        <p className="text-base lg:text-2xl font-normal text-text">
          I&apos;m your AI chat assistant. Ask me anything to begin!
        </p>

        {/* Centered Input */}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="relative flex items-center bg-background-light mx-auto w-full max-w-sm h-11 lg:max-w-2xl lg:h-12 shadow-input border border-border-input rounded-full lg:rounded-xl">
            {/* Attachment Button - Mobile (outlined) */}
            <button
              type="button"
              className="lg:hidden flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ml-2 border border-secondary bg-transparent"
              onClick={() => {/* TODO: Handle attachment */}}
            >
              <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything"
              disabled={isLoading}
              rows={1}
              className={cn(
                'flex-1 py-3 lg:py-3.5 bg-transparent resize-none',
                'focus:outline-none placeholder:text-text-placeholder text-text',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'max-h-11 lg:max-h-12 overflow-hidden text-sm lg:text-base',
                'pl-2 lg:pl-5'
              )}
            />

            {/* Right side buttons */}
            <div className="flex items-center gap-1 pr-2 lg:pr-3">
              {/* Mobile: Microphone Button (only when message is empty) */}
              {!message.trim() && (
                <button
                  type="button"
                  className="lg:hidden flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors bg-gradient-to-tr from-primary to-secondary"
                  onClick={() => {/* TODO: Handle voice input */}}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}

              {/* Mobile: Send Button (only when message has text) */}
              {message.trim() && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="lg:hidden flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors bg-gradient-to-tr from-primary to-secondary"
                >
                  {isLoading ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              )}

              {/* Desktop: Attachment Button (moved to right side, next to microphone) */}
              <button
                type="button"
                className="hidden lg:flex flex-shrink-0 p-2 text-grey hover:text-text transition-colors"
                onClick={() => {/* TODO: Handle attachment */}}
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Desktop: Microphone Button */}
              <button
                type="button"
                className="hidden lg:flex flex-shrink-0 p-2 text-grey hover:text-text transition-colors"
                onClick={() => {/* TODO: Handle voice input */}}
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* Desktop: Send Button */}
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className={cn(
                  "hidden lg:flex flex-shrink-0 w-10 h-10 lg:w-11 lg:h-11 rounded-full items-center justify-center transition-colors",
                  message.trim() && !isLoading
                    ? "bg-primary-dark text-white hover:bg-primary-darker"
                    : "bg-primary-dark text-white opacity-70"
                )}
              >
                {isLoading ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
