import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  type FlatListProps,
  StyleSheet,
} from 'react-native'

import { MessageBubble } from '@/components/MessageBubble'
import { ThemedView } from '@/components/ThemedView'

import type { MessageType } from '@/types'

import { ChatReportModal } from './ChatReportModal'

export const ChatAssistantAI = ({
  messages,
  chatConversationId,
  updateMessage,
  copyMessage,
  isResponsePending,
  onRetry,
  isChatModule = false,
  flatListProps,
}: {
  messages: MessageType[]
  chatConversationId?: string
  isResponsePending: boolean
  onRetry: (index: number) => void
  updateMessage?: (message?: string) => void
  copyMessage: (message?: string) => void
  isChatModule?: boolean
  flatListProps?: Partial<FlatListProps<MessageType>>
}) => {
  const flatListRef = useRef<FlatList>(null)

  const [openReport, setOpenReport] = useState<Record<string, string> | null>(
    null
  )
  const [reportHasBeenSubmitted, setReportHasBeenSubmitted] = useState<Record<
    string,
    string
  > | null>(null)

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={messages}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyExtractor={(message, index) =>
          `${message.type}-${message.id}-${index}`
        }
        ItemSeparatorComponent={() => (
          <ThemedView style={styles.messageListSeparator} />
        )}
        renderItem={({ item, index }: { item: MessageType; index: number }) => (
          <MessageBubble
            message={item}
            chatConversationId={chatConversationId}
            isChatModule={isChatModule}
            copyMessage={copyMessage}
            updateMessage={updateMessage}
            onAssistantRetry={() => onRetry(index - 1)}
            reportHasBeenSubmitted={reportHasBeenSubmitted}
            onOpenReportWindow={setOpenReport}
          />
        )}
        ListFooterComponent={() =>
          isResponsePending && (
            <ThemedView style={styles.loadingResponse}>
              <ActivityIndicator />
            </ThemedView>
          )
        }
        onContentSizeChange={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true })
          }
        }}
        {...flatListProps}
      />
      {openReport && (
        <ChatReportModal
          params={openReport}
          closeModal={(isReportSubmitted) => {
            setOpenReport(null)
            setReportHasBeenSubmitted(isReportSubmitted)
          }}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  flatListView: {
    flex: 1,
  },
  messageListSeparator: {
    height: 12,
  },
  loadingResponse: {
    padding: 24,
  },
})
