'use client'

import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import {
  sendMessage,
  getConversations,
  getConversationMessages,
  getSuggestions,
  reportMessage,
} from '@/lib/api/chat'
import type {
  InputQueryType,
  GetChatSessionRequestBody,
  GetChatsBySessionIdRequestBody,
} from '@/types'

export function useChatConversations(params: GetChatSessionRequestBody) {
  return useInfiniteQuery({
    queryKey: ['chat-conversations', params],
    queryFn: ({ pageParam = 1 }) =>
      getConversations({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.pagination.totalPages
      const currentPage = allPages.length
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
  })
}

export function useConversationMessages(
  params: GetChatsBySessionIdRequestBody
) {
  return useInfiniteQuery({
    queryKey: ['conversation-messages', params.chatConversationId],
    queryFn: ({ pageParam = 1 }) =>
      getConversationMessages({ ...params, page: pageParam }),
    enabled: !!params.chatConversationId,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.pagination.totalPages
      const currentPage = allPages.length
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
  })
}

export function useSendMessage() {
  return useMutation({
    mutationFn: (input: InputQueryType) => sendMessage(input),
  })
}

export function useChatSuggestions() {
  return useQuery({
    queryKey: ['chat-suggestions'],
    queryFn: getSuggestions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useReportMessage() {
  return useMutation({
    mutationFn: ({
      conversationId,
      messageId,
      ...params
    }: {
      conversationId: string
      messageId: string
      reason?: string
      feedback?: string
    }) => reportMessage(conversationId, messageId, params),
  })
}
