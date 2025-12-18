import { ReactNode } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import {
  Label,
  Typography,
} from '@/components/ui/elements/typography/Typography'

import { Theme } from '@/constants/Colors'

import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@/utils/responsive'

type LabeledInputProps = {
  label?: string
  rightIcon?: ReactNode
  error?: string | null
  hasError?: boolean
  containerStyle?: StyleProp<ViewStyle>
  labelStyle?: TextStyle
} & TextInputProps

export const LabeledInput = ({
  label,
  rightIcon,
  error,
  hasError,
  style,
  containerStyle,
  labelStyle,
  ...inputProps
}: LabeledInputProps) => (
  <View style={containerStyle}>
    {label ? <Label style={[styles.label, labelStyle]}>{label}</Label> : null}

    <View
      style={[
        styles.inputWrapper,
        (error || hasError) && { borderColor: Theme.colors.error },
      ]}
    >
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Theme.colors.inputPlaceholder}
        {...inputProps}
      />

      {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
    </View>

    {error ? (
      <Typography variant="caption" style={styles.errorText}>
        {error}
      </Typography>
    ) : null}
  </View>
)

const styles = StyleSheet.create({
  label: {
    marginBottom: pixelSizeVertical(6),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(12),
    height: heightPixel(48),

    borderWidth: 1,
    borderColor: Theme.colors.lightBorder,
    borderRadius: pixelSizeHorizontal(12),

    backgroundColor: Theme.brand.white,
  },
  input: {
    flex: 1,
    fontSize: fontPixel(14),
    color: Theme.brand.black,
  },
  rightIcon: {
    marginLeft: pixelSizeHorizontal(8),
  },
  errorText: {
    marginTop: pixelSizeVertical(4),
    color: Theme.colors.error,
  },
})
