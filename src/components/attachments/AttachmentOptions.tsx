import { useState } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Ionicons } from '@expo/vector-icons'

import { Button } from '@/components/ui/elements/button/Button'
import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import {
  Body,
  Small,
  Subheading,
} from '@/components/ui/elements/typography/Typography'

import { Theme } from '@/constants/Colors'

import { useDraggableModal } from '@/hooks/useDraggableModal'

import { ATTACHMENT_OPTIONS } from '@/messages/common/attachment-options'

import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@/utils/responsive'

import { ModulesType } from '@/types'

import { UPLOAD_FILE_TYPE } from '@/enums/common'

type Props = {
  visible: boolean
  moduleType: ModulesType
  onCloseOptions: () => void
  onChangeUploadType: (type: UPLOAD_FILE_TYPE) => void
}

type AttachmentOption = {
  icon: string
  title: UPLOAD_FILE_TYPE
}

const AttachmentOptionsContent = ({
  moduleType,
  onCloseOptions,
  onChangeUploadType,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<UPLOAD_FILE_TYPE | null>(
    null
  )

  const handleClose = () => {
    setSelectedOption(null)
    onCloseOptions()
  }

  const { translateY, gestureHandler } = useDraggableModal(handleClose, 30)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const handleAddNow = () => {
    if (selectedOption) {
      onChangeUploadType(selectedOption)
      handleClose()
    }
  }

  return (
    <Modal
      visible
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <GestureHandlerRootView style={styles.gestureContainer}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
              <Animated.View style={[styles.modalContainer, animatedStyle]}>
                {/* Modal Header */}
                <View style={styles.modalHead}>
                  <Subheading>Add Attachment</Subheading>
                  <PressableOpacity
                    style={styles.modalClose}
                    onPress={handleClose}
                  >
                    <Ionicons name="close" size={widthPixel(18)} />
                  </PressableOpacity>
                </View>

                {/* Modal Body */}
                <View style={styles.modalBody}>
                  <Small>Select one:</Small>
                  <View style={styles.optionsList}>
                    {ATTACHMENT_OPTIONS[moduleType].map((option, index) => (
                      <AttachmentOption
                        key={index}
                        option={option}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                      />
                    ))}
                  </View>
                </View>

                {/* Modal Footer */}
                <View style={styles.modalFooter}>
                  <Button
                    title="Add Now"
                    onPress={handleAddNow}
                    disabled={!selectedOption}
                    fullWidth
                    variant="primary"
                  />
                </View>
              </Animated.View>
            </PanGestureHandler>
          </GestureHandlerRootView>
        </Pressable>
      </SafeAreaView>
    </Modal>
  )
}

export const AttachmentOptions = (props: Props) => {
  if (!props.visible) return null
  return <AttachmentOptionsContent {...props} />
}

const AttachmentOption = ({
  option,
  selectedOption,
  setSelectedOption,
}: {
  option: AttachmentOption
  selectedOption: UPLOAD_FILE_TYPE | null
  setSelectedOption: (option: UPLOAD_FILE_TYPE | null) => void
}) => {
  const isSelected = selectedOption === option.title

  return (
    <Pressable
      style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
      onPress={() => setSelectedOption(option.title)}
    >
      <View style={styles.optionContent}>
        <Ionicons
          name={option.icon as keyof typeof Ionicons.glyphMap}
          size={widthPixel(18)}
          color={Theme.brand.black}
          style={{ marginRight: pixelSizeHorizontal(12) }}
        />
        <Body>{option.title}</Body>
      </View>
      <Ionicons
        name="checkmark-circle"
        size={widthPixel(24)}
        color={isSelected ? Theme.colors.primary : 'transparent'}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.black30,
    justifyContent: 'flex-end',
  },
  gestureContainer: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    paddingBottom: pixelSizeVertical(30),
    borderTopLeftRadius: pixelSizeVertical(20),
    borderTopRightRadius: pixelSizeVertical(20),
    backgroundColor: Theme.brand.white,
    overflow: 'hidden',
  },
  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(20),
    paddingTop: pixelSizeVertical(20),
    paddingBottom: pixelSizeVertical(10),
  },
  modalClose: {
    padding: pixelSizeHorizontal(4),
  },
  modalBody: {
    paddingHorizontal: pixelSizeHorizontal(20),
    gap: pixelSizeVertical(12),
  },
  optionsList: {
    gap: pixelSizeVertical(6),
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pixelSizeHorizontal(4),
    paddingVertical: pixelSizeVertical(6),
    borderRadius: pixelSizeVertical(8),
  },
  optionButtonSelected: {
    backgroundColor: Theme.brand.coolGrey,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalFooter: {
    paddingHorizontal: pixelSizeHorizontal(20),
    marginTop: pixelSizeVertical(20),
  },
})
