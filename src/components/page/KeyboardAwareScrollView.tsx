import { LegacyRef, forwardRef } from 'react'
import {
  type ColorValue,
  SafeAreaView,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'
import {
  KeyboardAwareScrollViewProps,
  KeyboardAwareScrollView as KeyboardScrollView,
} from 'react-native-keyboard-aware-scroll-view'

import { Theme } from '@/constants/Colors'

export const KeyboardAwareScrollView = forwardRef(
  (
    {
      backgroundColor,
      scrollViewPersistTaps,
      style,
      children,
      extraProps = undefined,
    }: {
      backgroundColor?: ColorValue
      scrollViewPersistTaps?: 'always' | 'handled'
      style?: StyleProp<ViewStyle>
      extraProps?: KeyboardAwareScrollViewProps
      children: React.ReactNode
    },
    ref: LegacyRef<KeyboardScrollView> | undefined
  ) => {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: backgroundColor ?? Theme.brand.white },
        ]}
      >
        <KeyboardScrollView
          ref={ref}
          style={{ flex: 1 }}
          contentContainerStyle={[styles.contentContainer, style]}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
          keyboardShouldPersistTaps={scrollViewPersistTaps ?? 'never'}
          automaticallyAdjustKeyboardInsets={true}
          enableResetScrollToCoords={true}
          enableAutomaticScroll={false}
          {...extraProps}
        >
          {children}
        </KeyboardScrollView>
      </SafeAreaView>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
})
