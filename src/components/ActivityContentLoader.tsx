import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { pixelSizeVertical } from '@/utils/responsive'

import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'
import { LoadingContainer } from './page/LoadingContainer'

export const ActivityContentLoader = ({
  size,
  loading,
  onGoBack,
}: {
  size?: number
  loading?: boolean
  onGoBack?: () => void
}) => {
  return (
    <ThemedView style={styles.loader}>
      {loading ? (
        <LoadingContainer size={size} />
      ) : (
        <View style={styles.content}>
          <ThemedText type="defaultSemiBold">No content</ThemedText>
          {onGoBack && (
            <Pressable onPress={onGoBack}>
              <ThemedText type="link">Go Back</ThemedText>
            </Pressable>
          )}
        </View>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    gap: pixelSizeVertical(4),
  },
})
