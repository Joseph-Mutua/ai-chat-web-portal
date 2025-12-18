import { SkParagraph, Skia } from '@shopify/react-native-skia'

import { useEffect, useRef, useState } from 'react'
import { GestureResponderEvent, PanResponder } from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { useSharedValue } from 'react-native-reanimated'

type TextItem = {
  id: number
  text: string
  x: number
  y: number
  color: string
  paragraph: SkParagraph
}

type PathItem = {
  path: string
  color: string
}

const vibrationOpt = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
}

export const useEditImagePanResponder = (
  isDrawingState: boolean,
  imageSize: { width: number; height: number }
) => {
  const [paths, setPaths] = useState<PathItem[]>([])
  const [color, setColor] = useState<string>('blue')
  const [textInputModalVisible, openTextInputModal] = useState<boolean>(false)
  const [isMovingText, setIsMovingText] = useState<boolean>(false)
  const [selectedText, setSelectedText] = useState<TextItem | null>(null)
  const [inputText, setInputText] = useState('')
  const [draggedTextId, setDraggedTextId] = useState<number | null>(null)
  const [redoStack, setRedoStack] = useState<PathItem[]>([])
  const centeredWidth = imageSize.width / 2
  const centeredHeight = imageSize.height / 2
  const imageSizeRef = useRef(imageSize)

  const addedTexts = useRef<TextItem[]>([])
  const draggedTextXY = useRef({ x: useSharedValue(0), y: useSharedValue(0) })
  const currentPath = useRef(useSharedValue('M 0 0'))

  // Reset draggedTextXY values when text is not being dragged or starting a new drag
  useEffect(() => {
    if (draggedTextId !== null) {
      const selectedText = addedTexts.current.find(
        (item) => item.id === draggedTextId
      )
      if (selectedText) {
        draggedTextXY.current.x.value = selectedText.x
        draggedTextXY.current.y.value = selectedText.y
      }
    } else {
      draggedTextXY.current.x.value = 0
      draggedTextXY.current.y.value = 0
    }
  }, [draggedTextId])

  useEffect(() => {
    imageSizeRef.current = imageSize
  }, [imageSize])

  // Handle user's touch gestures to start dragging the text
  const handleStartDrag = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent

    const selectedText = addedTexts.current.find((item) => {
      const textHeight = item.y + item.paragraph.getHeight()
      const textWidth = item.x + item.paragraph.getLongestLine()
      return (
        locationX >= item.x &&
        locationX <= textWidth &&
        locationY >= item.y &&
        locationY <= textHeight
      )
    })

    if (selectedText) {
      setDraggedTextId(selectedText.id)
      setIsMovingText(false)
    }
  }

  //Handle user's touch gestures to move the text
  const handleMovingState = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent

    setDraggedTextId((currentDraggedId) => {
      if (currentDraggedId !== null) {
        addedTexts.current = addedTexts.current.map((item, index) => {
          if (item.id === currentDraggedId) {
            const newX = locationX - item.paragraph.getLongestLine() / 2
            const newY = locationY - item.paragraph.getHeight() / 2
            if (
              Math.abs(newX - draggedTextXY.current.x.value) > 10 ||
              Math.abs(newY - draggedTextXY.current.y.value) > 10
            ) {
              setIsMovingText(true)

              if (checkIfTextInsideDeleteIcon(item.paragraph, newX, newY)) {
                ReactNativeHapticFeedback.trigger('soft', vibrationOpt)
              }
              draggedTextXY.current.x.value = newX
              draggedTextXY.current.y.value = newY
              return { ...item, x: newX, y: newY }
            }
          }
          return item
        })
      }

      return currentDraggedId
    })
  }

  // Handle user's touch gestures to end dragging the text
  const handleEndDrag = () => {
    setDraggedTextId((currentDraggedId) => {
      const foundText = addedTexts.current.find(
        ({ id }) => id === currentDraggedId
      )

      if (foundText) {
        const { x, y, paragraph } = foundText

        if (checkIfTextInsideDeleteIcon(paragraph, x, y)) {
          addedTexts.current = addedTexts.current.filter(
            (item) => item.id !== currentDraggedId
          )
        }

        // set edit mode for selected text
        setIsMovingText((currentIsMovingText) => {
          if (!currentIsMovingText) {
            setSelectedText(foundText)
            setInputText(foundText.text)
            setColor(foundText.color)
            openTextInputModal(true)
          }
          return false
        })
      } else {
        setIsMovingText(false)
      }

      return null
    })
  }

  const drawPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent
        const newPath = `M ${locationX} ${locationY}`
        currentPath.current.value = newPath
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent
        currentPath.current.value = `${currentPath.current.value} L ${locationX} ${locationY}`
      },
      onPanResponderRelease: () => {
        setColor((selectedColour) => {
          setPaths((prev) => [
            ...prev,
            { path: currentPath.current.value, color: selectedColour },
          ])

          currentPath.current.value = 'M 0 0'
          return selectedColour
        })
      },
    })
  ).current

  const textPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: handleStartDrag,
      onPanResponderMove: handleMovingState,
      onPanResponderRelease: handleEndDrag,
    })
  ).current

  // Track if the text is inside the delete icon
  const checkIfTextInsideDeleteIcon = (
    paragraph: SkParagraph,
    x: number,
    y: number
  ) => {
    const textX = x + paragraph.getLongestLine() / 2
    const textY = y + paragraph.getHeight() / 2

    const { height, width } = imageSizeRef.current

    return (
      textX >= width / 2 - 25 &&
      textX <= width / 2 + 15 &&
      textY >= height - 60 &&
      textY <= height - 20
    )
  }

  const updateTexts = (texts: TextItem[]) => {
    addedTexts.current = texts
  }

  const updateCurrentPath = (path: string) => {
    currentPath.current.value = path
  }

  const undoDraw = () => {
    if (paths.length > 0) {
      const lastPath = paths.pop()!
      setRedoStack((prev) => [lastPath, ...prev])
      setPaths([...paths])
    }
  }

  const redoDraw = () => {
    if (redoStack.length > 0) {
      const lastRedoPath = redoStack.shift()!
      setPaths((prev) => [...prev, lastRedoPath])
      setRedoStack([...redoStack])
    }
  }

  // Clear the canvas on click of done button
  const clearCanvas = () => {
    addedTexts.current = []
    currentPath.current.value = 'M 0 0'
    setPaths([])
    setRedoStack([])
  }

  // Add text to the canvas
  const addText = () => {
    openTextInputModal(false)

    if (inputText.trim() === '') return

    const updatevalues = {
      paragraph: Skia.ParagraphBuilder.Make()
        .pushStyle({
          color: Skia.Color(color),
          fontSize: 16,
        })
        .addText(inputText)
        .build(),
      text: inputText,
      color: color,
    }

    if (selectedText != null) {
      let textInfo = { ...selectedText }

      addedTexts.current = addedTexts.current.map((item) => {
        if (item.id === textInfo.id) {
          return {
            ...item,
            ...updatevalues,
          }
        }
        return item
      })

      setSelectedText(null)
    } else {
      addedTexts.current = [
        ...addedTexts.current,
        {
          id: new Date().getTime(),
          x: centeredWidth - 20,
          y: centeredHeight - 20,
          ...updatevalues,
        },
      ]
    }

    setInputText('')
  }

  return {
    isMovingText,
    panResponder: isDrawingState ? drawPanResponder : textPanResponder,
    addedTexts,
    textInputModalVisible,
    selectedText,
    inputText,
    color,
    draggedTextXY,
    draggedTextId,
    paths,
    currentPath,
    setPaths,
    setColor,
    openTextInputModal,
    setSelectedText,
    setInputText,
    setDraggedTextId,
    updateTexts,
    updateCurrentPath,
    undoDraw,
    redoDraw,
    clearCanvas,
    setRedoStack,
    addText,
  }
}
