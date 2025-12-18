import React, { useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import { calendarColoursConfig } from '@/utils/calendar'

export type ColoursConfigKeys = 'calendar-event' | 'calendars'

export const ColourPickerModal = ({
  type,
  visible,
  modalColorTitle,
  onColorSelect,
  setShowModal,
}: {
  type: ColoursConfigKeys
  visible: boolean
  modalColorTitle?: string
  setShowModal: () => void
  onColorSelect: (colour: string) => void
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const colours = Object.entries(calendarColoursConfig[type]).map(
    ([key, values]) => ({ colourIndex: key, ...values })
  )

  const handleColorSelect = (colour: string) => {
    setSelectedColor(colour)
    if (onColorSelect) {
      onColorSelect(colour)
      setShowModal()
    }
  }

  return (
    <ThemedView style={styles.container}>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={setShowModal}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedView style={styles.modalHead}>
              <ThemedText type="defaultSemiBold">
                {modalColorTitle ?? 'Colours'}
              </ThemedText>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={setShowModal}
              >
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.colourContainer}>
              <ThemedView style={styles.coloursBox}>
                {colours.map((colour) => {
                  if (colour.colourIndex === '') return
                  return (
                    <TouchableOpacity
                      key={colour.colourIndex}
                      onPress={() => handleColorSelect(colour.colourIndex)}
                    >
                      <ThemedView
                        style={[
                          styles.colour,
                          {
                            backgroundColor: colour.code,
                            borderWidth:
                              selectedColor === colour.colourIndex ? 2 : 0,
                            padding:
                              selectedColor === colour.colourIndex ? 10 : 12,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  )
                })}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 10,
    borderColor: Theme.brand.green,
    borderWidth: 1.5,
  },
  modalHead: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,

    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    backgroundColor: Theme.brand.coolGrey,
  },
  modalClose: {
    position: 'absolute',
    right: 8,
    backgroundColor: 'transparent',
  },
  colourContainer: {
    padding: 20,
    maxWidth: '70%',
    borderRadius: 10,
  },
  coloursBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    flexWrap: 'wrap',
    gap: 6,

    paddingHorizontal: 14,
  },
  colour: {
    margin: 4,
    borderRadius: 24,
  },
})
