import { StyleSheet, View } from 'react-native'

import { BackArrow } from '@/components/ui/elements/button/BackArrow'
import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { Body, H2 } from '@/components/ui/elements/typography/Typography'

import { Theme } from '@/constants/Colors'

import { pixelSizeHorizontal, pixelSizeVertical } from '@/utils/responsive'

interface Props {
  title: string
  onBackPress?: () => void
  showBack?: boolean
  rightText?: string
  onRightPress?: () => void
}

export const HeaderBar = ({
  title,
  onBackPress,
  showBack = true,
  rightText,
  onRightPress,
}: Props) => {
  return (
    <View style={styles.container}>
      {showBack && <BackArrow onBackPress={onBackPress} />}

      <H2>{title}</H2>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(12),
  },
  rightText: {
    marginRight: pixelSizeHorizontal(12),
    color: Theme.colors.grey,
  },
})
