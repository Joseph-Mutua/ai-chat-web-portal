import { isAxiosError } from 'axios'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Keyboard, Platform } from 'react-native'
import FileViewer from 'react-native-file-viewer'
import { FlatList } from 'react-native-gesture-handler'

import {
  RelativePathString,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router'

import {
  useChatConversationMessagesQuery,
  useEmailAccountsQuery,
  usePromptChatAI,
  useUser,
} from '@/hooks/api'
import { useGetCachedFile } from '@/hooks/attachments/useCachedAttachment'
import { useDownloadAttachment } from '@/hooks/attachments/useDownloadAttachment'
import { useMediaAttachment } from '@/hooks/attachments/useMediaAttachment'
import { useNotifications } from '@/hooks/context'
import { useDocumentPreview } from '@/hooks/useDocumentPreview'

import {
  formatSmartNewEventValues,
  setStartTimeForSelectedDate,
} from '@/utils/calendar'
import { chatAIMessageHandler } from '@/utils/helpers'

import {
  AIChatQuery,
  AIChatQueryResponseType,
  Attachment,
  AttachmentModuleType,
  IChatSession,
  InputQueryType,
  MessageType,
} from '@/types'
import { SignedUrlInfo } from '@/types/attachments'

import { ChatModeType } from '@/enums'

import { useCollapsibleHeader } from '@/contexts/collapsible-header-provider'
import { reportError } from '@/services/bugsnag'

export function useAssistantManager(
  fromAIAssistant: boolean,
  queryConversationId?: string,
  onClearParams?: () => void,
  allConversations?: IChatSession[],
  refetchConversations?: () => void
) {
  const { path, params, data } = useLocalSearchParams()
  // FlatList behaviour
  const flatListRef = useRef<FlatList>(null)
  const visibleHeightRef = useRef(0)

  const { headerHeightWithInset } = useCollapsibleHeader()

  // Chat AI Assistant States
  const [chatConversationId, setChatConversationId] = useState<
    string | undefined
  >(undefined)
  const [messages, setMessages] = useState<MessageType[]>([])
  const [promptInput, setPromptInput] = useState<string>('')
  const [isConversationStarted, setIsConversationStarted] = useState(false)

  // General Screen State
  const [openReport, setOpenReport] = useState<Record<string, string> | null>(
    null
  )
  const [reportHasBeenSubmitted, setReportHasBeenSubmitted] = useState<Record<
    string,
    string
  > | null>(null)
  const [showAttachmentModal, setShowAttachmentModal] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)
  const [showAttachmentOptionsModal, setShowAttachmentOptionsModal] =
    useState(false)
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null)

  const { data: userData, isLoading: isUserDataLoading } = useUser()
  const { openPreview } = useDocumentPreview()

  const {
    data: conversationMessages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useChatConversationMessagesQuery({
    page: 1,
    limit: 999,
    chatConversationId,
  })

  const {
    mutateAsync: promptQuery,
    isPending: isAssistantPending,
    isError: isAssistantError,
  } = usePromptChatAI()

  const { uploadFiles, isUploading } = useMediaAttachment()

  const { getCachedFile } = useGetCachedFile()

  const { downloadAttachment } = useDownloadAttachment()

  const { pushNotification } = useNotifications()

  const isProcessing = isAssistantPending || isUploading

  const { data: { emailAccounts } = [] } = useEmailAccountsQuery()

  const convertChatData = useCallback(
    (data: AIChatQuery[]): MessageType[] =>
      data.map((data) => ({
        id: data.id,
        user: {
          firstName:
            data.metadata.role === 'USER' ? userData?.firstName : 'warpSpeed',
          me: data.metadata.role === 'USER',
        },
        type: data.metadata.role === 'USER' ? 'message' : 'assistant',
        message: data.message,
        date: data.createdAt,
        citations: data?.metadata.citations ?? [],
        attachments: data?.attachments ?? [],
      })),
    [userData?.firstName]
  )

  useEffect(() => {
    setMessages([
      ...convertChatData(
        conversationMessages?.pages?.flatMap((page) => page.messages) ?? []
      ),
    ])
  }, [conversationMessages?.pages, convertChatData])

  useEffect(() => {
    if (queryConversationId) {
      setChatConversationId(queryConversationId)
      onClearParams?.()
    }
  }, [queryConversationId])

  useEffect(() => {
    if (chatConversationId) {
      setIsConversationStarted(false)
    }
  }, [chatConversationId])

  // Scroll to last user message function
  const scrollToLastUserMessage = useCallback(() => {
    if (messages.length >= 2 && flatListRef.current) {
      // Find the last user message index to scroll to
      let lastUserMsgIndex = -1
      if (messages.at(-2)?.type === 'message') {
        lastUserMsgIndex = messages.length - 2
      } else if (messages.at(-1)?.type === 'message') {
        lastUserMsgIndex = messages.length - 1
      }

      if (lastUserMsgIndex !== -1) {
        flatListRef.current.scrollToIndex({
          index: lastUserMsgIndex,
          animated: true,
          viewPosition: 0,
          viewOffset: headerHeightWithInset + 10,
        })
      }
    }
  }, [messages])

  // Scroll to last user message when messages change (focus effect)
  useFocusEffect(scrollToLastUserMessage)

  /** Pushing Message to State Handler */
  const handleSetMessage = ({
    assistantResponse,
    conversationId,
    isError = false,
    limitReached = false,
  }: {
    assistantResponse?: AIChatQueryResponseType
    conversationId?: string
    isError?: boolean
    limitReached?: boolean
  }) => {
    const chatConversationId =
      assistantResponse?.conversationId || conversationId

    // If AI responses limit has been reached
    if (limitReached) {
      chatAIMessageHandler(
        'warpSpeed',
        ChatModeType.ASSISTANT_LIMIT,
        setMessages,
        assistantResponse?.message
      )
      setChatConversationId('assistant-limit')
      return
    }
    // If Assistant Error
    if (
      chatConversationId &&
      chatConversationId.includes('assistant-error') &&
      isError
    ) {
      chatAIMessageHandler(
        'warpSpeed',
        ChatModeType.ASSISTANT_ERROR,
        setMessages,
        assistantResponse?.message
      )
      setChatConversationId('assistant-error')
      return
    }

    const conversationExists = allConversations?.some(
      (conversation: IChatSession) => conversation.id === chatConversationId
    )

    if (!conversationExists && chatConversationId) {
      refetchConversations?.()
      setChatConversationId(chatConversationId)
    }

    chatAIMessageHandler(
      'warpSpeed',
      isError ? ChatModeType.ASSISTANT_ERROR : ChatModeType.ASSISTANT,
      setMessages,
      assistantResponse?.message,
      assistantResponse?.id,
      assistantResponse?.metadata?.citations ?? [],
      assistantResponse?.attachments ?? []
    )
  }

  /** Send Prompt to API - AI */
  const onCallAPI = async (
    message: string,
    conversationId?: string,
    uploadedAttachments?: SignedUrlInfo[]
  ) => {
    try {
      const body: InputQueryType = {
        message,
        conversationId,
      }

      if (uploadedAttachments) {
        body.uploadedAttachments = uploadedAttachments.map(
          (attachment, index) => ({
            originalFilename: attachment.originalFilename,
            mimetype: attachment.mimetype,
            objectPath: attachment.objectPath,
            size: attachment?.size ?? 0,
          })
        )
      }

      // App context if from AI Assistant screen
      if (fromAIAssistant && path) {
        body.appContext = {
          screen: path as string,
          ...(params && { params: JSON.parse(params as string) }),
          ...(data && { data: JSON.parse(data as string) }),
        }
      }

      const assistantResponse = await promptQuery(body)

      handleSetMessage({
        assistantResponse,
        isError: isAssistantError,
        conversationId,
      })
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          handleSetMessage({ conversationId, limitReached: true })
          return
        }
      } else {
        handleSetMessage({ isError: true, conversationId })
        return
      }
      handleSetMessage({ isError: true, conversationId })
      reportError(error, {
        context: 'chat-ai-send-message-error',
        metadata: {
          conversationId,
          message,
          attachments,
        },
      })
    }
  }

  /** User Sending Prompt */
  const onSendMessage = async (
    message: string,
    conversationId?: string,
    cSmartL?: string
  ) => {
    if (message.trim() || attachments?.length > 0) {
      const addedAttachments = [...attachments] // Copy current attachments as they will be cleared
      chatAIMessageHandler(
        userData.firstName,
        ChatModeType.MESSAGE,
        setMessages,
        cSmartL || message,
        undefined,
        undefined,
        attachments
      )

      setPromptInput('')
      clearAttachments()

      setIsConversationStarted(true)

      const files = addedAttachments.map((attachment) => ({
        uri: attachment.url,
        type: attachment.mimetype,
        size: attachment.size,
        name: attachment.name,
      }))
      let uploadedAttachments: SignedUrlInfo[] = []

      if (files.length > 0) {
        const response = await uploadFiles({ files })
        if (!response.success) {
          return
        }
        uploadedAttachments = response.data
      }

      await onCallAPI(message, conversationId, uploadedAttachments)
    }
  }

  /** Handle Attach File Button Press */
  const onAttachFilePress = () => {
    // Dismiss keyboard if open
    Keyboard.dismiss()
    setShowAttachmentModal(true)
  }

  /** Handle Attachment Long Press */
  const onLongPressAttachment = (attachment: Attachment) => {
    setSelectedAttachment(attachment)
    setShowAttachmentOptionsModal(true)
  }

  /** Handle Attachment Removal */
  const onRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== attachmentId)
    )
  }

  /** Handle Attachment View Local file */
  const onViewAttachment = async (attachment: Attachment) => {
    const isImage = attachment.mimetype?.startsWith('image/')

    if (isImage) {
      setSelectedImageUri(attachment.url)
    } else {
      try {
        const fileExtension = attachment.name.split('.').pop() || ''
        await openPreview({
          uri: attachment.url,
          ext: fileExtension,
          title: attachment.name,
        })
      } catch {
        Alert.alert(
          'Cannot Open File',
          `Unable to open "${attachment.name}". Please try opening it manually from your file manager.`,
          [{ text: 'OK' }]
        )
      }
    }
  }

  const onViewRemoteAttachment = async (attachment: Attachment) => {
    const isImage = attachment.mimetype?.startsWith('image/')

    if (isImage) {
      router.push({
        pathname: '/attachment-viewer',
        params: {
          url: attachment.url,
          name: attachment.name,
          mimetype: attachment.mimetype,
        },
      })
      return
    }

    const { filePath, error } = await getCachedFile(attachment)

    if (error) {
      pushNotification({
        title: 'Error',
        text: 'An error occurred while downloading the file',
      })
      return
    }
    FileViewer.open('file://' + filePath!).catch((error) => {
      reportError(error, {
        context: 'Error opening file',
        severity: 'error',
        metadata: { error: error },
      })
      pushNotification({
        title: 'Error',
        text: 'An error occurred while opening the file',
      })
    })
  }

  /** Close Image Viewer */
  const onCloseImageViewer = () => {
    setSelectedImageUri(null)
  }

  /** Add Attachment to List */
  const addAttachment = (attachment: Attachment) => {
    setAttachments((prev) => [...prev, attachment])
  }

  /** Clear all attachments when starting new chat */
  const clearAttachments = () => {
    setAttachments([])
  }

  const onAttachTo = async (
    attachment: Attachment,
    moduleType: AttachmentModuleType
  ) => {
    setShowAttachmentOptionsModal(false)

    const emailAccountId = emailAccounts?.[0]?.id || ''

    switch (moduleType) {
      case 'email':
        router.push({
          pathname: `/emails/${emailAccountId}/draft` as RelativePathString,
          params: {
            defaultAttachment: JSON.stringify(attachment),
            backUrl: '/emails',
          },
        })
        break
      case 'note':
        router.push({
          pathname: '/notes/new',
          params: {
            defaultAttachment: JSON.stringify(attachment),
            backUrl: '/notes',
          },
        })
        break
      case 'task':
        router.push({
          pathname: '/tasks/create-task',
          params: {
            defaultAttachment: JSON.stringify(attachment),
            backUrl: '/tasks',
          },
        })
        break
      case 'calendar': {
        const startDateTime = setStartTimeForSelectedDate(new Date())
        const newEventDetails = formatSmartNewEventValues(
          startDateTime.toISOString(),
          null
        )
        router.push({
          pathname:
            `/calendar/${userData?.settings?.primaryCalendarId}/create` as RelativePathString,
          params: {
            defaultAttachment: JSON.stringify(attachment),
            backUrl: '/calendar',
            newEventDetails,
          },
        })
        break
      }
      case 'download': {
        const { filePath, error } = await downloadAttachment(attachment)
        if (error) {
          pushNotification({
            title: 'Error',
            text: 'An error occurred while downloading the file',
          })
        }
        if (filePath && Platform.OS === 'android') {
          FileViewer.open('file://' + filePath!).catch((error) => {
            reportError(error, {
              context: 'Error opening file',
              severity: 'error',
              metadata: { error: error },
            })
            pushNotification({
              title: 'Error',
              text: 'An error occurred while opening the file',
            })
          })
        }
        break
      }
    }
  }

  const onEndReached = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }

  return {
    userData,
    flatListRef,
    isConversationStarted,
    messages,
    promptInput,
    visibleHeightRef,
    setPromptInput,
    isProcessing,
    chatConversationId,
    setChatConversationId,
    openReport,
    setOpenReport,
    reportHasBeenSubmitted,
    setReportHasBeenSubmitted,
    showAttachmentModal,
    setShowAttachmentModal,
    attachments,
    addAttachment,
    selectedImageUri,
    showAttachmentOptionsModal,
    setShowAttachmentOptionsModal,
    selectedAttachment,
    isUserDataLoading,
    onSendMessage,
    onAttachFilePress,
    onLongPressAttachment,
    onViewAttachment,
    onViewRemoteAttachment,
    onCloseImageViewer,
    onRemoveAttachment,
    onAttachTo,
    onEndReached,
    onCallAPI,
    setMessages,
    clearAttachments,
    scrollToLastUserMessage,
  }
}
