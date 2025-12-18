import React, { useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'

import { Theme } from '@/constants/Colors'

import { useChatReportMessage } from '@/hooks/api'
import { useNotifications } from '@/hooks/context'
import { useDraggableModal } from '@/hooks/useDraggableModal'

const isAndroid = Platform.OS === 'android'

const options = [
  'Offensive/unsafe',
  'Not factually correct',
  "Didn't follow instructions",
  'Wrong language',
  'Generic/bland',
  'Other',
]

export const ChatReportModal = ({
  params,
  closeModal,
}: {
  params: Record<string, string>
  closeModal: (hasBeenSubmitted: Record<string, string> | null) => void
}) => {
  const [feedback, setFeedback] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [chosenOption, setChosenOption] = useState<string>('')

  const textInputRef = useRef(null)

  const { pushNotification } = useNotifications()

  const { translateY, gestureHandler } = useDraggableModal(
    () => closeModal(null),
    30
  )

  const keyboardOffset = useSharedValue(0)

  const { mutateAsync } = useChatReportMessage()

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardWillShow',
      onKeyboardShow
    )
    const hideSubscription = Keyboard.addListener(
      'keyboardWillHide',
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: isAndroid
          ? translateY.value
          : translateY.value + keyboardOffset.value,
      },
    ],
  }))

  const disableSubmit = !(feedback || chosenOption)
  return (
    <Modal visible transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={() => closeModal(null)}>
        <Pressable onPress={() => Keyboard.dismiss()}>
          <GestureHandlerRootView style={{ justifyContent: 'flex-end' }}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={[styles.modalContainer, animatedStyle]}>
                <TouchableOpacity
                  style={[styles.closeButton, inputFocused && { justifyContent: 'flex-start' }]}
                  onPress={() => {
                    if (inputFocused) {
                      setInputFocused(false)
                      Keyboard.dismiss()
                    } else closeModal(null)
                  }}
                >
                  {!inputFocused ? (
                    <View style={styles.closeIndicator} />
                  ) : (
                    <View style={styles.xCloseIndicator}>
                      <Ionicons name="arrow-back" size={18} />
                    </View>
                  )}
                </TouchableOpacity>

                {!inputFocused && (
                  <>
                    <ThemedText type="defaultSemiBold" style={styles.title}>
                      Why did you choose this rating? (optional)
                    </ThemedText>
                    <View style={styles.optionsContainer}>
                      {options.map((option, index) => {
                        const isSelected = chosenOption === option
                        return (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.optionButton,
                              isSelected && {
                                backgroundColor: '#827F85',
                              },
                            ]}
                            onPress={() =>
                              setChosenOption(!isSelected ? option : '')
                            }
                          >
                            <Text
                              style={[
                                styles.optionText,
                                isSelected && { color: Theme.brand.white },
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  </>
                )}
                <TextInput
                  ref={textInputRef}
                  style={styles.input}
                  placeholder="Provide additional feedback"
                  multiline
                  value={feedback}
                  onChangeText={setFeedback}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholderTextColor={Theme.brand.black}
                />

                <View style={{ paddingBottom: 32, gap: 12 }}>
                  <TouchableOpacity
                    disabled={disableSubmit}
                    style={[
                      styles.submitButton,
                      ...(disableSubmit ? [{ opacity: 0.6 }] : []),
                    ]}
                    onPress={() => {
                      mutateAsync({
                        conversationId: params.conversationId,
                        messageId: params.messageId,
                        params: {
                          reason: chosenOption,
                          feedback,
                        },
                      })
                        .then(() => {
                          closeModal({
                            conversationId: params.conversationId,
                            messageId: params.messageId,
                          })
                          pushNotification({ title: 'Report sent' }, 3000)
                        })
                        .catch((e) => console.error(e))
                    }}
                  >
                    <Text style={styles.submitText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      {
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() =>
                      closeModal({
                        conversationId: params.conversationId,
                        messageId: params.messageId,
                      })
                    }
                  >
                    <Text
                      style={[styles.submitText, { color: Theme.brand.black }]}
                    >
                      Skip
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </PanGestureHandler>
          </GestureHandlerRootView>
        </Pressable>
      </Pressable>
    </Modal >
  )
}

export const useReportModalProps = () => {
  const [openReport, setOpenReport] = useState<Record<string, string> | null>(
    null
  )
  const [reportHasBeenSubmitted, setReportHasBeenSubmitted] = useState<Record<
    string,
    string
  > | null>(null)

  return {
    openReport,
    reportHasBeenSubmitted,
    setOpenReport,
    setReportHasBeenSubmitted,
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    paddingHorizontal: 24,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    width: '100%',
    backgroundColor: Theme.brand.white,
  },
  closeButton: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  xCloseIndicator: {
    marginLeft: -12,
    padding: 4,
  },
  closeIndicator: {
    borderColor: Theme.brand.grey,
    borderRadius: 12,
    borderWidth: 2,
    width: 50,
  },
  title: {
    marginTop: 12,
    marginBottom: 12,
  },
  optionsContainer: {
    marginBottom: 6,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: Theme.brand.white,
  },
  optionText: {
    color: Theme.brand.black,
  },
  input: {
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    color: Theme.brand.black,
    borderRadius: 8,
    height: 80,
    borderWidth: 1,
    backgroundColor: Theme.brand.white,
  },
  submitButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Theme.brand.green,
  },
  submitText: {
    color: Theme.brand.white,
    fontWeight: 'bold',
  },
})
