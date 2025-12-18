import { StyleSheet, View } from 'react-native'

import { SvgComponent } from '@/components/SvgComponent'

import { Theme } from '@/constants/Colors'

import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@/utils/responsive'

export const ChatHeaderView = ({
  handleNewChat,
  handleHistoryPress,
}: {
  handleNewChat?: () => void
  handleHistoryPress?: () => void
}) => {
  return (
    <View style={[styles.container, { paddingTop: pixelSizeVertical(14) }]}>
      {handleHistoryPress && (
        <View style={styles.iconContainer} onTouchEnd={handleHistoryPress}>
          <SvgComponent
            slug="clock-history"
            height={heightPixel(20)}
            width={widthPixel(20)}
          />
        </View>
      )}
      {handleNewChat && (
        <View style={styles.iconContainer} onTouchEnd={handleNewChat}>
          <SvgComponent
            slug="plus-square"
            height={heightPixel(20)}
            width={widthPixel(20)}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pixelSizeHorizontal(12),
    paddingBottom: pixelSizeVertical(14),
    backgroundColor: Theme.colors.background,
  },
  iconContainer: {
    padding: pixelSizeHorizontal(8),
    borderRadius: pixelSizeHorizontal(2),
    backgroundColor: Theme.colors.white,
  },
})
