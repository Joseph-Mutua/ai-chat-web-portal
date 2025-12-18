import {
  type ColorValue,
  StyleSheet,
  type ViewProps,
  useWindowDimensions,
  View,
} from 'react-native'

import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

export function StandardContainer({
  backgroundColor,
  style,
  children,
}: {
  backgroundColor?: ColorValue
  style?: ViewProps
  children: React.ReactNode
}) {
  const { height } = useWindowDimensions()

  return (
    <View
      style={[
        styles.container,
        style,
        {
          backgroundColor: backgroundColor ?? Theme.brand.white,
        },
      ]}
    >
      <ThemedView style={styles.innerContainer}>{children}</ThemedView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
})
