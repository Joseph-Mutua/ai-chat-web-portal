import type { ComponentProps } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  type StyleProp,
  StyleSheet,
  Text,
  TextProps,
  type TextStyle,
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { Theme } from '@/constants/Colors'

const ContentView = ({
  hasIcon,
  icon,
  iconSize,
  customTextStyles,
  title,
  extraTextProps,
}: {
  hasIcon?: boolean
  title?: string
  iconSize?: number
  icon?: ComponentProps<typeof Ionicons>['name']
  customTextStyles?: StyleProp<TextStyle>
  extraTextProps?: TextProps
}) => {
  return hasIcon ? (
    <Ionicons name={icon} size={iconSize} color={Theme.brand.white} />
  ) : (
    <Text style={[styles.text, customTextStyles]} {...extraTextProps}>
      {title}
    </Text>
  )
}

export function Button({
  title = '',
  isDisable,
  loading,
  fullWidth = false,
  icon,
  hasIcon = false,
  iconSize = 28,
  customOpacityStyles,
  customTextStyles,
  onPress,
  indicatorStyle = {},
  extraTextProps,
  ...props
}: {
  title?: string
  isDisable?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconSize?: number
  icon?: ComponentProps<typeof Ionicons>['name']
  hasIcon?: boolean
  customOpacityStyles?: StyleProp<ViewStyle>
  customTextStyles?: StyleProp<TextStyle>
  onPress: () => void
  indicatorStyle?: StyleProp<ViewStyle>
  extraTextProps?: TextProps
} & TouchableOpacityProps) {
  const handleButtonPress = () => {
    onPress()
    if (Keyboard.isVisible()) {
      Keyboard.dismiss()
    }
  }

  return (
    <TouchableOpacity
      disabled={isDisable || loading}
      onPress={handleButtonPress}
      style={[
        styles.container,
        fullWidth && { flex: 1 },
        customOpacityStyles,
        { opacity: isDisable ? 0.6 : 1 },
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={Theme.brand.white}
          style={[{ height: styles.text.lineHeight }, indicatorStyle]}
        />
      ) : (
        <ContentView
          title={title}
          iconSize={iconSize}
          customTextStyles={customTextStyles}
          hasIcon={hasIcon}
          icon={icon}
          extraTextProps={extraTextProps}
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.brand.green,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Theme.brand.white,
    lineHeight: 25,
    includeFontPadding: false,
  },
})
