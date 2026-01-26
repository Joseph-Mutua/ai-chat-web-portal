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
    messageId?: string
  }
): Promise<Blob> {
  const accept =
    params.type === 'pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  try {
    // Build minimal request body - API rejects 'content' field
    // Send only: { name, type, messageId? }
    // API determines export type from messageId presence:
    // - messageId present = Export Answer
    // - messageId absent = Export Full Chat
    const requestBody: Record<string, string> = {
      name: String(params.name),
      type: String(params.type),
    }

    // Include messageId only when exporting a specific message (Export Answer)
    if (params.messageId) {
      requestBody.messageId = String(params.messageId)
    }

    const response = await apiClient.post(
      `/ai-chat/conversations/${conversationId}/download`,
      requestBody,
      {
        responseType: 'blob',
        headers: { Accept: accept },
        validateStatus: (status) => status < 500, // Don't throw on 4xx, we'll handle it
      }
    )

    // Check if response status indicates an error
    if (response.status >= 400) {
      // Try to read error message from blob response
      if (response.data instanceof Blob) {
        const errorText = await response.data.text()
        try {
          const errorJson = JSON.parse(errorText)
          throw new Error(errorJson.message || errorJson.error || 'Download failed')
        } catch (parseError) {
          throw new Error(errorText || `Download failed with status ${response.status}`)
        }
      }
      throw new Error(`Download failed with status ${response.status}`)
    }

    // Check if response is actually an error JSON (sometimes API returns JSON as blob)
    const blob = response.data
    if (blob.type && blob.type.includes('json')) {
      const errorText = await blob.text()
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.success === false || errorJson.error || errorJson.message) {
          throw new Error(errorJson.message || errorJson.error || 'Download failed')
        }
      } catch (parseError) {
        // If it's not valid JSON, it might be the actual file
      }
    }

    return blob
  } catch (error: any) {
    // Handle blob error responses
    if (error.response?.data instanceof Blob) {
      const errorText = await error.response.data.text()
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(errorJson.message || errorJson.error || 'Download failed')
      } catch (parseError) {
        throw new Error(errorText || 'Download failed')
      }
    }
    // If error already has a message, use it
    if (error.message) {
      throw error
    }
    throw new Error(error?.response?.data?.message || 'Download failed')
  }
}

export async function getSuggestions(): Promise<SuggestionsResponseType> {
  const { data } = await apiClient.get<SuggestionsResponseType>('/query/suggestions')
  return data
}
