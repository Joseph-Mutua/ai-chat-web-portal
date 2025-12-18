import { useEffect, useRef, useState } from 'react'
import { Animated, Keyboard, KeyboardEvent, Platform } from 'react-native'

export const useAnimatedValueOnKeyboardAction = () => {
  const keyboardOffset = useRef(new Animated.Value(0)).current

  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const keyboardDidShow = Keyboard.addListener(
      showEvent,
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height)
        keyboardOffset.setValue(0)
      }
    )

    const keyboardDidHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0)
    })

    return () => {
      keyboardDidShow.remove()
      keyboardDidHide.remove()
    }
  }, [keyboardHeight])

  useEffect(() => {
    Animated.timing(keyboardOffset, {
      toValue: keyboardHeight ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start()
  }, [keyboardHeight])

  return {
    keyboardOffset,
    keyboardHeight: keyboardHeight,
  }
}
