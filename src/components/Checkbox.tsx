import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { Theme } from '@/constants/Colors'

export function Checkbox({
  checked = false,
  dimensions,
  customCheckedStyles,
}: {
  checked?: boolean
  dimensions?: {
    width: number
    height: number
  }
  customCheckedStyles?: object
}) {
  return (
    <View style={[styles.container, dimensions]}>
      {checked && <View style={[styles.checked, customCheckedStyles]} />}
    </View>
  )
}

export const SquareCheckbox = ({
  checked = false,
  size,
  text = '',
  iconColor,
  customContainerStyle,
  fontStyles,
  renderText,
  onPress,
}: {
  checked?: boolean
  text?: string
  size?: number
  iconColor?: string
  customContainerStyle?: object
  fontStyles?: object
  renderText?: ({ checked }: { checked: boolean }) => React.ReactNode
  onPress: () => void
}) => (
  <TouchableOpacity
    style={[styles.squaredContainer, customContainerStyle]}
    onPress={onPress}
  >
    <Ionicons
      name={checked ? 'checkbox' : 'square-outline'}
      size={size ?? 26}
      color={iconColor}
    />
    {renderText && typeof renderText === 'function' ? (
      renderText({ checked })
    ) : (
      <Text style={[styles.squaredCheckboxText, fontStyles]}>{text}</Text>
    )}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.brand.grey,
  },
  squaredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  squaredCheckboxText: {
    fontSize: 14,
  },
  checked: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: Theme.brand.green,
  },
})
