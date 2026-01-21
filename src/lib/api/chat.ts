import { apiClient } from './base'
import type {
  InputQueryType,
  AIChatQueryResponseType,
  GetChatSessionRequestBody,
  GetChatsBySessionIdRequestBody,
  ChatSessionListType,
  GetChatsBySessionIdResponseType,
  SuggestionsResponseType,
} from '@/types'

export async function sendMessage(
  input: InputQueryType
): Promise<AIChatQueryResponseType> {
  const response = await apiClient.post<AIChatQueryResponseType>(
    '/ai-chat/message',
    input,
    { timeout: 120000 } // 2 minutes for chat responses
  )
  // Handle both wrapped and unwrapped responses
  return response.data?.data || response.data
}

export async function getConversations(
  params: GetChatSessionRequestBody
): Promise<ChatSessionListType> {
  const { page = 1, limit = 20, search } = params
  let url = `/ai-chat/conversations?page=${page}&limit=${limit}`
  if (search) {
    url += `&search=${encodeURIComponent(search)}`
  }
  const { data } = await apiClient.get<ChatSessionListType>(url)
  return data
}

export async function getConversationMessages(
  params: GetChatsBySessionIdRequestBody
): Promise<GetChatsBySessionIdResponseType> {
  const { chatConversationId, page = 1, limit = 50 } = params
  
  if (!chatConversationId) {
    throw new Error('Conversation ID is required')
  }
  
  const response = await apiClient.get<GetChatsBySessionIdResponseType>(
    `/ai-chat/conversations/${chatConversationId}?page=${page}&limit=${limit}`
  )
  // Handle both wrapped and unwrapped responses
  return response.data?.data || response.data
}

export async function getMessageCitations(
  conversationId: string,
  messageId: string
): Promise<unknown[]> {
  const { data } = await apiClient.get<unknown[]>(
    `/ai-chat/conversations/${conversationId}/messages/${messageId}/citations`
  )
  return data
}

export async function reportMessage(
  conversationId: string,
  messageId: string,
  params: { reason?: string; feedback?: string }
): Promise<void> {
  await apiClient.post(
    `/ai-chat/conversations/${conversationId}/messages/${messageId}/report`,
    params
  )
}

export async function downloadConversation(
  conversationId: string,
  params: {
    name: string
    type: 'pdf' | 'docx'
    content?: string
    messageId?: string
  }
): Promise<Blob> {
  const accept =
    params.type === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  const { data } = await apiClient.post(
    `/ai-chat/conversations/${conversationId}/download`,
    params,
    {
      responseType: 'blob',
      headers: { Accept: accept },
    }
  )
  return data
}

export async function getSuggestions(): Promise<SuggestionsResponseType> {
  const { data } = await apiClient.get<SuggestionsResponseType>('/query/suggestions')
  return data
}
