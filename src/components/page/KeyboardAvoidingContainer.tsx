import { LegacyRef, forwardRef } from 'react'
import {
  type ColorValue,
  KeyboardAvoidingView,
  ScrollView,
  ScrollViewProps,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'

import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

export const KeyboardAvoidingContainer = forwardRef(
  (
    {
      scrollView = false,
      keyboardVerticalOffset = 0,
      scrollViewPersistTaps,
      keyboardDismissMode,
      style,
      containerStyle,
      children,
      scrollProps = undefined,
      behaviour,
    }: {
      backgroundColor?: ColorValue
      scrollView?: boolean
      keyboardVerticalOffset?: number
      scrollViewPersistTaps?: 'always' | 'handled'
      keyboardDismissMode?: 'none' | 'on-drag' | 'interactive'
      style?: StyleProp<ViewStyle>
      containerStyle?: StyleProp<ViewStyle>
      scrollProps?: ScrollViewProps
      children: React.ReactNode
      customStyles?: ViewStyle
      behaviour?: string
    },
    ref: LegacyRef<ScrollView> | undefined
  ) => {
    const renderInnerView = () => {
      if (scrollView) {
        return (
          <ScrollView
            ref={ref}
            keyboardShouldPersistTaps={scrollViewPersistTaps ?? 'never'}
            keyboardDismissMode={keyboardDismissMode ?? 'on-drag'}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={false}
            contentContainerStyle={[styles.contentContainer, style]}
            {...scrollProps}
          >
            {children}
          </ScrollView>
        )
      }
      return (
        <ThemedView style={[styles.contentContainer, style]}>
          {typeof children !== 'function' && children}
        </ThemedView>
      )
    }

    return (
      <KeyboardAvoidingView
        behavior={(behaviour as 'padding' | 'height' | 'position') ?? 'padding'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={[styles.keyboardAvoidingContainer, containerStyle]}
      >
        {renderInnerView()}
      </KeyboardAvoidingView>
    )
  }
)

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: Theme.brand.white,
  },
  contentContainer: {
    position: 'relative',
    flexGrow: 1,
  },
})
