import { StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

import { ThemedView } from '@/components/ThemedView'

import { StandardContainer } from './StandardContainer'

export function LoadingContainer({ size = 48 }: { size?: number }) {
  return (
    <StandardContainer>
      <ThemedView style={[styles.imageContainer]}>
        <FastImage
          source={require('@/assets/animations/loading-spinner.gif')}
          style={{ width: size, height: size }}
        />
      </ThemedView>
    </StandardContainer>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
