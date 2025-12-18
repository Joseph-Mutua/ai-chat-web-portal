import ColorPickerWrapper, {
  HueSlider,
  OpacitySlider,
  Panel1,
  Swatches,
} from 'reanimated-color-picker'

import React, { useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { Theme } from '@/constants/Colors'

import { Button } from '../Button'
import { ThemedText } from '../ThemedText'

type ColorPickerProps = {
  visible: boolean
  color: string
  onChangeColor: (color: string) => void
}

export function ColorPicker({
  visible,
  color,
  onChangeColor,
}: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(color)

  const onSelectColor = ({ hex }: { hex: string }) => {
    setSelectedColor(hex)
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => onChangeColor(color)}
          style={StyleSheet.absoluteFillObject}
          activeOpacity={0.9}
        />
        <View style={styles.content}>
          <ColorPickerWrapper
            style={{ width: '70%' }}
            value={selectedColor}
            onCompleteJS={onSelectColor}
            sliderThickness={25}
            thumbSize={25}
          >
            <ThemedText
              type={'defaultSemiBold'}
              style={{ textAlign: 'center', paddingVertical: 10 }}
            >
              Pick Colour
            </ThemedText>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => onChangeColor(color)}
            >
              <Ionicons name="close" size={25} />
            </TouchableOpacity>
            <Panel1 />
            <HueSlider style={{ margin: 10 }} />
            <OpacitySlider style={{ margin: 10 }} boundedThumb={false} />
            <Swatches style={{ margin: 10 }} />
          </ColorPickerWrapper>
          <Button
            title={'OK'}
            onPress={() => onChangeColor(selectedColor)}
            {...customButtonStyles.filled}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: Theme.brand.white,
    borderRadius: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    right: 0,
    top: 10,
    backgroundColor: 'transparent',
  },
})

const customButtonStyles = {
  filled: {
    customOpacityStyles: {
      paddingVertical: 6,
      width: 100,
      marginBottom: 16,
    },
    customTextStyles: { height: undefined, fontSize: 15 },
  },
}
