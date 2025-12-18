import { ImageZoom } from '@likashefqet/react-native-image-zoom'

import React from 'react'
import {
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Ionicons } from '@expo/vector-icons'

import { Theme } from '@/constants/Colors'

export const ImageViewer = ({
  url,
  visible,
  onClose,
}: {
  url: string
  visible: boolean
  onClose: () => void
}) => {
  const { top } = useSafeAreaInsets()

  const topPadding = Platform.OS === 'ios' ? top : StatusBar.currentHeight || 0

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, backgroundColor: Theme.brand.black }}
          pointerEvents="box-none"
        >
          <ImageZoom
            uri={url}
            style={{ flex: 1 }}
            minScale={1}
            maxScale={10}
            doubleTapScale={3}
            isDoubleTapEnabled
          />
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { top: topPadding }]}
          >
            <Ionicons name="close" size={32} color={Theme.brand.white} />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  closeButton: { position: 'absolute', right: 16 },
})
