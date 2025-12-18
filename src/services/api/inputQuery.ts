import type {
  AIChatQueryResponseType,
  ChatAIQuery,
  ChatSessionListType,
  GetChatSessionRequestBody,
  GetChatsBySessionIdRequestBody,
  GetChatsBySessionIdResponseType,
  InputQueryType,
  SuggestionsResponseType,
} from '@/types'

import { instance } from './base'

async function inputQuery(
  inputQuery: InputQueryType,
  isFoundationLayerAI: boolean
): Promise<AIChatQueryResponseType> {
  const { data } = await instance.post(
    `/${isFoundationLayerAI ? 'ai-chat' : 'chat-ai'}/message`,
    inputQuery,
    { timeout: 1000 * 120 }
  )

  // Transform the response to match AIChatQueryResponseType if it's from old chat-ai
  return isFoundationLayerAI
    ? data
    : {
      id: data?.responseMessages?.[0]?.id ?? '',
      conversationId: data?.conversation?.id ?? '',
      message: data?.responseMessages?.[0]?.message ?? '',
      metadata: {
        role: data?.responseMessages?.[0]?.role ?? 'USER',
        finishReason: '', // old version does not have finishReason
        citations: data?.responseMessages?.[0]?.citations,
      },
      promptFeedback: null, // old version does not have promptFeedback
      usageMetadata: {
        creditsUsed: 0, // old version does not have creditsUsed
      },
      createdAt: '', // old version does not have createdAt
      attachments: data?.responseMessages?.[0]?.attachments ?? [],
    }
}

async function inputQuerySuggestions(): Promise<SuggestionsResponseType> {
  const { data } = await instance.get('/query/suggestions')
  return data
}

async function getChatConversationMessages(
  params: GetChatsBySessionIdRequestBody,
  isFoundationLayerAI: boolean
): Promise<GetChatsBySessionIdResponseType> {
  const { page, limit } = params

  // Determine the base URL based on the feature flag whether tailing /messages is needed or not
  const baseURL = isFoundationLayerAI
    ? `/ai-chat/conversations/${params.chatConversationId}`
    : `/chat-ai/conversations/${params.chatConversationId}/messages`

  const URL = `${baseURL}?page=${page}&limit=${limit}`

  const { data } = await instance.get(URL)

  // Transform the response to match GetChatsBySessionIdResponseType if it's from old chat-ai
  return isFoundationLayerAI
    ? data
    : {
      userId: '',
      id: '',
      messages: data.data.map((message: ChatAIQuery) => ({
        ...message,
        metadata: { citations: message.citations, role: message.role },
      })),
      pagination: data.pagination,
    }
}

async function getChatConversations(
  params: GetChatSessionRequestBody
): Promise<ChatSessionListType> {
  const { page, limit } = params

  let URL = `/ai-chat/conversations?page=${page}&limit=${limit}`

  if (params.search) {
    URL += `&search=${params.search}`
  }

  const { data } = await instance.get(URL)
  return data
}

async function reportChatMessage({
  conversationId,
  messageId,
  params,
}: {
  conversationId: string
  messageId: string
  params: { reason?: string; feedback?: string }
}) {
  const { data } = await instance.post(
    `/ai-chat/conversations/${conversationId}/messages/${messageId}/report`,
    { ...params }
  )
  return data
}

async function downloadChatAI(
  conversationId: string,
  params: Record<string, string>
) {
  const accept =
    params.type === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  const res = await instance.post<ArrayBuffer>(
    `/ai-chat/conversations/${conversationId}/download`,
    params,
    {
      responseType: 'arraybuffer',
      headers: { Accept: accept },
      transformResponse: (r) => r,
    }
  )
  return res.data
}

export {
  getChatConversationMessages,
  getChatConversations,
  inputQuery,
  inputQuerySuggestions,
  reportChatMessage,
  downloadChatAI,
}
