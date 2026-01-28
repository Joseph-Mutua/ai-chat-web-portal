'use client'

import { useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { useQueries } from '@tanstack/react-query'
import { useChatConversations } from '@/hooks/api/use-chat'
import { getConversationMessages } from '@/lib/api/chat'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils/cn'
import { AccountDetailsModal } from './account-details-modal'
import logoImage from '@/assets/images/logo.png'
import type { IChatSession } from '@/types'


function generateConversationTitle(message: string | undefined | null): string {
  if (!message || message.trim() === '') {
    return 'New Conversation'
  }
  
  let cleanMessage = message
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
  
  if (cleanMessage.length > 50) {
    cleanMessage = cleanMessage.substring(0, 50).trim() + '...'
  }
  
  return cleanMessage || 'New Conversation'
}

interface ConversationSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function ConversationSidebar({ isOpen = true, onClose }: ConversationSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showHistory, setShowHistory] = useState(false)
  const [isAccountDetailsModalOpen, setIsAccountDetailsModalOpen] = useState(false)

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


  const conversationsNeedingTitles = useMemo(() => {
    return conversations.filter(conv => !conv.title && !conv.lastMessage)
  }, [conversations])

  // Fetch first message for conversations without titles
  const firstMessageQueries = useQueries({
    queries: conversationsNeedingTitles.map((conv) => ({
      queryKey: ['conversation-first-message', conv.id],
      queryFn: async () => {
        try {
          const response = await getConversationMessages({
            chatConversationId: conv.id,
            page: 1,
            limit: 1,
          })
        
          const firstUserMessage = response.messages.find(
            (msg: any) => msg.role === 'USER' || msg.metadata?.role === 'USER'
          )
          return { conversationId: conv.id, firstMessage: firstUserMessage?.message || null }
        } catch (error) {
          return { conversationId: conv.id, firstMessage: null }
        }
      },
      enabled: !!conv.id && !conv.title && !conv.lastMessage,
      staleTime: 5 * 60 * 1000,
    })),
  })

  const firstMessagesMap = useMemo(() => {
    const map: Record<string, string | null> = {}
    firstMessageQueries.forEach((query) => {
      if (query.data) {
        map[query.data.conversationId] = query.data.firstMessage
      }
    })
    return map
  }, [firstMessageQueries])

  const handleConversationClick = (id: string) => {
    router.push(`/chat/${id}`)
    onClose?.()
  }

  const handleNewChat = () => {
    router.replace(`/chat?new=${Date.now()}`)
    onClose?.()
  }

  const handleChatHistory = () => {
    setShowHistory(!showHistory)
  }

  return (
    <>
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          'w-[280px] bg-white flex flex-col h-full transition-transform duration-300',
      
          'fixed inset-y-0 right-0 z-50',
        
          'lg:static lg:left-0 lg:right-auto lg:z-auto',
      
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header with Logo and Close Button */}
        <div className="p-5 flex items-center justify-between">
          {/* Logo and Name - Desktop Only */}
          <div className="hidden lg:flex items-center gap-3">
            <Image
              src={logoImage}
              alt="warpSpeed"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="text-text font-semibold text-lg">warpSpeed</span>
          </div>
    
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-text hover:bg-background rounded-lg transition-colors ml-auto"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="hidden lg:block mx-2 border-b-2 border-background" />

        <nav className="px-4 flex-1">
        
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 text-text hover:bg-background rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-black text-base font-normal leading-[14px] tracking-normal">New Chat</span>
          </button>

          {/* Chat History */}
          <button
            onClick={handleChatHistory}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-text hover:bg-background rounded-xl transition-colors",
              showHistory && "bg-background"
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-black text-base font-normal leading-[14px] tracking-normal">Chat History</span>
            <svg 
              className={cn("w-4 h-4 ml-auto transition-transform", showHistory && "rotate-180")} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showHistory && (
            <div className="ml-4 mt-2 max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loading />
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-sm text-grey px-4 py-2">No conversations yet</p>
              ) : (
                <div className="space-y-1">
                  {Object.entries(groupedConversations).map(([date, convos]) => (
                    <div key={date}>
                      <p className="text-xs text-grey px-4 py-1 uppercase">{date}</p>
                      {convos.map((conversation) => {
                        const isActive = pathname === `/chat/${conversation.id}`
                        // Get title: use conversation.title, or lastMessage, or fetch first message
                        const title = conversation.title 
                          || conversation.lastMessage 
                          || firstMessagesMap[conversation.id] 
                          || null
                        return (
                          <button
                            key={conversation.id}
                            onClick={() => handleConversationClick(conversation.id)}
                            className={cn(
                              'w-full px-4 py-2 text-left text-sm hover:bg-background rounded-lg transition-colors truncate',
                              isActive && 'bg-primary-light text-primary-dark'
                            )}
                          >
                            {generateConversationTitle(title)}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                  {hasNextPage && (
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full px-4 py-2 text-xs text-primary-dark hover:bg-background rounded-lg"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings / Account Details */}
          <button
            onClick={() => {
      
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setIsAccountDetailsModalOpen(true)
                onClose?.()
              } else {
                // TODO: Navigate to settings
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-text hover:bg-background rounded-xl transition-colors"
          >
  
            <svg className="w-5 h-5 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 19c0-3.314 2.686-6 6-6s6 2.686 6 6" />
            </svg>
         
            <svg className="w-5 h-5 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-black text-base font-normal leading-[14px] tracking-normal lg:hidden">Account Details</span>
            <span className="text-black text-base font-normal leading-[14px] tracking-normal hidden lg:inline">Settings</span>
          </button>

          {/* Help */}
          <button
            onClick={() => {/* TODO: Navigate to help */}}
            className="w-full flex items-center gap-3 px-4 py-3 text-text hover:bg-background rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
              <circle cx="12" cy="17" r="0.5" fill="currentColor" />
            </svg>
            <span className="text-black text-base font-normal leading-[14px] tracking-normal">Help</span>
          </button>
        </nav>


        <div className="p-4 mt-auto">
          <div className="bg-gold-upgrade-bg rounded-2xl p-5">
      
            <div className="flex justify-center mb-3">
            
              <div className="relative">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gemGradient" x1="28" y1="4" x2="28" y2="52" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFE082" />
                      <stop offset="15%" stopColor="#FFD54F" />
                      <stop offset="40%" stopColor="#FFC107" />
                      <stop offset="70%" stopColor="#FFB300" />
                      <stop offset="100%" stopColor="#FFA000" />
                    </linearGradient>
                  </defs>
                  
              
                  <path 
                    d="M10 6H46L52 26L28 52L4 26L10 6Z" 
                    fill="url(#gemGradient)"
                  />
                  
                
                  <path 
                    d="M10 6H46L52 26H4L10 6Z" 
                    fill="rgba(255,255,255,0.12)"
                  />
                  
                  <path d="M8 22H48" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                  <path d="M14 32H42" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <path d="M20 40H36" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  
                  <path 
                    d="M10 6L4 26L28 52V6H10Z" 
                    fill="rgba(0,0,0,0.04)"
                  />
                  
                  <g transform="translate(16, 14)">
                    <path 
                      d="M4 14L2 5L7 9L12 4L17 9L22 5L20 14H4Z" 
                      fill="white"
                    />
                    <rect x="4" y="15" width="16" height="3" rx="1" fill="white" />
                  </g>
                </svg>
              </div>
            </div>
            <h3 className="text-center font-semibold text-xl mb-1 text-base">
              Upgrade Your Plan
            </h3>
            <p className="text-center text-text text-sm text-grey mb-4 leading-relaxed">
              Enjoy more credits and use <br/> even more AI in your day!
            </p>
            <button className="w-full py-2.5 bg-background-light rounded-full text-sm font-medium text-text hover:bg-background transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </aside>

      <AccountDetailsModal
        isOpen={isAccountDetailsModalOpen}
        onClose={() => {
          setIsAccountDetailsModalOpen(false)
        }}
      />
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
