import React from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { Theme } from '@/constants/Colors'
import { attachmentOptions } from '@/constants/attachmentOptions'

import { Attachment, AttachmentModuleType } from '@/types'

interface AttachmentOptionsModalProps {
  visible: boolean
  attachment: Attachment | null
  onClose: () => void
  onAttachTo: (
    attachment: Attachment,
    moduleType: AttachmentModuleType
  ) => Promise<void>
}

export const AttachmentOptionsModal = ({
  visible,
  attachment,
  onClose,
  onAttachTo,
}: AttachmentOptionsModalProps) => {
  if (!attachment) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.optionsContainer}>
              {attachmentOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={styles.optionItem}
                  onPress={async () => {
                    await onAttachTo?.(
                      attachment,
                      option.id as AttachmentModuleType
                    )
                    onClose()
                  }}
                >
                  <View style={styles.optionIconContainer}>
                    <Ionicons
                      name={option.icon as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={Theme.brand.black}
                    />
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '70%',
    maxWidth: 300,
  },
  modalContent: {
    backgroundColor: Theme.brand.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: Theme.brand.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  optionsContainer: {
    gap: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Theme.brand.black,
    flex: 1,
  },
})
