import { StyleSheet, type ViewStyle, useWindowDimensions } from 'react-native'

import { router } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { StandardContainer } from './StandardContainer'

export function ErrorContainer({
  handleRetry,
  customStyles,
}: {
  handleRetry?: () => void
  customStyles?: ViewStyle
}) {
  const { height } = useWindowDimensions()

  return (
    <StandardContainer>
      <ThemedView
        style={[
          styles.contentContainer,
          { height: height - 200 },
          customStyles,
        ]}
      >
        <ThemedText type="defaultSemiBold">
          You’re offline. Please check your connection.
        </ThemedText>
        {handleRetry && (
          <ThemedText type="link" onPress={handleRetry}>
            Retry
          </ThemedText>
        )}
        <ThemedText type="link" onPress={() => router.back()}>
          Go back
        </ThemedText>
      </ThemedView>
    </StandardContainer>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
