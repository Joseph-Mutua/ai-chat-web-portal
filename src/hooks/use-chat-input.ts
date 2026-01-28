'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface UseChatInputOptions {
  maxHeight?: number
  autoResize?: boolean
  onSubmit?: (message: string) => void
  disabled?: boolean
}

interface UseChatInputReturn {
  message: string
  setMessage: (value: string) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  handleSubmit: (e: React.FormEvent) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  isEmpty: boolean
  clearMessage: () => void
}

export function useChatInput({
  maxHeight = 120,
  autoResize = true,
  onSubmit,
  disabled = false,
}: UseChatInputOptions = {}): UseChatInputReturn {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!autoResize || !textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
  }, [message, autoResize, maxHeight])

  const clearMessage = useCallback(() => {
    setMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSubmit?.(message.trim())
      clearMessage()
    }
  }, [message, disabled, onSubmit, clearMessage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (message.trim() && !disabled) {
        onSubmit?.(message.trim())
        clearMessage()
      }
    }
  }, [message, disabled, onSubmit, clearMessage])

  return {
    message,
    setMessage,
    textareaRef,
    handleSubmit,
    handleKeyDown,
    isEmpty: !message.trim(),
    clearMessage,
  }
}
