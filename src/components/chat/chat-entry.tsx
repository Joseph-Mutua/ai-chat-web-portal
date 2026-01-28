'use client'

import { memo } from 'react'
import { useChatInput } from '@/hooks/use-chat-input'
import { ChatInputBase } from './chat-input-base'

interface ChatEntryProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export const ChatEntry = memo(function ChatEntry({ onSendMessage, isLoading = false }: ChatEntryProps) {
  const { message, setMessage, textareaRef, handleSubmit, handleKeyDown } = useChatInput({
    onSubmit: onSendMessage,
    disabled: isLoading,
    autoResize: false,
  })

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-3xl lg:text-5xl text-text">Hello there !</h1>
        <p className="text-base lg:text-2xl font-normal text-text">
          I&apos;m your AI chat assistant. Ask me anything to begin!
        </p>

        <div className="mt-8">
          <ChatInputBase
            message={message}
            onMessageChange={setMessage}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            textareaRef={textareaRef}
            isLoading={isLoading}
            placeholder="Ask me anything"
            containerClassName="mx-auto w-full max-w-sm h-11 lg:max-w-2xl lg:h-12"
            inputClassName="max-h-11 lg:max-h-12 overflow-hidden pl-2 lg:pl-5 py-3 lg:py-3.5"
          />
        </div>
      </div>
    </div>
  )
})
