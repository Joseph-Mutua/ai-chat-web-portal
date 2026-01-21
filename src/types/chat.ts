export interface IChatSession {
  id: string
  userId: string
  title?: string
  createdAt: string
  updatedAt: string
  lastMessage?: string
  lastMessageAt?: string
}

export interface MessageType {
  id: string
  message: string
  role: 'USER' | 'ASSISTANT'
  type?: 'message' | 'assistant'
  date?: string
  createdAt: string
  conversationId?: string
  metadata?: MessageMetadata
  attachments?: Attachment[]
  citations?: Citation[]
  user?: {
    firstName: string
    me: boolean
  }
}

export interface MessageMetadata {
  role: 'USER' | 'ASSISTANT'
  citations?: Citation[]
  finishReason?: string
}

export interface Citation {
  source?: string
  title?: string
  url?: string
  snippet?: string
  [key: string]: unknown
}

export interface Attachment {
  id: string
  objectPath: string
  originalFilename: string
  mimetype: string
  size: number
  url?: string
}

export interface InputQueryType {
  message: string
  conversationId?: string
  uploadedAttachments?: UploadedAttachment[]
  appContext?: {
    screen: string
    params?: Record<string, unknown>
    data?: Record<string, unknown>
  }
  attachmentIds?: string[]
}

export interface UploadedAttachment {
  objectPath: string
  originalFilename: string
  mimetype: string
  size: number
}

export interface AIChatQueryResponseType {
  id: string
  conversationId: string
  message: string
  metadata: MessageMetadata
  promptFeedback?: unknown
  usageMetadata?: {
    creditsUsed: number
  }
  createdAt: string
  attachments?: Attachment[]
}

export interface GetChatSessionRequestBody {
  page?: number
  limit?: number
  search?: string
}

export interface GetChatsBySessionIdRequestBody {
  chatConversationId: string
  page: number
  limit: number
}

export interface ChatSessionListType {
  data: IChatSession[]
  pagination: PaginationType
}

export interface GetChatsBySessionIdResponseType {
  id: string
  userId: string
  messages: MessageType[]
  pagination: PaginationType
}

export interface PaginationType {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface SuggestionsResponseType {
  suggestions: string[]
}

export interface TConversationResponse {
  data: IChatSession[]
  pagination: PaginationType
}
