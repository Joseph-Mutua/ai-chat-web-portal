import {
  Canvas,
  Paragraph,
  Path,
  Skia,
  Image as SkiaImage,
  Text as SkiaText,
  useFont,
  useImage,
} from '@shopify/react-native-skia'

import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import RNFS from 'react-native-fs'
import Cropper from 'react-native-image-cropview'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Ionicons } from '@expo/vector-icons'

import { SaveFormat, manipulateAsync } from 'expo-image-manipulator'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import { useEditImagePanResponder } from '@/hooks/attachments/useEditImagePanResponder'

import type { FileType } from '@/types/attachments'

import { ColorPicker } from './ColorPicker'

type MediaEditorProps = {
  file: FileType
  isEditable: boolean
  onViewMode: () => void
  onEditImage: (file: FileType) => void
}

type CroppedLayout = {
  x: number
  y: number
  width: number
  height: number
}

// IconButton component for Rotate, Crop, Text, Draw, Undo, Redo
const IconButton = ({
  onPress,
  icon,
  size,
  color,
  extraStyle,
}: {
  onPress: () => void
  icon: keyof typeof Ionicons.glyphMap
  size?: number
  color?: string
  extraStyle?: ViewStyle
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.buttonStyle, extraStyle]}>
    <Ionicons name={icon} color={color} size={size || 30} />
  </TouchableOpacity>
)

// Rounded border button for Reset
const ResetButton = ({
  onPress,
  disabled,
}: {
  onPress: () => void
  disabled?: boolean
}) => (
  <TouchableOpacity
    style={[styles.resetButton, { opacity: disabled ? 0.5 : 1 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <ThemedText type="small">Reset</ThemedText>
  </TouchableOpacity>
)

// TextButton component for Done and Cancel buttons
const TextButton = ({
  onPress,
  text,
}: {
  onPress: () => void
  text: string
}) => (
  <TouchableOpacity onPress={onPress}>
    <ThemedText
      type="defaultSemiBold"
      style={{
        color: text === 'Done' ? Theme.brand.purple[500] : Theme.brand.grey,
      }}
    >
      {text}
    </ThemedText>
  </TouchableOpacity>
)

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export const MediaEditor: React.FC<MediaEditorProps> = ({
  file,
  isEditable,
  onViewMode,
  onEditImage,
}) => {
  const [editableImage, setEditableImage] = useState<FileType>({ ...file })
  const [isEnabledCrop, enabledCrop] = useState<boolean>(false)
  const [isEnabledDraw, enabledDraw] = useState<boolean>(false)
  const [showReset, setShowReset] = useState<boolean>(false)
  const [isEnabledText, setIsEnableText] = useState<boolean>(false)
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
  const [skiaImage, setSkiaImage] = useState<any>(null)

  const insets = useSafeAreaInsets()

  //delete icon
  const deleteIcon = useImage(require('../../assets/images/rounded-delete.png'))
  const deleteFont = useFont(
    require('../../assets/fonts/Inter-VariableFont.ttf'),
    12
  )

  // Scale based on desired resizeMode behavior
  const scaleX = screenWidth / (skiaImage?.width() ?? 1)
  const scaleY =
    (screenHeight - (isEditable ? 100 : 150)) / (skiaImage?.height() ?? 1)

  // Use scale factor depending on the desired resizeMode to SkiaImage
  const scale = Math.min(scaleX, scaleY) // Equivalent to "contain"

  const imageSize = {
    width: (skiaImage?.width() ?? 0) * scale,
    height: (skiaImage?.height() ?? 0) * scale,
  }

  const {
    panResponder,
    draggedTextId,
    isMovingText,
    addedTexts,
    draggedTextXY,
    currentPath,
    paths,
    color,
    inputText,
    selectedText,
    textInputModalVisible,
    openTextInputModal,
    setInputText,
    setColor,
    setPaths,
    undoDraw,
    redoDraw,
    clearCanvas,
    setRedoStack,
    updateTexts,
    addText,
  } = useEditImagePanResponder(isEnabledDraw, imageSize)

  const skiaViewRef = useRef<{ makeImageSnapshot: () => any } | null>(null)
  const inputRef = useRef<TextInput | null>(null)

  useEffect(() => {
    initializeEditableImage()
  }, [file])

  useEffect(() => {
    const data = Skia.Data.fromBase64(editableImage.base64 || '')
    const backgroundImage = Skia.Image.MakeImageFromEncoded(data)

    setSkiaImage(backgroundImage)
  }, [editableImage])

  useEffect(() => {
    setShowReset(file.uri != editableImage.uri)
  }, [editableImage.uri])

  const saveDrawing = async () => {
    if (!skiaViewRef.current) {
      Alert.alert('Error', 'Unable to save the drawing.')
      return
    }

    try {
      // Convert canvas to Base64
      const snapshot = skiaViewRef?.current?.makeImageSnapshot()
      const base64 = snapshot.encodeToBase64() // Encode to Base64

      // Define file path
      const filePath = `${RNFS.DocumentDirectoryPath}/drawing.png`

      // Write Base64 to a file
      await RNFS.writeFile(filePath, base64, 'base64')

      setEditableImage({
        ...editableImage,
        base64: base64,
        uri: `file://${filePath}`,
        type: 'image/png',
      })

      // Reset the canvas
      handleOnCancelFilter()
    } catch (error) {
      Alert.alert('Error', 'Failed to save the drawing.')
    }
  }

  // Reset the image to the original state
  const initializeEditableImage = () => {
    // convert HEIC to JPEG
    if (file.type === 'image/heic') {
      manipulateAsync(file.uri, [], {
        format: SaveFormat.JPEG,
        base64: true,
      })
        .then((result) => {
          setEditableImage({ ...file, ...result })
        })
        .catch((error) => {
          setEditableImage({ ...file })
        })
    } else {
      setEditableImage({ ...file })
    }
  }

  const handleRotateImage = async () => {
    try {
      const manipulatedImage = await manipulateAsync(
        editableImage.uri,
        [{ rotate: 90 }],
        { base64: true }
      )

      setEditableImage({ ...editableImage, ...manipulatedImage })
    } catch (error) {
      console.error('Error manipulating image: ', error)
    }
  }

  const handleCroppedImage = async (layout: CroppedLayout) => {
    try {
      const manipulatedImage = await manipulateAsync(
        editableImage.uri,
        [
          {
            crop: {
              originX: layout.x,
              originY: layout.y,
              width: layout.width,
              height: layout.height,
            },
          },
        ],
        { base64: true }
      )

      setEditableImage({ ...editableImage, ...manipulatedImage })
      enabledCrop(false)
    } catch (error) {
      console.log('Error manipulating image: ', error)
    }
  }

  const handleDoneButton = async () => {
    const base64 = await RNFS.readFile(editableImage.uri, 'base64')

    onEditImage({
      ...editableImage,
      base64: base64,
    })
  }

  const handleOnCancelFilter = () => {
    if (isEnabledDraw) {
      setPaths([])
      setRedoStack([])
      enabledDraw(false)
    }

    if (isEnabledText) {
      updateTexts([])
      setIsEnableText(false)
    }
  }

  const focusTextInput = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.blur()
        inputRef.current.focus()
      }
    }, 500)
  }

  // Render the editor options : Cancel, Rotate, Crop, Text, Draw, Reset, Done
  const renderEditorOptions = () => (
    <ThemedView style={styles.options}>
      <ThemedView style={styles.optionsContainer}>
        <IconButton icon={'sync'} size={25} onPress={handleRotateImage} />
        <IconButton icon={'crop-outline'} onPress={() => enabledCrop(true)} />
        <TouchableOpacity
          style={[styles.buttonStyle, { marginTop: 5 }]}
          onPress={() => setIsEnableText(true)}
        >
          <ThemedText style={styles.textStyle}>T</ThemedText>
        </TouchableOpacity>
        <IconButton icon={'create-outline'} onPress={() => enabledDraw(true)} />
        <ResetButton onPress={initializeEditableImage} disabled={!showReset} />
      </ThemedView>

      <IconButton
        icon={'checkmark'}
        onPress={handleDoneButton}
        size={32}
        extraStyle={{ marginRight: 20 }}
      />
      <IconButton icon={'close'} onPress={onViewMode} size={32} />
    </ThemedView>
  )

  // Render the drawing/Text options : Cancel, Color Picker, Undo, Redo, Reset, Done
  const renderOptions = () => (
    <View style={styles.options}>
      <TextButton text={'Cancel'} onPress={handleOnCancelFilter} />

      {isEnabledDraw ? (
        <>
          <IconButton icon={'arrow-undo-outline'} onPress={undoDraw} />
          <IconButton icon={'arrow-redo-outline'} onPress={redoDraw} />
          <IconButton
            icon={'ellipse'}
            color={color}
            onPress={() => setShowColorPicker(true)}
          />
        </>
      ) : (
        <>
          <IconButton
            icon={'text-outline'}
            onPress={() => openTextInputModal(true)}
          />
          <IconButton
            icon={'ellipse'}
            color={color}
            onPress={() => setShowColorPicker(true)}
            extraStyle={{ position: 'absolute', left: '50%' }}
          />
          <View style={{ width: 30 }} />
        </>
      )}

      <ResetButton onPress={clearCanvas} />
      <TextButton text={'Done'} onPress={saveDrawing} />
    </View>
  )

  const renderTextOptions = () => (
    <Modal
      visible={textInputModalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={addText}
      onShow={focusTextInput}
    >
      <TouchableWithoutFeedback onPress={addText}>
        <View style={styles.overlay}>
          <IconButton
            icon={'ellipse'}
            color={color}
            onPress={() => setShowColorPicker(true)}
            extraStyle={{
              position: 'absolute',
              top: insets.top + (Platform.OS === 'android' ? 10 : 0),
            }}
          />
          <TextInput
            style={[styles.input, { color: color }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter text here"
            ref={inputRef}
            multiline={true}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )

  const renderEditableImage = () => {
    if (isEnabledCrop) {
      return (
        <Cropper
          uri={`data:${editableImage.type};base64,${editableImage.base64}`}
          onDone={handleCroppedImage}
          onCancel={() => enabledCrop(false)}
          getImageSize={() =>
            Promise.resolve({
              width: imageSize.width / scale,
              height: imageSize.height / scale,
            })
          }
          showHeader={true}
          backgroundColor={Theme.brand.white}
          gridColor={Theme.brand.grey}
          cancelTextColor={Theme.brand.grey}
          resetTextColor={Theme.brand.black}
          doneTextColor={Theme.brand.purple[500]}
        />
      )
    }

    if (isEnabledDraw || isEnabledText) {
      return (
        <>
          {renderOptions()}

          <View style={styles.imageContainer} {...panResponder.panHandlers}>
            <Canvas
              style={[
                styles.canvas,
                { height: imageSize.height, width: imageSize.width },
              ]}
              ref={skiaViewRef}
            >
              {skiaImage && (
                <SkiaImage
                  image={skiaImage}
                  x={0}
                  y={0}
                  width={imageSize.width}
                  height={imageSize.height}
                />
              )}
              {isEnabledDraw ? (
                <>
                  {paths.map((p, i) => (
                    <Path
                      key={`path-${i}`}
                      path={p.path}
                      color={p.color}
                      style="stroke"
                      strokeWidth={4}
                    />
                  ))}
                  <Path
                    path={currentPath.current}
                    color={color}
                    style="stroke"
                    strokeWidth={4}
                  />
                </>
              ) : (
                <>
                  {addedTexts.current
                    .filter(
                      (item) =>
                        item.id != (selectedText != null ? selectedText.id : '')
                    )
                    .map((item, index) => (
                      <Paragraph
                        key={`text-${index}`}
                        paragraph={item.paragraph}
                        x={
                          item.id === draggedTextId
                            ? draggedTextXY.current.x
                            : item.x
                        }
                        y={
                          item.id === draggedTextId
                            ? draggedTextXY.current.y
                            : item.y
                        }
                        width={screenWidth}
                      />
                    ))}
                  {isMovingText && (
                    <>
                      <SkiaText
                        text={'Drag to delete'}
                        y={imageSize.height - 70}
                        x={imageSize.width / 2 - 50}
                        font={deleteFont}
                        color={Theme.brand.white}
                        strokeWidth={5}
                        strokeJoin={'round'}
                      />
                      {deleteIcon && (
                        <SkiaImage
                          image={deleteIcon}
                          y={imageSize.height - 60}
                          x={imageSize.width / 2 - 25}
                          width={40}
                          height={40}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </Canvas>
          </View>
        </>
      )
    }

    return (
      <>
        {isEditable && renderEditorOptions()}
        <View style={{ flex: 1 }}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `data:${editableImage.type};base64,${editableImage.base64}`,
              }}
              resizeMode="contain"
              style={{
                width: imageSize.width,
                height: imageSize.height,
                maxHeight: screenHeight * 0.76,
                marginBottom: isEditable ? 0 : 50,
              }}
            />
          </View>
        </View>
      </>
    )
  }

  return (
    <View style={styles.container}>
      {renderEditableImage()}

      <ColorPicker
        color={color}
        visible={showColorPicker}
        onChangeColor={(color) => {
          setColor(color)
          setShowColorPicker(false)
        }}
      />
      {renderTextOptions()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  options: {
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  optionsContainer: {
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },

  buttonStyle: {
    justifyContent: 'center',
    height: 30,
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  textStyle: {
    fontSize: 24,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasText: {
    width: '100%',
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 0.6,
    borderColor: Theme.brand.grey,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default MediaEditor
