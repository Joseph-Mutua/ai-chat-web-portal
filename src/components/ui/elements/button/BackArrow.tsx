import { StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { useRouter } from 'expo-router'

import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'

import { Theme } from '@/constants/Colors'

import { widthPixel } from '@/utils/responsive'

interface Props {
  onBackPress?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export const BackArrow = ({ onBackPress, size = 'md' }: Props) => {
  const router = useRouter()

  const handleBack = () => (onBackPress ? onBackPress() : router.back())

  const { buttonSize, iconSize } = sizeMap[size]

  return (
    <PressableOpacity
      style={[
        styles.backButton,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
      ]}
      onPress={handleBack}
    >
      <Ionicons name="chevron-back" size={iconSize} color={Theme.colors.text} />
    </PressableOpacity>
  )
}

const sizeMap = {
  sm: {
    buttonSize: widthPixel(32),
    iconSize: 18,
  },
  md: {
    buttonSize: widthPixel(48),
    iconSize: 26,
  },
  lg: {
    buttonSize: widthPixel(60),
    iconSize: 32,
  },
} as const

const styles = StyleSheet.create({
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: Theme.colors.lightBorder,
    backgroundColor: Theme.colors.white,
  },
})
