'use client'

import React from 'react'
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

  return (
    <div
      className={cn(
        'flex w-full mb-6',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-white'
            : 'bg-white border border-border-light text-text'
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
                '[&>code]:px-1.5 [&>code]:py-0.5 [&>code]:bg-background [&>code]:rounded [&>code]:text-sm [&>code]:font-mono',
                '[&>pre]:p-3 [&>pre]:bg-background [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-2',
                '[&>pre>code]:bg-transparent [&>pre>code]:p-0',
                '[&>strong]:font-semibold',
                '[&>em]:italic',
                '[&>a]:text-primary [&>a]:underline [&>a]:hover:text-primary/80',
                '[&>blockquote]:border-l-4 [&>blockquote]:border-grey-light [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-2',
                '[&>hr]:my-4 [&>hr]:border-border-light'
              )}
              components={{
                // Customize code blocks
                code({ inline, className, children, ...props }: any) {
                  return inline ? (
                    <code className="px-1.5 py-0.5 bg-background rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block p-3 bg-background rounded-lg overflow-x-auto text-sm font-mono" {...props}>
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
                      className="text-primary underline hover:text-primary/80"
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
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        )}

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border-light">
            <div className="text-xs font-medium mb-2">Sources:</div>
            <div className="space-y-1">
              {message.citations.map((citation, idx) => (
                <a
                  key={idx}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline block truncate"
                >
                  {citation.title || citation.source || citation.url}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div
          className={cn(
            'text-xs mt-2 opacity-70',
            isUser ? 'text-white' : 'text-text-secondary'
          )}
        >
          {formatMessageTime(message.createdAt || message.date)}
        </div>
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
