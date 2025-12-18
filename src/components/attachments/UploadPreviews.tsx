import { pick, types } from '@react-native-documents/picker'
import { isAxiosError } from 'axios'

import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import RNFS from 'react-native-fs'
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Ionicons } from '@expo/vector-icons'

import * as ImagePicker from 'expo-image-picker'

import { ThemedText } from '@/components/ThemedText'

import { Theme } from '@/constants/Colors'

import { useMediaAttachment } from '@/hooks/attachments/useMediaAttachment'
import { useNotifications } from '@/hooks/context'
import { useAnimatedValueOnKeyboardAction } from '@/hooks/useAnimatedValueOnKeyboardAction'

import { isIOS } from '@/utils/platform'
import {
  heightPixel,
  pixelSizeHorizontal,
  widthPixel,
} from '@/utils/responsive'

import { Attachment } from '@/types'
import type { FileType, SignedUrlInfo } from '@/types/attachments'

import { UPLOAD_FILE_TYPE } from '@/enums/common'

import { AudioPlayer } from './AudioPlayer'
import { MediaEditor } from './MediaEditor'
import { VideoPlayer } from './VideoPlayer'

type PreviewProps = {
  uploadType: UPLOAD_FILE_TYPE
  visible: boolean
  onClose: () => void
  closeDrawerMenu?: () => void
  uploadAttachmentToGCS: boolean
  onSelectFiles?: (files: Attachment[]) => void
  onSelectMessengerFiles?: (files: SignedUrlInfo[]) => void
  renderChatInput?: () => JSX.Element
}

export const UploadPreviews = ({
  uploadType,
  visible,
  onClose,
  closeDrawerMenu,
  onSelectFiles,
  onSelectMessengerFiles,
  renderChatInput,
  uploadAttachmentToGCS,
}: PreviewProps) => {
  const insets = useSafeAreaInsets()
  const { keyboardOffset, keyboardHeight } = useAnimatedValueOnKeyboardAction()

  const paddingBottomFooter = keyboardOffset.interpolate({
    inputRange: [0, 1],
    outputRange: [0, keyboardHeight - insets.bottom],
  })

  const pagerViewRef = useRef<PagerView>(null)

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [selectedFiles, setSelectedFiles] = useState<FileType[]>([])
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false)
  const [isEditable, setIsEditable] = useState<boolean>(false)

  const { pushNotification } = useNotifications()
  const { uploadFiles, isUploading } = useMediaAttachment()

  useEffect(() => {
    if (visible) {
      pickFiles()
    } else {
      setIsOpenPreview(false)
      setSelectedFiles([])
      setCurrentIndex(0)
    }
  }, [visible])

  // This useEffect hook is used to show the preview layout when files are selected from the picker
  useEffect(() => {
    if (selectedFiles.length > 0 && !isOpenPreview) {
      closeDrawerMenu && closeDrawerMenu()
      setTimeout(() => {
        setIsOpenPreview(true)
      }, 1000)
    }
  }, [selectedFiles])

  const pickFiles = async () => {
    try {
      switch (uploadType) {
        case UPLOAD_FILE_TYPE.AUDIO:
          const audioFiles = await pickAudioFiles()
          setSelectedFiles(audioFiles)
          break

        case UPLOAD_FILE_TYPE.CAMERA:
          const mediaFile = await captureFromCamera()
          setSelectedFiles(mediaFile)
          break

        case UPLOAD_FILE_TYPE.GALLERY:
          const mediaFiles = await pickMediaFiles()
          setSelectedFiles(mediaFiles)

          break

        case UPLOAD_FILE_TYPE.UPLOAD_DOCUMENT:
          // Pick Document Files
          await pickDocumentFiles()
          break
      }
    } catch (error: unknown) {
      let message = 'Something went wrong, please try again later.'
      if (error instanceof Error) message = error.message
      pushNotification({ title: 'Error', text: message }, 3000)
      onClose()
    }
  }

  const pickAudioFiles = async () => {
    try {
      const res = await pick({
        allowMultiSelection: true,
        type: [types.audio],
      })

      return [...res]
    } catch (error) {
      console.log('Error: ', error)
      onClose()
    }
    return []
  }

  const captureFromCamera = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'You need to grant permission to access the camera to upload files.',
          [{ text: 'OK', onPress: () => onClose() }]
        )

        return []
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      base64: true,
    })

    if (result.canceled) {
      onClose()
    }

    if (result.assets != null) {
      const item = result.assets[0]
      return [
        {
          uri: item.uri,
          base64: item.base64,
          size: item.fileSize,
          name: item.fileName,
          type: item.mimeType,
          height: item.height,
          width: item.width,
          fileType: item.type,
        },
      ] as FileType[]
    }

    return []
  }

  const pickMediaFiles = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 1,
      base64: true,
      selectionLimit: 20,
    })

    if (result.canceled) {
      onClose()
    }

    if (result.assets != null)
      return result.assets.map((item) => ({
        uri: item.uri,
        base64: item.base64,
        size: item.fileSize,
        name: item.fileName,
        type: item.mimeType,
        height: item.height,
        width: item.width,
        fileType: item.type,
      })) as FileType[]
    else return []
  }

  const pickDocumentFiles = async () => {
    try {
      const res = await pick({
        allowMultiSelection: true,
        type: [
          types.csv,
          types.doc,
          types.docx,
          types.pdf,
          types.plainText,
          types.json,
          types.ppt,
          types.pptx,
          types.xls,
          types.xlsx,
          types.zip,
        ],
      })

      if (res?.length === 0) {
        onClose()
      }

      if (res.length > 20) {
        Alert.alert(
          'Upload Limit Exceeded',
          'You can upload a maximum of 20 items at a time. Only the first 20 items you selected will be uploaded.',
          [
            {
              text: 'OK',
              onPress: async () => {
                const limitedRecords = res.slice(0, 20)
                setSelectedFiles(limitedRecords)
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        )
      } else {
        setSelectedFiles(res)
      }
    } catch (error) {
      console.log('Error while picking document files:', error)
      onClose()
      setSelectedFiles([])
    }
  }

  // Helper function to convert file to Base64
  const convertFileToBase64 = async (file: FileType): Promise<string> => {
    try {
      const base64Data = await RNFS.readFile(
        Platform.OS == 'ios' ? decodeURIComponent(file.uri) : file.uri,
        'base64'
      )
      return base64Data
    } catch (error: any) {
      console.error(error)
      return ''
    }
  }

  function getFileNameFromUri(uri: string): string | null {
    const regex = /[^/]+(\.[a-zA-Z0-9]+)$/
    const match = uri.match(regex)
    return match ? match[0] : null
  }

  const onDone = async (files?: FileType[]) => {
    Keyboard.dismiss()
    files = files || [...selectedFiles]
    if (files.length > 0) {
      uploadAttachmentToGCS
        ? uploadToPreSignedUrl(files)
        : uploadToServer(files)
    } else {
      setIsEditable(false)
    }
  }

  const uploadToPreSignedUrl = async (files: FileType[]) => {
    const response = await uploadFiles({ files })
    if (!response.success) {
      setIsEditable(false)
      return
    }

    if (onSelectMessengerFiles) {
      onSelectMessengerFiles(response.data)
    } else {
      onClose()
    }
    setIsEditable(false)
  }

  const uploadToServer = async (files: FileType[]) => {
    const params = files.map(async (file, index) => {
      let base64 = file.base64

      if (!base64) {
        base64 = await convertFileToBase64(file)
        if (base64 === '') {
          pushNotification(
            {
              title: 'We had a problem sending your file, please try again.',
            },
            5000
          )
        }
      }

      return {
        originalFilename:
          file.name ||
          getFileNameFromUri(file.uri) ||
          `file-${new Date().toISOString()}-${index}`,
        mimetype: file.type || '',
        size: file.size || 0,
        attachment: base64,
      }
    })
  }

  const moveBack = () => {
    pagerViewRef.current?.setPage(currentIndex - 1)
  }

  const moveForward = () => {
    pagerViewRef.current?.setPage(currentIndex + 1)
  }

  const setEditedFile = (file: FileType, index: number) => {
    const updatedFiles = [...selectedFiles]
    updatedFiles[index] = file
    setSelectedFiles(updatedFiles)

    setIsEditable(false)
  }

  const renderItem = (item: FileType, index: number) => {
    switch (uploadType) {
      case UPLOAD_FILE_TYPE.AUDIO:
        return <AudioPlayer audio={item} />
      case UPLOAD_FILE_TYPE.CAMERA:
      case UPLOAD_FILE_TYPE.GALLERY:
        return item?.fileType === 'video' ? (
          <VideoPlayer video={item.uri} />
        ) : (
          <MediaEditor
            file={item}
            isEditable={isEditable}
            onViewMode={() => setIsEditable(false)}
            onEditImage={(file) => setEditedFile(file, index)}
          />
        )

      case UPLOAD_FILE_TYPE.UPLOAD_DOCUMENT:
        return renderDocument(item)
    }
  }

  const renderDocument = (item: FileType) => {
    return (
      <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
        <Ionicons name="document-outline" size={120} color={Theme.brand.grey} />
        <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>
          {item?.name}
        </ThemedText>
      </View>
    )
  }

  return (
    <Modal
      visible={isOpenPreview}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor={Theme.brand.white} barStyle="dark-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <GestureHandlerRootView>
          <View
            style={[
              styles.container,
              Platform.OS === 'ios'
                ? {
                  marginTop: insets.top,
                  marginBottom: insets.bottom,
                }
                : { marginVertical: 8 },
            ]}
          >
            {selectedFiles.length > 0 && (
              <>
                <PagerView
                  ref={pagerViewRef}
                  style={styles.pagerView}
                  initialPage={currentIndex}
                  onPageSelected={(e) =>
                    setCurrentIndex(e.nativeEvent.position)
                  }
                  scrollEnabled={!isEditable}
                >
                  {selectedFiles.map((item, index) => (
                    <View key={`file-${index}`} style={styles.pagerItem}>
                      {renderItem(item, index)}
                    </View>
                  ))}
                </PagerView>

                {!isEditable && renderChatInput && (
                  <Animated.View
                    style={[
                      styles.footerView,
                      { bottom: isIOS ? paddingBottomFooter : 0 },
                    ]}
                  >
                    {renderChatInput()}
                    <TouchableOpacity
                      onPress={() => onDone()}
                      style={styles.sendButton}
                    >
                      <Ionicons
                        name="send"
                        size={18}
                        color={Theme.brand.white}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </>
            )}

            {!isEditable && (
              <>
                {/* Side buttons for previous and next  */}
                {currentIndex > 0 && (
                  <TouchableOpacity
                    onPress={moveBack}
                    style={[styles.arrowStyle, { left: 10 }]}
                  >
                    <Ionicons
                      name="chevron-back-circle"
                      size={35}
                      color={Theme.brand.purple[300]}
                    />
                  </TouchableOpacity>
                )}
                {currentIndex < selectedFiles.length - 1 && (
                  <TouchableOpacity
                    onPress={moveForward}
                    style={[styles.arrowStyle, { right: 10 }]}
                  >
                    <Ionicons
                      name="chevron-forward-circle"
                      size={35}
                      color={Theme.brand.purple[300]}
                    />
                  </TouchableOpacity>
                )}

                {/* Top buttons : Edit, done & close  and footer*/}
                <View style={[styles.headerView, styles.rowStyle]}>
                  <View style={[styles.rowStyle, { width: 76 }]}>
                    <TouchableOpacity onPress={onClose}>
                      <Ionicons name="close" size={30} />
                    </TouchableOpacity>

                    {/* Don't show this in chat uploads */}
                    {!renderChatInput && (
                      <TouchableOpacity onPress={() => onDone()}>
                        <Ionicons name="checkmark" size={30} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {selectedFiles.length > 0 &&
                    selectedFiles[currentIndex]?.fileType === 'image' && (
                      <TouchableOpacity onPress={() => setIsEditable(true)}>
                        <Ionicons name="pencil" size={23} />
                      </TouchableOpacity>
                    )}
                </View>
              </>
            )}
          </View>

          {(isUploading) && (
            <View style={styles.overlay}>
              <Image
                source={require('@/assets/animations/loading-spinner-transparent.gif')}
                style={{ height: 45, width: 45, resizeMode: 'contain' }}
              />
            </View>
          )}
        </GestureHandlerRootView>
      </ScrollView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  pagerView: {
    width: '100%',
    height: '100%',
  },
  pagerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerView: {
    position: 'absolute',
    right: pixelSizeHorizontal(15),
    left: pixelSizeHorizontal(15),
  },
  arrowStyle: {
    position: 'absolute',
    top: '45%',
  },
  rowStyle: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerView: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    right: pixelSizeHorizontal(15),
    left: pixelSizeHorizontal(15),
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPixel(34),
    height: heightPixel(34),
    marginLeft: pixelSizeHorizontal(15),
    borderRadius: pixelSizeHorizontal(20),
    backgroundColor: Theme.brand.green,
  },
})
