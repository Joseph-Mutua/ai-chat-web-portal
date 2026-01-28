'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'

interface ChatInputBaseProps {
  message: string
  onMessageChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  isLoading?: boolean
  placeholder?: string
  containerClassName?: string
  inputClassName?: string
  showAttachment?: boolean
  showVoice?: boolean
  onAttachmentClick?: () => void
  onVoiceClick?: () => void
}

const AttachmentIcon = memo(function AttachmentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  )
})

const MicrophoneIcon = memo(function MicrophoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  )
})

const SendIcon = memo(function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('rotate-45', className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
})

const LoadingSpinner = memo(function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin', className)} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
})

export const ChatInputBase = memo(function ChatInputBase({
  message,
  onMessageChange,
  onSubmit,
  onKeyDown,
  textareaRef,
  isLoading = false,
  placeholder = 'Ask me anything',
  containerClassName,
  inputClassName,
  showAttachment = true,
  showVoice = true,
  onAttachmentClick,
  onVoiceClick,
}: ChatInputBaseProps) {
  const hasMessage = message.trim().length > 0

  return (
    <form onSubmit={onSubmit} role="form" aria-label="Chat message form">
      <div className={cn(
        'relative flex items-center bg-background-light border border-border-input rounded-full lg:rounded-xl shadow-input',
        containerClassName
      )}>
        {showAttachment && (
          <button
            type="button"
            className="lg:hidden flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ml-2 border border-secondary bg-transparent"
            onClick={onAttachmentClick}
            aria-label="Add attachment"
          >
            <AttachmentIcon className="w-4 h-4 text-secondary" />
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          aria-label="Message input"
          className={cn(
            'flex-1 py-3 lg:py-4 bg-transparent resize-none',
            'focus:outline-none placeholder:text-text-placeholder text-text',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'max-h-input overflow-y-auto text-sm lg:text-base',
            'pl-2 lg:pl-4',
            inputClassName
          )}
        />

        <div className="flex items-center gap-1 pr-2 lg:pr-3">
          {showVoice && !hasMessage && (
            <button
              type="button"
              className="lg:hidden flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors bg-gradient-to-tr from-primary to-secondary"
              onClick={onVoiceClick}
              aria-label="Voice input"
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
          )}

          {hasMessage && (
            <button
              type="submit"
              disabled={isLoading}
              className="lg:hidden flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors bg-gradient-to-tr from-primary to-secondary disabled:opacity-50"
              aria-label="Send message"
            >
              {isLoading ? <LoadingSpinner className="w-4 h-4" /> : <SendIcon className="w-4 h-4" />}
            </button>
          )}

          {showAttachment && (
            <button
              type="button"
              className="hidden lg:flex flex-shrink-0 p-2 text-grey hover:text-text transition-colors"
              onClick={onAttachmentClick}
              aria-label="Add attachment"
            >
              <AttachmentIcon className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          )}

          {showVoice && (
            <button
              type="button"
              className="hidden lg:flex flex-shrink-0 p-2 text-grey hover:text-text transition-colors"
              onClick={onVoiceClick}
              aria-label="Voice input"
            >
              <MicrophoneIcon className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          )}

          <button
            type="submit"
            disabled={!hasMessage || isLoading}
            className={cn(
              'hidden lg:flex flex-shrink-0 w-10 h-10 lg:w-11 lg:h-11 rounded-full items-center justify-center transition-colors',
              hasMessage && !isLoading
                ? 'bg-primary-dark text-white hover:bg-primary-darker'
                : 'bg-primary-dark text-white opacity-70'
            )}
            aria-label="Send message"
          >
            {isLoading ? <LoadingSpinner className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </form>
  )
})
