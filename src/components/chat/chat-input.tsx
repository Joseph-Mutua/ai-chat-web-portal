'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils/cn'
import { useChatInput } from '@/hooks/use-chat-input'
import { ChatInputBase } from './chat-input-base'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  placeholder?: string
  isMobile?: boolean
}

export const ChatInput = memo(function ChatInput({
  onSend,
  isLoading = false,
  placeholder = 'Ask me anything',
  isMobile = false,
}: ChatInputProps) {
  const { message, setMessage, textareaRef, handleSubmit, handleKeyDown } = useChatInput({
    onSubmit: onSend,
    disabled: isLoading,
  })

  return (
    <div className="p-4 lg:px-8">
      <div className={cn('max-w-3xl mx-auto', isMobile ? 'px-0' : 'px-4')}>
        <ChatInputBase
          message={message}
          onMessageChange={setMessage}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          textareaRef={textareaRef}
          isLoading={isLoading}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
})
