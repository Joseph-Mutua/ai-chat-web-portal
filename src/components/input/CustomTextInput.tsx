import React, { forwardRef, useCallback } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  type TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { Theme } from '@/constants/Colors'

import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@/utils/responsive'

import { ThemedText } from '../ThemedText'
import { ErrorText } from './ErrorText'

const androidInputMaxHeight = Platform.select({
  android: { maxHeight: pixelSizeVertical(48.5) },
  default: {},
})

type CustomTextInputProps = {
  inputContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<TextStyle>
  error?: string | null
  hideBorder?: boolean
  label?: string
  onFocusEffect?: () => void
  customStyles?: StyleProp<TextStyle>
  isHideContextMenu?: boolean
  labelStyle?: StyleProp<TextStyle>
} & TextInputProps

const MemoizedThemedText = React.memo(ThemedText)
const MemoizedErrorText = React.memo(ErrorText)

const CustomTextInputComponent = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      style = {},
      customStyles = {},
      inputContainerStyle = {},
      error = null,
      hideBorder = false,
      label,
      onFocusEffect,
      isHideContextMenu = false,
      labelStyle,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        onFocus?.(e)
        onFocusEffect?.()
      },
      [onFocus, onFocusEffect]
    )

    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        onBlur?.(e)
      },
      [onBlur]
    )

    return (
      <View style={inputContainerStyle}>
        {label && (
          <MemoizedThemedText style={[styles.label, labelStyle]}>
            {` ${label} `}
          </MemoizedThemedText>
        )}
        <TextInput
          ref={ref}
          placeholderTextColor={Theme.brand.grey}
          style={StyleSheet.flatten([
            !hideBorder && styles.input,
            androidInputMaxHeight,
            styles.baseInputStyle,
            style,
            error ? styles.errorBorder : null,
            customStyles,
          ])}
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          cursorColor={Theme.brand.green}
          selectionColor={Theme.brand.green}
        />
        {error && <MemoizedErrorText error={error} />}
      </View>
    )
  }
)

export const CustomTextInput = React.memo(CustomTextInputComponent)

const styles = StyleSheet.create({
  baseInputStyle: {
    paddingHorizontal: pixelSizeHorizontal(12),
    paddingVertical: pixelSizeVertical(12),
    lineHeight: fontPixel(18),
  },
  input: {
    color: Theme.brand.black,
    borderWidth: 1,
    borderColor: Theme.brand.grey,
    borderRadius: pixelSizeHorizontal(12),
    backgroundColor: Theme.brand.white,
  },
  errorBorder: {
    borderColor: Theme.brand.red,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: pixelSizeHorizontal(2),
    top: pixelSizeVertical(-11),
    left: pixelSizeHorizontal(13),
    zIndex: 4,
    backgroundColor: Theme.brand.white,
  },
})
