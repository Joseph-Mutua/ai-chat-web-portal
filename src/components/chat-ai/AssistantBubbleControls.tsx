import React, { useRef } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Popover, { PopoverPlacement } from 'react-native-popover-view'

import { Ionicons } from '@expo/vector-icons'

import * as Clipboard from 'expo-clipboard'
import {
  RelativePathString,
  router,
  useLocalSearchParams,
  usePathname,
} from 'expo-router'

import { SvgComponent } from '@/components/SvgComponent'

import { Theme } from '@/constants/Colors'

import { useNotifications } from '@/hooks/context'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'

import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@/utils/responsive'

import { MessageType } from '@/types'

type Props = {
  message: string
  messageId: string
  allMessages?: MessageType[]
  chatConversationId: string
  chatConversationTitle: string
  thumbMessages: Record<string, ThumbsRegister[]>
  isSpeaking: boolean
  isAssistantModal?: boolean
  handleSpeakALoud: (message: string) => void
  handleThumbsPress: (
    thumbState: string,
    conversationId: string,
    messageId: string
  ) => void
  onUpdateEditorMessage?: (e: string) => void
}

type ThumbsRegister = {
  conversationId: string
  messageId: string
}

export const AssistantBubbleControls = ({
  message,
  messageId,
  allMessages,
  chatConversationId,
  chatConversationTitle,
  thumbMessages,
  isSpeaking,
  isAssistantModal,
  handleSpeakALoud,
  handleThumbsPress,
  onUpdateEditorMessage,
}: Props) => {
  const isAiChatExportEnabled = useFeatureFlag('exportChatAi')
  const { path, params, data } = useLocalSearchParams()

  const exportChatPopoverRef = useRef<Popover>(null)
  const copyMessagePopoverRef = useRef<Popover>(null)

  const { pushNotification } = useNotifications()
  const pathname = usePathname()

  const isThumbed = (thumbKey: string) =>
    thumbMessages[thumbKey]?.some((v) => v.messageId === messageId)

  const handleGenerateDocument = (
    chatConversationId: string,
    messageId: string,
    selectedOption: string,
    chatConversationTitle?: string
  ) => {
    exportChatPopoverRef.current?.requestClose()
    // Determine if coming from AI Assistant: If so, use replace to avoid back stack issues
    const fromAIAssistant = pathname.includes('ai-assistant')
    router[fromAIAssistant ? 'replace' : 'push']({
      pathname:
        `chat-ai/${chatConversationId}/${messageId}/download` as RelativePathString,
      params: {
        selectedOption,
        chatConversationTitle: chatConversationTitle ?? '',
        fromAIAssistant: fromAIAssistant.toString(),
        ...(fromAIAssistant && { path, params, data }),
      },
    })
  }

  const handleCopyAction = async (action: string) => {
    let notificationMessage = ''

    if (action === 'message' && message) {
      await Clipboard.setStringAsync(message)
      notificationMessage = 'Message Copied'
    }

    if (action === 'conversation' && allMessages?.length) {
      const allMessagesToString = allMessages
        .map(
          (message) => `**${message.user.firstName}**:\n> ${message.message}`
        )
        .join('\n\n')
      await Clipboard.setStringAsync(allMessagesToString)
      notificationMessage = 'Conversation Messages Copied'
    }

    copyMessagePopoverRef.current?.requestClose()

    setTimeout(() => {
      notificationMessage &&
        pushNotification({ title: notificationMessage }, 2000)
    }, 500)
  }

  return (
    <View style={styles.actionsContainer}>
      {/* Copy content to Editors - File Arrow */}
      {typeof onUpdateEditorMessage === 'function' && !isAssistantModal && (
        <Pressable
          style={({ pressed }) => pressed && { opacity: 0.6 }}
          onPress={() => onUpdateEditorMessage(message)}
        >
          <SvgComponent
            slug="file-arrow-up"
            color={Theme.brand.grey}
            width={20}
            height={20}
          />
        </Pressable>
      )}

      {/* Copy Single Message / All Conversation Messages Icon */}
      <Popover
        ref={copyMessagePopoverRef}
        popoverStyle={[
          styles.popoverContainer,
          { transform: [{ translateX: 72 }] },
        ]}
        placement={PopoverPlacement.TOP}
        popoverShift={{ x: 0, y: -20 }}
        arrowSize={{ width: 0, height: 0 }}
        from={
          <Pressable style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Ionicons name="copy-outline" color={Theme.brand.grey} size={20} />
          </Pressable>
        }
      >
        <View style={styles.popup}>
          <Pressable
            onPress={() => handleCopyAction('message')}
            style={({ pressed }) => [
              styles.popupOption,
              pressed ? { opacity: 0.6 } : null,
            ]}
          >
            <Ionicons
              name="chatbubble-outline"
              color={Theme.brand.black}
              size={16}
            />
            <Text style={styles.popupOptionText}>Copy message</Text>
          </Pressable>
          <Pressable
            onPress={() => handleCopyAction('conversation')}
            style={({ pressed }) => [
              styles.popupOption,
              pressed ? { opacity: 0.6 } : null,
            ]}
          >
            <Ionicons
              name="chatbubbles-outline"
              color={Theme.brand.black}
              size={16}
            />
            <Text style={styles.popupOptionText}>Copy conversation</Text>
          </Pressable>
        </View>
      </Popover>

      {/* Generate Document (download) icon */}
      {isAiChatExportEnabled && (
        <Popover
          ref={exportChatPopoverRef}
          popoverStyle={[
            styles.popoverContainer,
            { transform: [{ translateX: 72 }] },
          ]}
          placement={PopoverPlacement.TOP}
          popoverShift={{ x: 0, y: -20 }}
          arrowSize={{ width: 0, height: 0 }}
          from={
            <TouchableOpacity>
              <Ionicons
                name="download-outline"
                color={Theme.brand.grey}
                size={20}
              />
            </TouchableOpacity>
          }
        >
          <View style={styles.popup}>
            <Pressable
              onPress={() =>
                handleGenerateDocument(
                  chatConversationId,
                  messageId,
                  'message',
                  chatConversationTitle
                )
              }
              style={({ pressed }) => [
                styles.popupOption,
                pressed ? { opacity: 0.6 } : null,
              ]}
            >
              <Ionicons
                name="document-outline"
                color={Theme.brand.black}
                size={16}
              />
              <Text style={styles.popupOptionText}>Export Answer</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                handleGenerateDocument(
                  chatConversationId,
                  messageId,
                  'chat',
                  chatConversationTitle
                )
              }
              style={({ pressed }) => [
                styles.popupOption,
                pressed ? { opacity: 0.6 } : null,
              ]}
            >
              <Ionicons
                name="albums-outline"
                color={Theme.brand.black}
                size={16}
              />
              <Text style={styles.popupOptionText}>Export Full Chat</Text>
            </Pressable>
          </View>
        </Popover>
      )}

      {/* Voice over - Volume icon */}
      <TouchableOpacity onPress={() => handleSpeakALoud(message)}>
        <Ionicons
          name={isSpeaking ? 'volume-mute-outline' : 'volume-high-outline'}
          size={24}
          color={Theme.brand.grey}
        />
      </TouchableOpacity>

      {/* Thumbs Down Report Modal */}
      {!isThumbed('thumbsDown') && (
        <TouchableOpacity
          onPress={() =>
            !isThumbed('thumbsUp') &&
            handleThumbsPress('thumbsUp', chatConversationId, messageId)
          }
        >
          <Ionicons
            name={isThumbed('thumbsUp') ? 'thumbs-up' : 'thumbs-up-outline'}
            size={20}
            color={isThumbed('thumbsUp') ? Theme.brand.amber : Theme.brand.grey}
          />
        </TouchableOpacity>
      )}

      {/* Thumbs Up icon */}
      {!isThumbed('thumbsUp') && (
        <TouchableOpacity
          onPress={() =>
            !isThumbed('thumbsDown') &&
            handleThumbsPress('thumbsDown', chatConversationId, messageId)
          }
        >
          <Ionicons
            name={
              isThumbed('thumbsDown') ? 'thumbs-down' : 'thumbs-down-outline'
            }
            size={20}
            color={isThumbed('thumbsDown') ? Theme.brand.red : Theme.brand.grey}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    paddingTop: pixelSizeVertical(6),
    gap: pixelSizeHorizontal(14),
  },
  popoverContainer: {
    padding: pixelSizeHorizontal(4),
    borderRadius: pixelSizeHorizontal(8),

    shadowRadius: pixelSizeHorizontal(4),
    shadowOpacity: 0.25,
    shadowColor: Theme.brand.black,
    shadowOffset: {
      width: 0,
      height: pixelSizeVertical(2),
    },
    elevation: 4,
    backgroundColor: Theme.brand.coolGrey,
  },
  popup: {
    flexWrap: 'nowrap',
    padding: pixelSizeHorizontal(12),
    gap: pixelSizeHorizontal(12),
    borderRadius: pixelSizeHorizontal(12),
  },
  popupOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(8),
  },
  popupOptionText: {
    fontSize: fontPixel(14),
    fontWeight: 500,
  },
})
