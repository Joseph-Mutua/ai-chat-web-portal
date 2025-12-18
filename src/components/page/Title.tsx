import React from 'react'
import { type StyleProp, StyleSheet, type TextStyle } from 'react-native'

import { ThemedText } from '@/components/ThemedText'

import { Theme } from '@/constants/Colors'

type TextColor =
  | 'black'
  | 'white'
  | 'flashWhite'
  | 'grey'
  | 'coolGrey'
  | 'green'
  | 'red'
  | 'purple'

export function Title({
  textColor = 'white',
  subtitle,
  style,
  screenTitle,
}: {
  textColor?: TextColor
  subtitle?: string
  style?: StyleProp<TextStyle>
  screenTitle?: string | null
}) {
  const color =
    textColor === 'purple' ? Theme.brand.purple[500] : Theme.brand[textColor]

  const getTitle = () => {
    if (screenTitle) {
      if (screenTitle === 'Chat-ai') {
        return 'AI Chat'
      }
      if (screenTitle === 'Ai-assistant') {
        return 'AI Assistant'
      }

      if (screenTitle === 'User-centre') {
        return 'User Centre'
      }
      return screenTitle.replace('-', ' ')
    }
    return 'warpSpeed'
  }

  const customStyles = {
    ...(style as object),
    ...((screenTitle === 'warpSpeed' && { fontStyle: 'italic' }) as TextStyle),
  }

  return (
    <>
      <ThemedText
        style={[styles.warpSpeedText, { color }, customStyles]}
        allowFontScaling={false}
      >
        {getTitle()}
      </ThemedText>
      {!!subtitle && (
        <ThemedText type="small" style={[styles.subtitleText, { color }]}>
          {subtitle}
        </ThemedText>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  warpSpeedText: {
    color: Theme.brand.white,
    fontWeight: 'bold',
    fontSize: 24,
  },
  subtitleText: {
    marginVertical: 8,
    fontSize: 13,
  },
})
