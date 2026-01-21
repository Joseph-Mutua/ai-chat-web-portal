'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useChatConversations } from '@/hooks/api/use-chat'
import { Loading } from '@/components/ui/loading'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import type { IChatSession } from '@/types'

export function ConversationSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatConversations({
    page: 1,
    limit: 20,
    search: search || undefined,
  })

  const conversations =
    data?.pages.flatMap((page) => page.data) || []

  const groupedConversations = groupConversationsByDate(conversations)

  const handleConversationClick = (id: string) => {
    router.push(`/chat/${id}`)
  }

  const handleNewChat = () => {
    router.push('/chat')
  }

  return (
    <div className="w-80 border-r border-border-light bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">Conversations</h2>
          <button
            onClick={handleNewChat}
            className="p-2 rounded-lg hover:bg-background transition-colors"
            title="New chat"
          >
            <svg
              className="w-5 h-5 text-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        {isSearchOpen ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearch('')
                }}
                className="p-1 hover:bg-background rounded"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                autoFocus
                className="flex-1"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full px-4 py-2 text-left text-sm text-text-secondary bg-background rounded-lg border border-border-light hover:bg-grey-light transition-colors"
          >
            Search conversations...
          </button>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loading />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            <p>No conversations yet</p>
            <p className="text-sm mt-2">Start a new chat to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {Object.entries(groupedConversations).map(([date, convos]) => (
              <div key={date}>
                <div className="px-4 py-2 text-xs font-medium text-text-secondary uppercase bg-background">
                  {date}
                </div>
                {convos.map((conversation) => {
                  const isActive = pathname === `/chat/${conversation.id}`
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-background transition-colors',
                        isActive && 'bg-primary-light border-l-4 border-primary'
                      )}
                    >
                      <div className="font-medium text-text truncate">
                        {conversation.title || 'New Conversation'}
                      </div>
                      {conversation.lastMessage && (
                        <div className="text-sm text-text-secondary truncate mt-1">
                          {conversation.lastMessage}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasNextPage && (
          <div className="p-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full px-4 py-2 text-sm text-primary hover:bg-background rounded-lg border border-border-light disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function groupConversationsByDate(conversations: IChatSession[]) {
  const groups: Record<string, IChatSession[]> = {}
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  conversations.forEach((conv) => {
    const date = new Date(conv.updatedAt || conv.createdAt)
    date.setHours(0, 0, 0, 0)

    let label = ''
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      label = 'Today'
    } else if (diffDays === 1) {
      label = 'Yesterday'
    } else if (diffDays < 7) {
      label = date.toLocaleDateString('en-US', { weekday: 'long' })
    } else if (diffDays < 30) {
      label = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    } else {
      label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    if (!groups[label]) {
      groups[label] = []
    }
    groups[label].push(conv)
  })

  return groups
}
