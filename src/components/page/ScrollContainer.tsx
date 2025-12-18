import { useRef } from 'react'
import { type ColorValue, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { Theme } from '@/constants/Colors'

export function ScrollContainer({
  showsVerticalScrollIndicator = false,
  overScrollMode = 'always',
  keepScrollToBottom,
  style,
  containerStyles,
  children,
}: {
  showsVerticalScrollIndicator?: boolean
  overScrollMode?: 'auto' | 'always' | 'never' | undefined
  scrollPrompt?: { show: boolean; count?: number; downIndicator?: boolean }
  backgroundColor?: ColorValue
  keepScrollToBottom?: boolean
  style?: StyleProp<ViewStyle>
  containerStyles?: StyleProp<ViewStyle>
  children: React.ReactNode
}) {
  const scrollViewRef = useRef<ScrollView>(null)

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      automaticallyAdjustKeyboardInsets={true}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      overScrollMode={overScrollMode}
      onContentSizeChange={() => {
        if (keepScrollToBottom) {
          scrollViewRef.current?.scrollToEnd()
        }
      }}
      contentContainerStyle={[styles.contentContainer, style]}
      style={[styles.container, containerStyles]}
    >
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.brand.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})
