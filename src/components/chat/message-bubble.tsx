'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils/cn'
import type { MessageType } from '@/types'

interface MessageBubbleProps {
  message: MessageType
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'USER'
  const isAssistant = message.role === 'ASSISTANT'
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement download functionality
  }

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement audio playback functionality
  }

  return (
    <div
      className={cn(
        'flex w-full mb-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className="flex flex-col">
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-[#EBEBEB] text-[#1E1E1E] max-w-[90%] sm:max-w-[380px]'
              : 'bg-white text-[#1E1E1E] border border-[#EBEBEB] max-w-[95%] sm:max-w-[837px]'
          )}
        >
        {/* Message content */}
        {isAssistant ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className={cn(
                'text-sm leading-relaxed',
                '[&>p]:mb-2 [&>p]:last:mb-0',
                '[&>h1]:text-lg [&>h1]:font-bold [&>h1]:mb-2 [&>h1]:mt-4 [&>h1]:first:mt-0',
                '[&>h2]:text-base [&>h2]:font-bold [&>h2]:mb-2 [&>h2]:mt-4 [&>h2]:first:mt-0',
                '[&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:mt-3 [&>h3]:first:mt-0',
                '[&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2',
                '[&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2',
                '[&>li]:mb-1',
                '[&>code]:px-1.5 [&>code]:py-0.5 [&>code]:bg-white/50 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono',
                '[&>pre]:p-3 [&>pre]:bg-white/50 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-2',
                '[&>pre>code]:bg-transparent [&>pre>code]:p-0',
                '[&>strong]:font-semibold',
                '[&>em]:italic',
                '[&>a]:text-[#1A7A7A] [&>a]:underline [&>a]:hover:text-[#156666]',
                '[&>blockquote]:border-l-4 [&>blockquote]:border-[#EBEBEB] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-2',
                '[&>hr]:my-4 [&>hr]:border-[#EBEBEB]'
              )}
              components={{
                // Customize code blocks
                code({ inline, className, children, ...props }: any) {
                  return inline ? (
                    <code className="px-1.5 py-0.5 bg-white/50 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block p-3 bg-white/50 rounded-lg overflow-x-auto text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                },
                // Customize links
                a({ href, children, ...props }: any) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1A7A7A] underline hover:text-[#156666]"
                      {...props}
                    >
                      {children}
                    </a>
                  )
                },
              }}
            >
              {message.message}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
        )}

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
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

        {/* Interaction Icons - Only for AI messages, positioned below the bubble */}
        {isAssistant && (
          <div className="flex items-center gap-3 mt-2">
          {/* Download Icon */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 text-[#827F85] hover:text-[#1E1E1E] transition-colors"
            aria-label="Download"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
            </svg>
          </button>

          {/* Audio/Speaker Icon */}
          <button
            type="button"
            onClick={handleAudio}
            className="p-1.5 text-[#827F85] hover:text-[#1E1E1E] transition-colors"
            aria-label="Play audio"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>

          {/* Thumbs Up Icon */}
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              'p-1.5 transition-colors',
              isLiked ? 'text-[#1A7A7A]' : 'text-[#827F85] hover:text-[#1E1E1E]'
            )}
            aria-label="Like"
          >
            <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>

          {/* Thumbs Down Icon */}
          <button
            type="button"
            onClick={handleDislike}
            className={cn(
              'p-1.5 transition-colors',
              isDisliked ? 'text-[#E74C3C]' : 'text-[#827F85] hover:text-[#1E1E1E]'
            )}
            aria-label="Dislike"
          >
            <svg className="w-4 h-4" fill={isDisliked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
          </button>
        </div>
        )}
      </div>
    </div>
  )
}

function formatMessageTime(dateString?: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
