import { GestureResponderEvent, StyleSheet, View } from 'react-native'

import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { Typography } from '@/components/ui/elements/typography/Typography'

import { Theme } from '@/constants/Colors'

import {
  heightPixel,
  pixelSizeHorizontal,
  widthPixel,
} from '@/utils/responsive'

type Props = {
  checked: boolean
  label?: string
  onPress?: (event: GestureResponderEvent) => void
  renderLabel?: (checked: boolean) => React.ReactNode
}

export const CheckboxWithLabel = ({
  checked,
  label,
  onPress,
  renderLabel,
}: Props) => {
  if (!label && !renderLabel) return null

  return (
    <PressableOpacity style={styles.checkboxRow} onPress={onPress}>
      <View style={styles.checkbox}>
        {checked && <View style={styles.checkboxInner} />}
      </View>
      <View>
        {!renderLabel ? (
          <Typography variant="caption">{label}</Typography>
        ) : (
          renderLabel(checked)
        )}
      </View>
    </PressableOpacity>
  )
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: pixelSizeHorizontal(6),
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPixel(16),
    height: heightPixel(16),

    borderWidth: 1,
    borderRadius: pixelSizeHorizontal(4),
    borderColor: Theme.brand.grey,
  },
  checkboxInner: {
    width: widthPixel(10),
    height: heightPixel(10),
    borderRadius: pixelSizeHorizontal(2),
    backgroundColor: Theme.brand.green,
  },
})
