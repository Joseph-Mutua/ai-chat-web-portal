'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { useChatConversations } from '@/hooks/api/use-chat'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils/cn'
import logoImage from '@/assets/images/logo.png'
import type { IChatSession } from '@/types'

interface ConversationSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function ConversationSidebar({ isOpen = true, onClose }: ConversationSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showHistory, setShowHistory] = useState(false)

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatConversations({
    page: 1,
    limit: 20,
  })

  const conversations = data?.pages.flatMap((page) => page.data) || []
  const groupedConversations = groupConversationsByDate(conversations)

  const handleConversationClick = (id: string) => {
    router.push(`/chat/${id}`)
    onClose?.()
  }

  const handleNewChat = () => {
    router.push('/chat')
    onClose?.()
  }

  const handleChatHistory = () => {
    setShowHistory(!showHistory)
  }

  return (
    <>
      {/* Mobile overlay - only show on mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          'w-[280px] bg-white flex flex-col h-full transition-transform duration-300',
          // Mobile: fixed, slides in/out
          'fixed inset-y-0 left-0 z-50 lg:z-auto',
          // Desktop: static, always visible
          'lg:static lg:translate-x-0',
          // Mobile: toggle visibility
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <Image
            src={logoImage}
            alt="warpSpeed"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="text-[#1E1E1E] font-semibold text-lg">warpSpeed</span>
        </div>

        {/* Navigation */}
        <nav className="px-4 flex-1">
          {/* New Chat */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#1E1E1E] hover:bg-[#F4F5FA] rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">New Chat</span>
          </button>

          {/* Chat History */}
          <button
            onClick={handleChatHistory}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-[#1E1E1E] hover:bg-[#F4F5FA] rounded-xl transition-colors",
              showHistory && "bg-[#F4F5FA]"
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-medium">Chat History</span>
            <svg 
              className={cn("w-4 h-4 ml-auto transition-transform", showHistory && "rotate-180")} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Chat History List - Collapsible */}
          {showHistory && (
            <div className="ml-4 mt-2 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loading />
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-sm text-[#827F85] px-4 py-2">No conversations yet</p>
              ) : (
                <div className="space-y-1">
                  {Object.entries(groupedConversations).map(([date, convos]) => (
                    <div key={date}>
                      <p className="text-xs text-[#827F85] px-4 py-1 uppercase">{date}</p>
                      {convos.map((conversation) => {
                        const isActive = pathname === `/chat/${conversation.id}`
                        return (
                          <button
                            key={conversation.id}
                            onClick={() => handleConversationClick(conversation.id)}
                            className={cn(
                              'w-full px-4 py-2 text-left text-sm hover:bg-[#F4F5FA] rounded-lg transition-colors truncate',
                              isActive && 'bg-[#E8F5F5] text-[#1A7A7A]'
                            )}
                          >
                            {conversation.title || 'New Conversation'}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                  {hasNextPage && (
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full px-4 py-2 text-xs text-[#1A7A7A] hover:bg-[#F4F5FA] rounded-lg"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          <button
            onClick={() => {/* TODO: Navigate to settings */}}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#1E1E1E] hover:bg-[#F4F5FA] rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Settings</span>
          </button>

          {/* Help */}
          <button
            onClick={() => {/* TODO: Navigate to help */}}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#1E1E1E] hover:bg-[#F4F5FA] rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <circle cx="12" cy="17" r="0.5" fill="currentColor" />
            </svg>
            <span className="font-medium">Help</span>
          </button>
        </nav>

        {/* Upgrade Card */}
        <div className="p-4 mt-auto">
          <div className="bg-[#FFF8E1] rounded-2xl p-5">
            {/* Crown Icon in Inverted Pentagon Gem Shape */}
            <div className="flex justify-center mb-3">
              <div 
                className="w-12 h-12 bg-[#FFD54F] flex items-center justify-center"
                style={{ clipPath: 'polygon(18% 0%, 82% 0%, 100% 62%, 50% 100%, 0% 62%)' }}
              >
                <svg className="w-5 h-5 text-[#FF8F00]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                </svg>
              </div>
            </div>
            <h3 className="text-center font-semibold text-[#1E1E1E] mb-1">
              Upgrade Your Plan
            </h3>
            <p className="text-center text-xs text-[#827F85] mb-4">
              Enjoy more credits and use even more AI in your day!
            </p>
            <button className="w-full py-2.5 bg-white border border-[#EBEBEB] rounded-full text-sm font-medium text-[#1E1E1E] hover:bg-[#F4F5FA] transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </aside>
    </>
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
