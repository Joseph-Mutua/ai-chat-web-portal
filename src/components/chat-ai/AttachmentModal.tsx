import {
  DocumentPickerResponse,
  FileToCopy,
  keepLocalCopy,
  pick,
  types,
} from '@react-native-documents/picker'

import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

import { Ionicons } from '@expo/vector-icons'

import * as ImagePicker from 'expo-image-picker'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import { useNotifications } from '@/hooks/context'
import { useDraggableModal } from '@/hooks/useDraggableModal'

import { validateAIInputDocFiles } from '@/utils/identifyFileCategory'

import { Attachment } from '@/types'

import { UPLOAD_FILE_TYPE } from '@/enums/common'

import { reportError } from '@/services/bugsnag'

type AttachmentModalProps = {
  visible: boolean
  onClose: () => void
  onAddAttachment: (attachment: Attachment) => void
}

type AttachmentOption = {
  type: UPLOAD_FILE_TYPE
  icon: keyof typeof Ionicons.glyphMap
  title: string
  svgSlug?: string
}

const attachmentOptions: AttachmentOption[] = [
  {
    type: UPLOAD_FILE_TYPE.CAMERA,
    icon: 'camera-outline',
    title: 'Camera',
  },
  {
    type: UPLOAD_FILE_TYPE.GALLERY,
    icon: 'image-outline',
    title: 'Gallery',
  },
  {
    type: UPLOAD_FILE_TYPE.UPLOAD_DOCUMENT,
    icon: 'document-text-outline',
    title: 'Files',
  },
]

export const AttachmentModal = ({
  visible,
  onClose,
  onAddAttachment,
}: AttachmentModalProps) => {
  const { pushNotification } = useNotifications()

  const { translateY, gestureHandler } = useDraggableModal(onClose, 100)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const handleOptionPress = async (type: UPLOAD_FILE_TYPE) => {
    try {
      switch (type) {
        case UPLOAD_FILE_TYPE.CAMERA:
          await captureFromCamera()
          break
        case UPLOAD_FILE_TYPE.GALLERY:
          await pickFromGallery()
          break
        case UPLOAD_FILE_TYPE.UPLOAD_DOCUMENT:
          await pickDocuments()
          break
        default:
          break
      }
    } catch (error) {
      console.error('Error picking files:', error)
    }
    onClose()
  }

  const captureFromCamera = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'You need to grant permission to access the camera to upload files.',
          [{ text: 'OK' }]
        )
        return
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      base64: true,
    })

    if (!result.canceled && result.assets) {
      const asset = result.assets[0]
      const _base = `camera_${Date.now()}`
      const _id = _base + '_' + Math.random()
      const attachment: Attachment = {
        id: _id,
        url: asset.uri,
        name: asset.fileName || _base + '.jpg',
        type: asset.mimeType || 'image/jpeg',
        size: asset.fileSize,
        mimetype: asset.mimeType || '',
        expiryAt: new Date(),
        key: _id,
      }
      onAddAttachment(attachment)
    }
  }

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
      base64: true,
      selectionLimit: 20,
    })

    if (!result.canceled && result.assets) {
      result.assets.forEach((asset, index) => {
        const _base = `gallery_${Date.now()}_${index}`
        const _id = _base + '_' + Math.random()
        const attachment: Attachment = {
          id: _id,
          url: asset.uri,
          name: asset.fileName || _base + '.jpg',
          type: asset.mimeType || 'image/jpeg',
          size: asset.fileSize,
          mimetype: asset?.mimeType || '',
          expiryAt: new Date(),
          key: _id,
        }
        onAddAttachment(attachment)
      })
    }
  }

  const filterAcceptedFiles = (files: DocumentPickerResponse[]) => {
    const accepted: DocumentPickerResponse[] = []
    const rejected: DocumentPickerResponse[] = []

    files.forEach((file: DocumentPickerResponse) => {
      validateAIInputDocFiles(file.name, file.type)
        ? accepted.push(file)
        : rejected.push(file)
    })
    return { accepted, rejected }
  }

  const pickDocuments = async () => {
    try {
      const result = await pick({
        allowMultiSelection: true,
        type: [types.pdf, types.plainText, types.images],
      })

      if (!result || result.length === 0) return

      const { accepted, rejected } = filterAcceptedFiles(result)

      // On Android, make a local copy of the files to ensure accessibility later to upload
      if (Platform.OS === 'android' && accepted.length) {
        const filesToCopy = accepted.map((file) => ({
          uri: file.uri,
          fileName: file.name ?? 'document',
        }))
        const copyResults = await keepLocalCopy({
          files: filesToCopy as [FileToCopy, ...FileToCopy[]],
          destination: 'cachesDirectory',
        })
        copyResults.forEach((copyResult, index) => {
          if (copyResult.status === 'success') {
            accepted[index].uri = copyResult.localUri || accepted[index].uri
          }
        })
      }

      if (rejected.length) {
        pushNotification({
          title: 'Unsupported files',
          text: `We don't support these files: ${rejected.map((file) => file.name ?? 'Unknown').join(', ')}`,
        })
      }

      accepted.forEach((file, index) => {
        const _base = `document_${Date.now()}_${index}`
        const _id = _base + '_' + Math.random()
        const attachment: Attachment = {
          id: _id,
          url: file.uri,
          name: file.name || _base,
          type: file.type || 'application/octet-stream',
          size: file.size || undefined,
          mimetype: file.type || '',
          expiryAt: new Date(),
          key: _id,
        }
        onAddAttachment(attachment)
      })
    } catch (error) {
      reportError(error, {
        context: 'Error picking documents',
        severity: 'error',
        metadata: { error: error },
      })
    }
  }

  const renderAttachmentOption = (option: AttachmentOption, index: number) => {
    return (
      <Pressable
        key={`attachment-${index}`}
        style={styles.optionButton}
        onPress={() => handleOptionPress(option.type)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={option.icon} size={24} color={Theme.brand.black} />
        </View>
        <ThemedText type="default" style={styles.optionText}>
          {option.title}
        </ThemedText>
      </Pressable>
    )
  }

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType="fade"
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <GestureHandlerRootView style={styles.gestureContainer}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              <TouchableWithoutFeedback>
                <ThemedView style={styles.modalContent}>
                  {/* Drag Handle */}
                  <View style={styles.dragHandle} />

                  {/* Modal Body */}
                  <ThemedView style={styles.modalBody}>
                    {attachmentOptions.map(renderAttachmentOption)}
                  </ThemedView>
                </ThemedView>
              </TouchableWithoutFeedback>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  gestureContainer: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: Theme.brand.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Theme.brand.grey,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.brand.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 12,
    color: Theme.brand.black,
  },
})
