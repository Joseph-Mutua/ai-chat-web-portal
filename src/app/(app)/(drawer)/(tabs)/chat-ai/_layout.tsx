import { Stack } from 'expo-router'

export default function ChatAiLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[conversationId]/[messageId]/sources" />
      <Stack.Screen name="[conversationId]/[messageId]/download" />
    </Stack>
  )
}
