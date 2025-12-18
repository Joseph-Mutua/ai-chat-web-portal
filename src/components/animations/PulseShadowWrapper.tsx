import React, { useCallback } from 'react'
import { Platform, StyleSheet, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { useFocusEffect } from 'expo-router'

import { Theme } from '@/constants/Colors'

export const PulseShadowWrapper = ({
  isAnimated,
  style,
  children,
}: {
  isAnimated: boolean
  style?: ViewStyle
  children: React.ReactNode
}) => {
  const shadowOpacity = useSharedValue(0)
  const elevation = useSharedValue(0)

  //Start the glowing animation when the component mounts
  useFocusEffect(
    useCallback(() => {
      if (isAnimated) {
        shadowOpacity.value = withRepeat(
          withTiming(0.5, { duration: 850, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        )

        if (Platform.OS === 'android') {
          elevation.value = withRepeat(
            withTiming(10, {
              duration: 850,
              easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
          )
        }
      }
    }, [isAnimated])
  )

  if (isAnimated) {
    return (
      <Animated.View
        style={[
          styles.cardStyle,
          style,
          { elevation: elevation, shadowOpacity: shadowOpacity },
        ]}
      >
        {children}
      </Animated.View>
    )
  } else {
    return children
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    backgroundColor: Theme.brand.white,
    borderColor: Theme.brand.green,
    shadowColor: Theme.brand.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
})
