import React, { useCallback } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { LinearGradient } from 'expo-linear-gradient'
import { useFocusEffect } from 'expo-router'

import { Theme } from '@/constants/Colors'

export const PulseGradientTextCover = ({
  isAnimated,
  style,
  children,
}: {
  isAnimated: boolean
  style?: ViewStyle
  children: React.ReactNode
}) => {
  const animatedOpacity = useSharedValue(0.3)

  //Start the glowing animation when the component mounts
  useFocusEffect(
    useCallback(() => {
      if (isAnimated) {
        animatedOpacity.value = withRepeat(
          withTiming(1, {
            duration: 550,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      }

      return () => {
        // Optional: reset value or clean up
        animatedOpacity.value = 0.3
      }
    }, [isAnimated])
  )

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  })

  if (isAnimated) {
    return (
      <View style={[style, styles.extraContainerStyle]}>
        {children}
        <Animated.View style={[styles.cardStyle, animatedStyle]}>
          <LinearGradient
            colors={[
              `${Theme.brand.green}10`,
              `${Theme.brand.green}50`,
              `${Theme.brand.green}10`,
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientStyle}
          />
        </Animated.View>
      </View>
    )
  } else {
    return children
  }
}

const styles = StyleSheet.create({
  extraContainerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardStyle: {
    backgroundColor: 'transparent',
    ...StyleSheet.absoluteFillObject,
  },
  gradientStyle: {
    flex: 1,
    borderRadius: 12, // match with gradient
  },
})
