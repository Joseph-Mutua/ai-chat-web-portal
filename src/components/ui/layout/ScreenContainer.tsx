import { ReactNode, forwardRef } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LinearGradient } from 'expo-linear-gradient'

import { Theme } from '@/constants/Colors'

import { isIOS } from '@/utils/platform'
import { pixelSizeHorizontal, pixelSizeVertical } from '@/utils/responsive'

import { CollapsibleHeaderSpacer } from './CollapsibleHeader'

type Props = {
  withScroll?: boolean
  withGradient?: boolean
  withSafeAreaView?: boolean
  contentContainerStyle?: StyleProp<ViewStyle>
  children: ReactNode
}

export const ScreenContainer = forwardRef<ScrollView, Props>(
  (
    {
      withScroll,
      withGradient,
      withSafeAreaView = true,
      contentContainerStyle,
      children,
    },
    ref
  ) => {
    return (
      <BgWrapper withGradient={withGradient}>
        <SafeAreaWrapper
          withSafeAreaView={withSafeAreaView}
          withGradient={withGradient}
        >
          <KeyboardAvoidingView
            style={styles.screen}
            behavior={isIOS ? 'padding' : 'height'}
          >
            {withScroll ? (
              <ScrollView
                ref={ref}
                style={{ flex: 1 }}
                contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            ) : (
              <View
                style={{ flexGrow: 1 }}
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => Keyboard.dismiss()}
              >
                {children}
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaWrapper>
      </BgWrapper>
    )
  }
)

type BgWrapperProps = {
  withGradient?: boolean
  children: ReactNode
}

const BgWrapper = ({ withGradient, children }: BgWrapperProps) =>
  withGradient ? (
    <LinearGradient
      colors={[
        Theme.brand.greenGradient,
        Theme.brand.purple[100],
        Theme.brand.white,
      ]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0, 0.3, 1]}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  ) : (
    children
  )

type SafeAreaWrapperProps = {
  withSafeAreaView?: boolean
  withGradient?: boolean
  children: ReactNode
}

const SafeAreaWrapper = ({
  withSafeAreaView,
  withGradient,
  children,
}: SafeAreaWrapperProps) =>
  withSafeAreaView ? (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[
        { flex: 1 },
        !withGradient && { backgroundColor: Theme.brand.white },
      ]}
    >
      {children}
    </SafeAreaView>
  ) : (
    <CollapsibleHeaderSpacer>
      <View
        style={[
          { flex: 1 },
          !withGradient && { backgroundColor: Theme.brand.white },
        ]}
      >
        {children}
      </View>
    </CollapsibleHeaderSpacer>
  )

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative',
    paddingBottom: pixelSizeVertical(16),
    paddingHorizontal: pixelSizeHorizontal(24),
  },
})
