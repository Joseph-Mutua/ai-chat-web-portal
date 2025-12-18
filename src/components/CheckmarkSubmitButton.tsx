import { ActivityIndicator, Keyboard, TouchableOpacity } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { Theme } from '@/constants/Colors'

export const CheckmarkSubmitButton = ({
  onSubmit,
  isProcessing,
  iconSize = 32,
}: {
  onSubmit: () => void
  isProcessing?: boolean
  iconSize?: number
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss()
        onSubmit && onSubmit()
      }}
    >
      {isProcessing ? (
        <ActivityIndicator />
      ) : (
        <Ionicons name="checkmark" size={iconSize} color={Theme.brand.black} />
      )}
    </TouchableOpacity>
  )
}
