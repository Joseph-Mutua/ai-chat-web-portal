import { StyleSheet, Text, View } from 'react-native'

import { Theme } from '@/constants/Colors'

import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@/utils/responsive'

interface Props {
  text?: string
}

export const DividerWithText = ({ text = 'Or' }: Props) => (
  <View style={styles.dividerRow}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>{text}</Text>
    <View style={styles.dividerLine} />
  </View>
)

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: pixelSizeVertical(16),
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.grey,
  },
  dividerText: {
    fontSize: fontPixel(12),
    marginHorizontal: pixelSizeHorizontal(8),
    color: Theme.colors.grey,
  },
})
