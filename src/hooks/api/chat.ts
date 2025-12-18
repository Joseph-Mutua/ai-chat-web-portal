import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query'

import type {
  AddChatMembersType,
  ChatUserType,
  GetChatMessagesBody,
  GetChatRequestBody,
  GetUserReactionsType,
  MessagesResponseType,
  RequestCreateChatType,
  TChatSettingResponse,
} from '@/types'

import {
  addChatMembers,
  createChat,
  createChatMessage,
  deleteChat,
  getChatDetails,
  getChatList,
  getChatMessages,
  getChatSources,
  getNewChatUserList,
  getSearchChatList,
  getUserReactionsByMessage,
  quickResponse,
  updateChatSetting,
  updateMessage,
} from '@/services/api/chat'

export function useChats(params: GetChatRequestBody) {
  if (
    params.search !== '' ||
    params.isImages ||
    params.isTags ||
    params.isVideos
  ) {
    return useInfiniteQuery<ChatUserType[], Error>({
      queryKey: ['chat', params],
      queryFn: ({ pageParam = 1 }) =>
        getSearchChatList({ ...params, limit: params.limit, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastData, pages) => {
        if (lastData.length < params.limit) {
          return undefined
        }
        return pages.length + 1
      },
      placeholderData: keepPreviousData,
    })
  } else {
    return useInfiniteQuery<ChatUserType[], Error>({
      queryKey: ['chat', params],
      queryFn: ({ pageParam = 1 }) =>
        getChatList({ ...params, limit: params.limit, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastData, pages) => {
        if (lastData.length < params.limit) {
          return undefined
        }
        return pages.length + 1
      },
      placeholderData: keepPreviousData,
    })
  }
}

export function useNewChatUserListInfiniteQuery(params: {
  page: number
  limit: number
  search?: string
}) {
  return useInfiniteQuery({
    queryKey: ['all-chat', params],
    queryFn: ({ pageParam = 1 }) =>
      getNewChatUserList({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastData, pages) => {
      if (lastData?.users) {
        if (lastData?.users?.length < params.limit) {
          return undefined
        }
        return pages.length + 1
      }
    },
    placeholderData: keepPreviousData,
  })
}

export function useSearchChats(params: GetChatRequestBody) {
  return useInfiniteQuery<ChatUserType[], Error>({
    queryKey: ['chat', params],
    queryFn: ({ pageParam = 1 }) =>
      getChatList({ ...params, limit: params.limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastData, pages) => {
      if (lastData.length < params.limit) {
        return undefined
      }
      return pages.length + 1
    },
    placeholderData: keepPreviousData,
  })
}

export function useGetChatMessages(params: GetChatMessagesBody) {
  return useInfiniteQuery<MessagesResponseType, Error>({
    queryKey: ['chats', params],
    queryFn: ({ pageParam = params.page ? params.page : 1 }) =>
      getChatMessages({ ...params, limit: params.limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (
      lastData: MessagesResponseType,
      pages: MessagesResponseType[]
    ) => {
      if (lastData.data.length < params.limit) {
        return undefined
      }
      return pages.length + 1
    },
    placeholderData: keepPreviousData,
  })
}

export function useCreateChatMessage() {
  const createChatMessageMutation = useMutation({
    mutationFn: createChatMessage,
  })

  return createChatMessageMutation
}

export function useQuickResponse() {
  const quickResponseMutation = useMutation({
    mutationFn: quickResponse,
  })

  return quickResponseMutation
}

export function useMuteChatNotification(
  options?: Record<string, (data: TChatSettingResponse) => void>
) {
  const muteChatNotificationMutation = useMutation({
    mutationFn: updateChatSetting,
    onSuccess(data) {
      options?.onSuccess(data)
    },
  })

  return muteChatNotificationMutation
}

export function useMarkReadUnreadChat(
  options?: Record<string, (data: TChatSettingResponse) => void>
) {
  const muteChatNotificationMutation = useMutation({
    mutationFn: updateChatSetting,
    onSuccess(data) {
      options?.onSuccess(data)
    },
  })

  return muteChatNotificationMutation
}

async function createChatFn(requestParams: RequestCreateChatType) {
  const response = await createChat(requestParams)
  return response
}

export function useCreateChat() {
  const createChatMutation = useMutation({
    mutationFn: createChatFn,
  })

  return createChatMutation
}

export function useUpdateMessage() {
  const updateMessageMutation = useMutation({
    mutationFn: updateMessage,
  })

  return updateMessageMutation
}

export function useDeleteChat() {
  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
  })

  return deleteChatMutation
}

async function addChatMembersFn(requestParams: AddChatMembersType) {
  const response = await addChatMembers(requestParams)
  return response
}

export function useAddChatMembers() {
  const addChatMembersMutation = useMutation({
    mutationFn: addChatMembersFn,
  })

  return addChatMembersMutation
}

export function useGetChatDetails(id: string) {
  const getChatDetailsQuery = useQuery({
    queryKey: ['chats', id],
    queryFn: () => getChatDetails(id),
    enabled: !!id,
  })

  return getChatDetailsQuery
}

export function useChatSources(conversation_id: string, messageId: string) {
  return useQuery({
    queryKey: ['chat-sources', conversation_id, messageId],
    queryFn: () => getChatSources(conversation_id, messageId),
  })
}

export function useGetUserReactions(id: string) {
  return useQuery<GetUserReactionsType[]>({
    queryKey: ['user-reactions', id],
    queryFn: () => getUserReactionsByMessage(id),
    enabled: !!id,
  })
}
