import {
  UnknownOutputParams,
  useLocalSearchParams,
  useRouter,
} from 'expo-router'

import { ChatAI } from '@/components/chat-ai'

export default function ChatAIScreen() {
  const router = useRouter()
  const query: UnknownOutputParams = useLocalSearchParams()

  return (
    <ChatAI
      queryConversationId={query.conversationId as string}
      handleDataSharing={() => router.push('/user-centre/privacy-centre')}
      onClearParams={() => {
        router.setParams({ conversationId: '' })
      }}
    />
  )
}
