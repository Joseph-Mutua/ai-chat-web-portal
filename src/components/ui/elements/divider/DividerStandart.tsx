import { StyleSheet, View } from 'react-native'

import { Theme } from '@/constants/Colors'

import { pixelSizeVertical } from '@/utils/responsive'

export const DividerStandard = ({ mV = 16 }: { mV?: number }) => (
  <View style={[styles.dividerRow, { marginVertical: pixelSizeVertical(mV) }]}>
    <View style={styles.dividerLine} />
  </View>
)

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.colors.grey,
  },
})
