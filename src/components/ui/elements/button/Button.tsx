import { ReactNode } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'

import { Theme } from '@/constants/Colors'

import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@/utils/responsive'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'danger'

type ButtonSize = 'lg' | 'md' | 'sm'

interface Props {
  title: string
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  icon?: ReactNode
  isProcessing?: boolean
  disabled?: boolean
  borderColor?: string
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  onPress?: () => void
  customStyle?: ViewStyle
}

export const Button = ({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  isProcessing = false,
  disabled = false,
  borderColor,
  justifyContent,
  onPress,
  customStyle,
}: Props) => {
  const variantStyle = variantStyles[variant]
  const sizeStyle = sizeStyles[size]

  const buttonStyle: ViewStyle = {
    ...styles.baseButton,
    ...variantStyle.button,
    ...sizeStyle.button,
    ...(borderColor && { borderColor }),
    ...(justifyContent && { justifyContent }),
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.6 : 1,
    ...customStyle,
  }

  const textStyle: TextStyle = {
    ...styles.baseText,
    ...variantStyle.text,
    ...sizeStyle.text,
  }

  return (
    <PressableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || isProcessing}
    >
      {isProcessing ? (
        <ActivityIndicator color={variantStyle.text.color} />
      ) : (
        <>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </PressableOpacity>
  )
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pixelSizeHorizontal(999),
    marginVertical: pixelSizeVertical(6),
  },

  baseText: {
    fontWeight: 600,
    textAlign: 'center',
  },

  iconWrapper: {
    marginRight: pixelSizeHorizontal(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const variantStyles = {
  primary: {
    button: {
      backgroundColor: Theme.colors.primary,
    },
    text: {
      color: Theme.colors.white,
    },
  },
  secondary: {
    button: {
      backgroundColor: Theme.colors.secondary,
    },
    text: {
      color: Theme.colors.white,
    },
  },
  outline: {
    button: {
      borderWidth: 1,
      borderColor: Theme.colors.primary,
      backgroundColor: Theme.colors.white,
    },
    text: {
      color: Theme.colors.black,
    },
  },
  ghost: {
    button: {
      backgroundColor: 'transparent',
    },
    text: {
      color: Theme.colors.text,
    },
  },
  link: {
    button: {
      backgroundColor: 'transparent',
    },
    text: {
      color: Theme.colors.primary,
      textDecorationLine: 'underline' as const,
    },
  },
  danger: {
    button: {
      backgroundColor: Theme.colors.error,
    },
    text: {
      color: Theme.colors.white,
    },
  },
}

const sizeStyles = {
  lg: {
    button: {
      height: heightPixel(56),
      paddingHorizontal: pixelSizeHorizontal(20),
    },
    text: {
      fontSize: fontPixel(18),
    },
  },
  md: {
    button: {
      height: heightPixel(50),
      paddingHorizontal: pixelSizeHorizontal(16),
    },
    text: {
      fontSize: fontPixel(14),
    },
  },
  sm: {
    button: {
      height: heightPixel(44),
      paddingHorizontal: pixelSizeHorizontal(14),
    },
    text: {
      fontSize: fontPixel(12.5),
    },
  },
}
