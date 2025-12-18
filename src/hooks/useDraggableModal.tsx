import { useEffect } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'
import {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { isAndroid } from '@/utils/platform'

export const useDraggableModal = (
  callback: () => void,
  dismissThreshold = 150
) => {
  const translateY = useSharedValue(300)

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 120 })
  }, [])

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value
    },
    onActive: (event, ctx) => {
      if (event.translationY < 0) return // Avoid user dragging modal up
      translateY.value = ctx.startY + event.translationY
    },
    onEnd: (event) => {
      if (event.translationY > dismissThreshold) {
        translateY.value = withTiming(550, { duration: 550 })
        runOnJS(callback)()
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 120 })
      }
    },
  })

  return { translateY, gestureHandler }
}

export const useKeyboardOffset = () => {
  const keyboardOffset = useSharedValue(0)

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      isAndroid ? 'keyboardDidShow' : 'keyboardWillShow',
      onKeyboardShow
    )
    const hideSubscription = Keyboard.addListener(
      isAndroid ? 'keyboardDidHide' : 'keyboardWillHide',
      onKeyboardHide
    )

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  const onKeyboardShow = (e: KeyboardEvent) => {
    const keyboardHeight = e.endCoordinates.height
    keyboardOffset.value = withTiming(-keyboardHeight, { duration: 180 })
  }

  const onKeyboardHide = () => {
    keyboardOffset.value = withTiming(0, { duration: 180 })
  }

  return keyboardOffset
}
