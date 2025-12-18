import { StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

import { ThemedView } from '@/components/ThemedView'

export function LoadingContainerTransparent({ size = 48 }: { size?: number }) {
  return (
    <ThemedView style={[styles.imageContainer]}>
      <FastImage
        source={require('@/assets/animations/loading-spinner-transparent.gif')}
        style={{
          width: size,
          height: size,
        }}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
})
