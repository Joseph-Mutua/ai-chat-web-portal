import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'
import Markdown from 'react-native-markdown-display'

import { Ionicons } from '@expo/vector-icons'

import {
  RelativePathString,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from 'expo-router'
import * as Speech from 'expo-speech'

import { SvgComponent } from '@/components/SvgComponent'
import { AssistantBubbleControls } from '@/components/chat-ai//AssistantBubbleControls'
import { AttachmentPreview } from '@/components/chat-ai/AttachmentPreview'
import {
  RenderRules,
  replaceCitationMarkersWithLinks,
} from '@/components/markdown/RenderRules'
import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'

import { Theme } from '@/constants/Colors'

import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@/utils/responsive'

import { Attachment, MessageType } from '@/types'

import { Button } from '../ui/elements/button/Button'

type Props = {
  message: MessageType
  allMessages: MessageType[]
  chatConversationId: string
  isAssistantPending: boolean
  isLatestMessage: boolean
  reportHasBeenSubmitted: Record<string, string> | null
  conversationTitle: string
  visibleHeight?: number
  onAssistantRetry: () => void
  onAssistantLayout?: (e: LayoutChangeEvent) => void
  onOpenReportWindow: (vls: Record<string, string>) => void
  onViewAttachment: (attachment: Attachment) => void
  onLongPressAttachment?: (attachment: Attachment) => void
}

type ThumbsRegister = {
  conversationId: string
  messageId: string
}

export const ChatAssistantBubble = ({
  message,
  allMessages,
  chatConversationId,
  isAssistantPending,
  isLatestMessage,
  reportHasBeenSubmitted,
  conversationTitle,
  visibleHeight,
  onAssistantRetry,
  onAssistantLayout,
  onOpenReportWindow,
  onViewAttachment,
  onLongPressAttachment,
}: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const { path, params, data } = useLocalSearchParams()

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [thumbMessages, setThumbMessages] = useState<
    Record<string, ThumbsRegister[]>
  >({ thumbsUp: [], thumbsDown: [] })

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [message.message])

  // Listening Report Submission
  useEffect(() => {
    if (reportHasBeenSubmitted) {
      setThumbMessages((prev) => ({
        ...prev,
        thumbsDown: [
          ...prev['thumbsDown'],
          {
            conversationId: reportHasBeenSubmitted.conversationId,
            messageId: reportHasBeenSubmitted.messageId,
          },
        ],
      }))
    }
  }, [reportHasBeenSubmitted])

  // Handling Thumbs Press - Thumbs down has unique logic and is just assigned to state
  // when user submit in Report Modal. Thumbs Up follows having no action at all.
  const handleThumbsPress = useCallback(
    async (thumbKey: string, conversationId: string, messageId: string) => {
      if (thumbKey === 'thumbsDown') {
        onOpenReportWindow && onOpenReportWindow({ conversationId, messageId })
        return
      }
      setThumbMessages((prev) => ({
        ...prev,
        thumbsUp: [...prev['thumbsUp'], { conversationId, messageId }],
      }))
    },
    [onOpenReportWindow]
  )

  const handleSpeakALoud = (message?: string) => {
    if (message) {
      Speech.isSpeakingAsync().then((result) => {
        if (result) {
          setIsSpeaking(false)
          Speech.stop()
        } else {
          setIsSpeaking(true)
          Speech.speak(message)
        }
      })
    }
  }

  const handlePressSources = () => {
    // Determine if coming from AI Assistant: If so, use replace to avoid back stack issues
    const fromAIAssistant = pathname.includes('ai-assistant')
    router[fromAIAssistant ? 'replace' : 'push']({
      pathname:
        `chat-ai/${chatConversationId}/${message.id}/sources` as RelativePathString,
      ...(!pathname.includes('chat-ai') && {
        params: {
          backUrl: pathname,
          fromAIAssistant: fromAIAssistant.toString(),
          ...(fromAIAssistant && { path, params, data }),
        },
      }),
    })
  }

  const [isRetrying, setIsRetrying] = useState(false)
  if (message.type === 'assistant-error') {
    return isRetrying ? (
      <LoadingComponent />
    ) : (
      <View>
        <View
          style={[styles.container, { minHeight: visibleHeight }]}
          onLayout={onAssistantLayout}
        >
          <View style={styles.assistantAvatar}>
            <SvgComponent
              slug="warpspeed-ai-active"
              width={widthPixel(24)}
              height={heightPixel(24)}
            />
          </View>

          <View style={styles.assistanteResponseContainer}>
            <Animated.View style={[{ opacity: fadeAnim }]}>
              <Markdown>**Something went wrong. Please try again.**</Markdown>
              <View style={styles.tryAgainButtonContainer}>
                <Button
                  title="Try Again"
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    if (!isRetrying) {
                      setIsRetrying(true)
                      onAssistantRetry()
                    }
                  }}
                />
              </View>
            </Animated.View>
          </View>
        </View>
        <View style={styles.assistantErrorControls}>
          <AssistantBubbleControls
            message={message.message ?? ''}
            messageId={message.id}
            allMessages={allMessages}
            chatConversationId={chatConversationId}
            chatConversationTitle={conversationTitle}
            thumbMessages={thumbMessages}
            isSpeaking={isSpeaking}
            handleSpeakALoud={handleSpeakALoud}
            handleThumbsPress={handleThumbsPress}
          />
        </View>
      </View>
    )
  }

  if (message.type === 'assistant-limit') {
    return (
      <View>
        <View
          style={[styles.container, { minHeight: visibleHeight }]}
          onLayout={onAssistantLayout}
        >
          <View style={styles.assistantAvatar}>
            <SvgComponent
              slug="warpspeed-ai-active"
              width={widthPixel(24)}
              height={heightPixel(24)}
            />
          </View>

          <View style={styles.assistanteResponseContainer}>
            <Animated.View style={[{ opacity: fadeAnim }]}>
              <Markdown>
                **Oops! You've hit the limit. Looks like you've reached the
                maximum number of messages for this chat.**
              </Markdown>
            </Animated.View>
          </View>
        </View>
        <View style={styles.assistantErrorControls}>
          <AssistantBubbleControls
            message={message.message ?? ''}
            messageId={message.id}
            allMessages={allMessages}
            chatConversationId={chatConversationId}
            chatConversationTitle={conversationTitle}
            thumbMessages={thumbMessages}
            isSpeaking={isSpeaking}
            handleSpeakALoud={handleSpeakALoud}
            handleThumbsPress={handleThumbsPress}
          />
        </View>
      </View>
    )
  }

  if (message.type === 'assistant') {
    return (
      <View
        style={[styles.container, { minHeight: visibleHeight }]}
        onLayout={onAssistantLayout}
      >
        <View style={styles.assistantAvatar}>
          <SvgComponent slug="warpspeed-ai-active" width={24} height={24} />
        </View>
        <View style={styles.assistanteResponseContainer}>
          <Animated.View
            style={[styles.assistanteResponseContainer, { opacity: fadeAnim }]}
          >
            <Markdown
              rules={RenderRules}
              style={{
                paragraph: styles.mdParagraph,
                body: styles.mdBody,
                bullet_list: styles.mdBulletList,
              }}
            >
              {replaceCitationMarkersWithLinks(
                formatListAsFlatMarkdown(message.message ?? ''),
                message.citations ?? []
              )}
            </Markdown>

            {/* AI Generated Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <View style={styles.attachmentContainer}>
                {message.attachments.map((attachment, index) => (
                  <PressableOpacity
                    key={attachment.id || index}
                    onPress={() => onViewAttachment(attachment)}
                  >
                    <Image
                      source={{ uri: attachment.url }}
                      style={styles.generatedImage}
                      resizeMode="cover"
                    />
                  </PressableOpacity>
                ))}
              </View>
            )}

            {/* Sources Button */}
            {message.citations && message.citations?.length > 0 && (
              <TouchableOpacity
                style={styles.sourcesButton}
                onPress={handlePressSources}
              >
                <Ionicons name="link-outline" size={20} color="black" />
                <Text style={styles.sourceText}>Sources</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
          <AssistantBubbleControls
            message={message.message ?? ''}
            messageId={message.id}
            allMessages={allMessages}
            chatConversationId={chatConversationId}
            chatConversationTitle={conversationTitle}
            thumbMessages={thumbMessages}
            isSpeaking={isSpeaking}
            handleSpeakALoud={handleSpeakALoud}
            handleThumbsPress={handleThumbsPress}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={{ minHeight: visibleHeight }}>
      <TouchableHighlight underlayColor="white" activeOpacity={0.5}>
        <View style={styles.promptContainer}>
          {message.attachments && message.attachments.length > 0 && (
            <View style={styles.attachmentContainer}>
              {message.attachments.length > 1 ? (
                <AttachmentPreview
                  hasRemove={false}
                  attachments={message.attachments}
                  onViewAttachment={onViewAttachment}
                  onLongPressAttachment={onLongPressAttachment}
                />
              ) : (
                <TouchableOpacity
                  key={message.attachments[0].id}
                  onPress={() =>
                    message.attachments &&
                    onViewAttachment(message.attachments[0])
                  }
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: message.attachments[0].url }}
                    style={styles.generatedImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.promptBubble}>
            {message.message && <Text>{message.message}</Text>}
          </View>
        </View>
      </TouchableHighlight>
      {isAssistantPending && isLatestMessage && <LoadingComponent />}
    </View>
  )
}

const LoadingComponent = () => (
  <View style={styles.retryContainer}>
    <Image
      source={require('@/assets/animations/typing.gif')}
      style={styles.retryImage}
    />
  </View>
)

function formatListAsFlatMarkdown(markdown: string): string {
  return markdown
    .split('\n')
    .map((line) =>
      line.replace(/^(\d+)\.\s+\*\*(.+?)\*\*/, '**$1. $2**').trim()
    )
    .join('\n')
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: pixelSizeHorizontal(10),
    marginVertical: pixelSizeVertical(20),
  },
  assistantAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: widthPixel(16),
    width: widthPixel(32),
    height: heightPixel(32),

    shadowColor: Theme.brand.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -1 },
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingVertical: pixelSizeVertical(6),
    gap: pixelSizeHorizontal(6),
  },
  assistanteResponseContainer: {
    flexShrink: 1,
  },
  retryContainer: {
    marginHorizontal: pixelSizeHorizontal(12),
    marginVertical: pixelSizeVertical(20),
  },
  assistantErrorControls: {
    marginHorizontal: pixelSizeHorizontal(34),
  },
  tryAgainButtonContainer: {
    alignItems: 'flex-start',
  },
  retryText: {
    color: Theme.brand.green,
    textDecorationLine: 'underline',
  },
  promptContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingVertical: pixelSizeVertical(4),
    paddingHorizontal: pixelSizeHorizontal(16),
  },
  attachmentContainer: {
    maxWidth: '75%',
    marginLeft: 'auto',
    marginRight: pixelSizeHorizontal(16),
    marginBottom: pixelSizeVertical(8),
  },
  promptBubble: {
    padding: pixelSizeHorizontal(12),
    marginLeft: 'auto',
    marginRight: pixelSizeHorizontal(16),
    marginTop: pixelSizeVertical(-8),
    borderRadius: widthPixel(10),
    maxWidth: '75%',
    backgroundColor: Theme.brand.coolGrey,

    shadowColor: Theme.brand.purple[300],
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: -1 },
    elevation: 10,
  },
  typingAnimation: {
    width: widthPixel(80),
    height: heightPixel(40),
    alignSelf: 'center',
  },
  sourcesButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: pixelSizeVertical(8),
    paddingHorizontal: pixelSizeHorizontal(8),
    paddingVertical: pixelSizeVertical(4),
    gap: pixelSizeHorizontal(6),

    borderWidth: 0.8,
    borderRadius: widthPixel(10),
    borderColor: Theme.brand.grey,

    shadowColor: Theme.brand.grey,
    shadowOpacity: 0.5,
    shadowOffset: { width: 1, height: 1 },
    elevation: 4,

    backgroundColor: Theme.brand.white,
  },
  sourceText: {
    fontSize: fontPixel(13),
    lineHeight: fontPixel(14),
    color: Theme.brand.black,
  },
  generatedImage: {
    width: widthPixel(240),
    height: heightPixel(240),
    borderRadius: widthPixel(12),
    marginVertical: pixelSizeVertical(4),
    backgroundColor: Theme.brand.lightGrey,
  },
  retryImage: {
    width: widthPixel(38),
    height: heightPixel(38),
    resizeMode: 'contain',
  },
  mdParagraph: {
    lineHeight: fontPixel(20),
  },
  mdBody: {
    marginBottom: pixelSizeVertical(10),
  },
  mdBulletList: {
    marginBottom: pixelSizeVertical(10),
    lineHeight: fontPixel(20),
  },
  mdBulletListItem: {
    marginBottom: pixelSizeVertical(10),
    lineHeight: fontPixel(20),
  },
})
