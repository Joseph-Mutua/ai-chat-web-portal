import React from 'react'
import {
  Platform,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { Theme } from '@/constants/Colors'

export const SafeAreaViewComponent = ({
  style,
  children,
  ...props
}: {
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}) => (
  <SafeAreaView style={[styles.AndroidSafeArea, style]} {...props}>
    {children}
  </SafeAreaView>
)

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: Theme.brand.white,
  },
})
