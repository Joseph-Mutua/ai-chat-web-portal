import { StyleSheet, View, ViewStyle } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { Body, H3 } from '@/components/ui/elements/typography/Typography'

import { Theme } from '@/constants/Colors'

import { pixelSizeHorizontal, pixelSizeVertical } from '@/utils/responsive'

interface Props {
  title: string
  onBackPress?: () => void
  showBack?: boolean
  rightText?: string
  onRightPress?: () => void
  style?: ViewStyle
}

export const Header = ({
  title,
  onBackPress,
  showBack = true,
  rightText,
  onRightPress,
  style,
}: Props) => {
  return (
    <View style={[styles.container, style]}>
      {showBack && (
        <PressableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={30} color={Theme.colors.text} />
        </PressableOpacity>
      )}

      <H3>{title}</H3>

      {rightText && onRightPress ? (
        <PressableOpacity onPress={onRightPress}>
          <Body style={styles.rightText}>{rightText}</Body>
        </PressableOpacity>
      ) : (
        <View style={styles.rightText} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(12),
    gap: 12,
  },
  rightText: {
    marginRight: pixelSizeHorizontal(12),
    color: Theme.colors.grey,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.lightBorder,
    backgroundColor: Theme.colors.white,
    padding: 5,
    borderRadius: 8,
  },
})
