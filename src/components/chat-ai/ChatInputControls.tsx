import React, { useEffect } from 'react'
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { LinearGradient } from 'expo-linear-gradient'

import { CreditExpiredViewWrapper } from '@/components/subscription/credits/CreditExpiredViewWrapper'

import { Theme } from '@/constants/Colors'

import { useSpeechToText } from '@/hooks/useSpeechToText'

import { heightPixel, widthPixel } from '@/utils/responsive'

type ChatInputControlsProps = {
  isAssistantPending: boolean
  locale?: string
  onSendMessage: (prompt: string, conversationId: string) => void
  setPromptInput: (text: string) => void
  promptInput?: string
  chatConversationId?: string
}

const gradientConstants = {
  colors: [Theme.brand.green, Theme.brand.purple[500]] as [string, string],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}

export const ChatInputControls = ({
  isAssistantPending,
  onSendMessage,
  setPromptInput,
  promptInput,
  chatConversationId,
}: ChatInputControlsProps) => {
  const { isListening, showMicButton, composed, handleMicPress, handleSend } =
    useSpeechToText({
      locale: 'en-GB',
      inputValue: promptInput as string,
      setPromptInput,
      onSendMessage,
    })

  useEffect(() => {
    if (promptInput !== composed && isListening) {
      setPromptInput(composed)
    }
  }, [composed, setPromptInput, promptInput])

  return showMicButton ? (
    <Animated.View style={{ transform: [{ scale: isListening ? 1 : 1 }] }}>
      <TouchableOpacity
        onPress={handleMicPress}
        style={styles.micButton}
        disabled={isAssistantPending}
        accessibilityRole="button"
        accessibilityLabel={isListening ? 'Stop dictation' : 'Start dictation'}
      >
        <LinearGradient {...gradientConstants} style={styles.micGradient}>
          <CreditExpiredViewWrapper>
            {(props) =>
              !isAssistantPending ? (
                <Ionicons
                  name={
                    isListening
                      ? 'stop'
                      : props?.needsUpgrade
                        ? 'mic-outline'
                        : 'mic'
                  }
                  size={20}
                  color={Theme.brand[props?.needsUpgrade ? 'black' : 'white']}
                />
              ) : (
                <ActivityIndicator size="small" color={Theme.brand.white} />
              )
            }
          </CreditExpiredViewWrapper>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  ) : (
    <TouchableOpacity
      onPress={() => handleSend(chatConversationId as string)}
      style={{ alignSelf: 'flex-end' }}
      disabled={isAssistantPending}
      accessibilityRole="button"
      accessibilityLabel="Send message"
    >
      <LinearGradient {...gradientConstants} style={styles.sendButton}>
        {!isAssistantPending ? (
          <Ionicons
            name="paper-plane-outline"
            size={18}
            color={Theme.brand.white}
          />
        ) : (
          <ActivityIndicator size="small" color={Theme.brand.white} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  micButton: {
    width: widthPixel(30),
    height: heightPixel(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthPixel(15),
  },
  micGradient: {
    width: widthPixel(30),
    height: heightPixel(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthPixel(15),
  },
  sendButton: {
    width: widthPixel(30),
    height: heightPixel(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthPixel(15),
  },
})
