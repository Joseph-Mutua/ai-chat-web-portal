import { delay } from 'lodash'

import { useState } from 'react'
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native'

import { ChatDisabledView } from '@/components/chat-ai/ChatDisabledView'
import { ChatEntryView } from '@/components/chat-ai/ChatEntryView'
import { ChatSideMenu } from '@/components/chat-ai/ChatSideMenu'
import { CustomTextInput } from '@/components/input/CustomTextInput'
import { CustomLeftDrawerMenu } from '@/components/navigation/CustomLeftDrawerMenu'

import { Theme } from '@/constants/Colors'

import { useAssistantManager } from '@/hooks/ai/useAssistantManager'
import { useChatConversations } from '@/hooks/api'
import { useDebounceInput } from '@/hooks/useDebounceInput'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'

import { isIOS } from '@/utils/platform'
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@/utils/responsive'

import { IChatSession, MessageType, TConversationResponse } from '@/types'

import { useCollapsibleHeader } from '@/contexts/collapsible-header-provider'

import { LoadingContainer } from '../page/LoadingContainer'
import { CollapsibleSubHeaderWrapper } from '../ui/layout/CollapsibleHeader'
import { AttachFileButton } from './AttachFileButton'
import { AttachmentModal } from './AttachmentModal'
import { AttachmentOptionsModal } from './AttachmentOptionsModal'
import { AttachmentPreview } from './AttachmentPreview'
import { ChatAssistantBubble } from './ChatAssistantBubble'
import { ChatHeaderView } from './ChatHeaderView'
import { ChatInputControls } from './ChatInputControls'
import { ChatReportModal } from './ChatReportModal'
import { ImageViewerModal } from './ImageViewerModal'

const ScreenWidth = Dimensions.get('window').width
const isAndroid = Platform.OS === 'android'

export function ChatAI({
  queryConversationId,
  handleDataSharing,
  onClearParams,
}: {
  queryConversationId?: string
  handleDataSharing?: () => void
  onClearParams?: () => void
}) {
  const { totalCollapsibleHeight, listProps } = useCollapsibleHeader()

  const [leftMenuOpen, setLeftMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')

  const debouncedInput = useDebounceInput(searchText)
  const isDocumentPreviewEnabled = useFeatureFlag('documentPreview')

  const {
    data: conversations,
    isLoading: isConversationsLoading,
    fetchNextPage: fetchConversationsNextPage,
    hasNextPage: hasConversationsNextPage,
    isFetchingNextPage: isConversationsFecthingNextPage,
    refetch: refetchConversations,
  } = useChatConversations({
    page: 1,
    limit: 30,
    search: showSearch ? debouncedInput : '',
  })

  const allConversations =
    conversations?.pages?.flatMap((page: TConversationResponse) => page.data) ??
    []

  const {
    messages,
    chatConversationId,
    isProcessing,
    isConversationStarted,
    reportHasBeenSubmitted,
    visibleHeightRef,
    onCallAPI,
    onSendMessage,
    onViewRemoteAttachment,
    onLongPressAttachment,
    isUserDataLoading,
    flatListRef,
    onEndReached,
    scrollToLastUserMessage,
    promptInput,
    setPromptInput,
    attachments,
    addAttachment,
    onRemoveAttachment,
    onViewAttachment,
    onAttachTo,
    showAttachmentModal,
    setShowAttachmentModal,
    selectedImageUri,
    onCloseImageViewer,
    showAttachmentOptionsModal,
    setShowAttachmentOptionsModal,
    selectedAttachment,
    userData,
    openReport,
    setOpenReport,
    setReportHasBeenSubmitted,
    onAttachFilePress,
    setMessages,
    clearAttachments,
    setChatConversationId,
  } = useAssistantManager(
    false, // fromAIAssistant set to false
    queryConversationId,
    onClearParams,
    allConversations,
    refetchConversations
  )

  const onMenuItemPress = (conversationId: string) => {
    setLeftMenuOpen(false)
    let timeout = setTimeout(() => {
      setChatConversationId(conversationId)
      clearTimeout(timeout)
    }, 500)
  }

  /** Clear Conversation and Messages when user press for new Chat window */
  const onNewChatPress = () => {
    setChatConversationId(undefined)
    setMessages([])
    setPromptInput('')
    clearAttachments()
  }

  const renderItem = (item: MessageType, index: number) => (
    <ChatAssistantBubble
      message={item}
      allMessages={messages}
      isLatestMessage={index === messages.length - 1}
      chatConversationId={chatConversationId ?? ''}
      isAssistantPending={isProcessing}
      reportHasBeenSubmitted={reportHasBeenSubmitted}
      conversationTitle={
        allConversations.find(
          (conversation: IChatSession) => conversation.id === chatConversationId
        )?.name ?? ''
      }
      onOpenReportWindow={setOpenReport}
      onAssistantRetry={() => {
        if (index > -1) {
          onCallAPI(messages[index - 1].message as string, chatConversationId)
        }
      }}
      onViewAttachment={onViewRemoteAttachment}
      onLongPressAttachment={onLongPressAttachment}
      visibleHeight={
        index === messages.length - 1 && isConversationStarted
          ? visibleHeightRef.current
          : 0
      }
    />
  )

  if (isUserDataLoading) return <LoadingContainer />

  return (
    <CustomLeftDrawerMenu
      isOpenMenu={leftMenuOpen}
      menuStyle={[styles.menuStyle, { paddingTop: totalCollapsibleHeight }]}
      menuWidth={showSearch ? ScreenWidth : ScreenWidth * 0.7}
      onOpenMenu={() => setLeftMenuOpen((preValue) => !preValue)}
      content={
        <ChatSideMenu
          data={conversations}
          isLoading={isConversationsLoading}
          showSearch={showSearch}
          searchText={searchText}
          isFetchingNextPage={isConversationsFecthingNextPage}
          hasNextPage={hasConversationsNextPage}
          fetchNextPage={fetchConversationsNextPage}
          onItemMenuPress={onMenuItemPress}
          setShowSearch={setShowSearch}
          setSearchText={setSearchText}
        />
      }
    >
      <View style={styles.container}>
        <CollapsibleSubHeaderWrapper>
          <ChatHeaderView
            handleHistoryPress={() => {
              setLeftMenuOpen(true)
              Keyboard.dismiss()
            }}
            handleNewChat={onNewChatPress}
          />
        </CollapsibleSubHeaderWrapper>
        <KeyboardAvoidingView
          style={styles.screen}
          behavior="padding"
          keyboardVerticalOffset={isIOS ? 12 : 0}
        >
          {!userData.settings.dataSharing ? (
            // Data Sharing Disabled Screen
            <ChatDisabledView handleDataSharing={handleDataSharing} />
          ) : !chatConversationId && !isProcessing ? (
            // Assistant Entry Screen
            <ChatEntryView
              isChatModule={true}
              isProcessing={isProcessing}
              triggerSendMessage={(input) =>
                onCallAPI(input, chatConversationId)
              }
              containerStyle={{
                zIndex: 1,
                paddingTop: totalCollapsibleHeight,
              }}
            />
          ) : (
            <Animated.FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => `chat-message-${item.id}-${index}`}
              renderItem={({ item, index }) => renderItem(item, index)}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.2}
              onScrollToIndexFailed={() => {
                delay(() => scrollToLastUserMessage(), 500)
              }}
              onLayout={(event) => {
                visibleHeightRef.current = event.nativeEvent.layout.height - 50
              }}
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingTop: pixelSizeVertical(totalCollapsibleHeight + 12),
              }}
              {...listProps}
            />
          )}

          {/* Prompt Input Field */}
          {userData.settings.dataSharing && (
            <View style={styles.inputSectionContainer}>
              {attachments.length > 0 && (
                <AttachmentPreview
                  attachments={attachments}
                  onRemoveAttachment={onRemoveAttachment}
                  onViewAttachment={onViewAttachment}
                  onLongPressAttachment={onLongPressAttachment}
                />
              )}
              <View style={styles.inputFieldContainer}>
                {isDocumentPreviewEnabled && (
                  <AttachFileButton
                    onPress={onAttachFilePress}
                    disabled={isProcessing}
                  />
                )}
                <View style={styles.customTextInputContainer}>
                  <CustomTextInput
                    onChangeText={setPromptInput}
                    value={promptInput}
                    hideBorder
                    style={styles.inputField}
                    placeholder="Ask me anything"
                    multiline
                    customStyles={[
                      isAndroid && {
                        maxHeight: 300,
                      },
                    ]}
                    autoCorrect={false}
                  />
                </View>
                <ChatInputControls
                  isAssistantPending={isProcessing}
                  onSendMessage={(prompt: string, conversationId: string) => {
                    setPromptInput('')
                    setTimeout(() => Keyboard.dismiss(), 150)
                    onSendMessage(prompt, conversationId)
                  }}
                  setPromptInput={setPromptInput}
                  promptInput={promptInput}
                  chatConversationId={chatConversationId}
                />
              </View>
            </View>
          )}

          {openReport && (
            <ChatReportModal
              params={openReport}
              closeModal={(isReportSubmitted) => {
                setOpenReport(null)
                setReportHasBeenSubmitted(isReportSubmitted)
              }}
            />
          )}
          {showAttachmentModal && (
            <AttachmentModal
              visible={showAttachmentModal}
              onClose={() => setShowAttachmentModal(false)}
              onAddAttachment={addAttachment}
            />
          )}
          <ImageViewerModal
            visible={selectedImageUri !== null}
            imageUri={selectedImageUri ?? ''}
            onClose={onCloseImageViewer}
          />
          <AttachmentOptionsModal
            visible={showAttachmentOptionsModal}
            attachment={selectedAttachment}
            onClose={() => setShowAttachmentOptionsModal(false)}
            onAttachTo={onAttachTo}
          />
        </KeyboardAvoidingView>
      </View>
    </CustomLeftDrawerMenu>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    position: 'relative',
    paddingTop: pixelSizeVertical(20),
    paddingHorizontal: pixelSizeHorizontal(18),
    backgroundColor: Theme.brand.white,
  },
  inputFieldContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: pixelSizeVertical(9),
    paddingEnd: pixelSizeHorizontal(12),
    paddingStart: pixelSizeHorizontal(13),
    gap: pixelSizeHorizontal(4),
  },
  inputSectionContainer: {
    marginBottom: pixelSizeVertical(6),
    borderWidth: 1,
    borderColor: Theme.brand.green,
    borderRadius: pixelSizeHorizontal(20),
    ...(isAndroid && { marginBottom: 12 }),
    zIndex: 2,
    backgroundColor: Theme.brand.white,
  },
  customTextInputContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  inputField: {
    paddingVertical: pixelSizeVertical(0),
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',

    width: widthPixel(30),
    height: heightPixel(30),

    borderRadius: pixelSizeHorizontal(14),
    backgroundColor: Theme.brand.green,
  },
  menuStyle: {
    paddingBottom: pixelSizeVertical(0),
  },
})
