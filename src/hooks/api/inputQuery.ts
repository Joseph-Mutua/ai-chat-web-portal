import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
} from '@tanstack/react-query'

import { useFeatureFlag } from '@/hooks/useFeatureFlag'

import type {
  AIChatQueryResponseType,
  GetChatSessionRequestBody,
  GetChatsBySessionIdRequestBody,
  GetChatsBySessionIdResponseType,
  InputQueryType,
  TConversationResponse,
} from '@/types'

import {
  downloadChatAI,
  getChatConversationMessages,
  getChatConversations,
  inputQuery,
  reportChatMessage,
} from '@/services/api'

export function usePromptChatAI() {
  const isFoundationLayerAI = useFeatureFlag('foundationLayerAi')

  const inputQueryMutation = useMutation<
    AIChatQueryResponseType,
    Error,
    InputQueryType,
    unknown
  >({
    mutationFn: (params) => inputQuery(params, isFoundationLayerAI),
  })

  return inputQueryMutation
}

export function useChatConversationMessagesQuery(
  params: GetChatsBySessionIdRequestBody
) {
  const isFoundationLayerAI = useFeatureFlag('foundationLayerAi')

  return useInfiniteQuery({
    queryKey: ['chat-ai-conversation-messages', params],
    queryFn: ({ pageParam = 1 }) => {
      const currentLimit = params.limit
      const updatedParams = {
        ...params,
        page: pageParam,
        limit: currentLimit,
      }
      return getChatConversationMessages(updatedParams, isFoundationLayerAI)
    },
    enabled: !!params.chatConversationId,
    initialPageParam: 1,
    getNextPageParam: (lastData: GetChatsBySessionIdResponseType) => {
      if (
        lastData.pagination.pageSize * lastData.pagination.page >=
        lastData.pagination.totalCount
      ) {
        return undefined
      }
      return lastData.pagination.page + 1
    },
    placeholderData: keepPreviousData,
  })
}

export function useChatConversations(params: GetChatSessionRequestBody) {
  return useInfiniteQuery({
    queryKey: ['chat-ai-conversations', params],
    queryFn: ({ pageParam = 1 }) => {
      const currentLimit = params.limit
      const updatedParams = {
        ...params,
        page: pageParam,
        limit: currentLimit,
      }
      return getChatConversations(updatedParams)
    },
    initialPageParam: 1,
    getNextPageParam: (
      lastData: TConversationResponse,
      pages: TConversationResponse[]
    ) => {
      if (lastData?.data?.length < params?.limit) {
        return undefined
      }
      return pages.length + 1
    },
    placeholderData: keepPreviousData,
  })
}

export function useChatReportMessage() {
  return useMutation<
    unknown,
    Error,
    {
      conversationId: string
      messageId: string
      params: { reason: string; feedback: string }
    }
  >({
    mutationFn: reportChatMessage,
  })
}

export function useDownloadChatAI() {
  return useMutation<
    unknown,
    Error,
    {
      conversationId: string
      params: Record<string, string>
    }
  >({
    mutationFn: ({ conversationId, params }) =>
      downloadChatAI(conversationId, params),
  })
}
