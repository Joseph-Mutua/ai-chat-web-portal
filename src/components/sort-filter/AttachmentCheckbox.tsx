import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

export const AttachmentCheckbox = ({
  label,
  onValueChange,
  value,
}: {
  label: string
  onValueChange: (value: boolean) => void
  value: boolean
}) => {
  const [isChecked, setIsChecked] = useState(value)

  const handleCheckboxChange = () => {
    const newValue = !isChecked
    setIsChecked(newValue)
    onValueChange(newValue)
  }

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={handleCheckboxChange}>
        <Ionicons
          name={isChecked ? 'checkbox' : 'square-outline'}
          size={24}
          color={isChecked ? Theme.brand.green : Theme.brand.grey}
        />
      </TouchableOpacity>

      <ThemedText style={styles.label}>{label}</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: Theme.brand.grey,
    marginLeft: 12,
  },
})
