import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { StyleSheet, View } from 'react-native'
import DropDownPicker, {
  type DropDownPickerProps,
} from 'react-native-dropdown-picker'

import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ErrorText } from '@/components/input/ErrorText'

import { Theme } from '@/constants/Colors'

function CustomDropdownPickerComponent(
  {
    label,
    items,
    value,
    error,
    onChange,
    customStyles,
    customLabelStyles,
    dropDownContainerStyle,
    customIconColour,
    ...props
  }: {
    label?: string
    items: { label: string; value: string }[]
    value: string | null
    error?: string | null
    onChange: (value: string) => void
    customStyles?: object
    customLabelStyles?: object
    dropDownContainerStyle?: object
    customIconColour?: string
    props?: object
  } & Omit<
    DropDownPickerProps<string>,
    'value' | 'setValue' | 'open' | 'setOpen'
  >,
  ref: React.Ref<{ close: () => void }>
) {
  const [stateValue, setStateValue] = useState(value)
  const [stateItems, setStateItems] = useState(items)
  const [open, setOpen] = useState(false)

  // Exposing the fn to the parent component
  useImperativeHandle(ref, () => ({
    close: () => setOpen(false),
  }))

  useEffect(() => {
    onChange(stateValue as string)
  }, [stateValue])

  // Sync internal state if changed from outside
  useEffect(() => {
    setStateValue(value)
    setStateItems(items)
  }, [items, value])

  const color = open && label ? Theme.brand.green : Theme.brand.black

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText
          style={[styles.label, { color }, customLabelStyles]}
        >{` ${label} `}</ThemedText>
      )}
      <DropDownPicker
        open={open}
        value={stateValue}
        items={stateItems}
        setOpen={setOpen}
        setValue={setStateValue}
        setItems={setStateItems}
        style={[
          styles.picker,
          error ? styles.pickerError : {},
          { borderColor: color },
          customStyles ? customStyles : {},
        ]}
        placeholderStyle={{
          color: Theme.brand.grey,
        }}
        dropDownContainerStyle={dropDownContainerStyle}
        ArrowDownIconComponent={() => (
          <Ionicons
            name="chevron-down"
            size={20}
            color={customIconColour ?? Theme.brand.black}
          />
        )}
        ArrowUpIconComponent={() => (
          <Ionicons
            name="chevron-up"
            size={20}
            color={customIconColour ?? Theme.brand.black}
          />
        )}
        {...props}
      />
      {error && <ErrorText error={error} />}
    </View>
  )
}

export const CustomDropdownPicker = forwardRef(CustomDropdownPickerComponent)

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 2,
    top: -14,
    left: 13,
    backgroundColor: Theme.brand.white,
    zIndex: 9999,
  },
  picker: {
    borderRadius: 12,
    borderColor: Theme.brand.grey,
  },
  pickerError: {
    borderColor: Theme.brand.red,
  },
})
