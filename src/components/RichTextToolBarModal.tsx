import React, { RefObject, useState } from 'react'
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { FontAwesome5, Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { RichEditor, RichToolbar } from '@/components/rich-text-editor/src'

import { Theme } from '@/constants/Colors'

import { useFeatureFlag } from '@/hooks/useFeatureFlag'

import { fontPixel, heightPixel } from '@/utils/responsive'
import { applyFontSizeSelection } from '@/utils/rich-editor-handlers'

import RichTextEditor from './rich-text-editor/src/RichEditor'

const toolbarActions = [
  'bold',
  'italic',
  'underline',
  'fontSizePick',
  'unorderedList',
  'orderedList',
]

export const RichTextToolBarModal = ({
  refEditor,
  activeFormats,
  isRichToolbarVisible,
  allActionModalPosition,
  setRichToolbarVisible,
  selectedFontSize = '16',
  setSelectedFontSize,
  tempSize = '16',
  setTempSize,
}: {
  refEditor: React.RefObject<RichTextEditor | null>
  activeFormats: Record<string, boolean>
  isRichToolbarVisible: boolean
  allActionModalPosition: { x: number; y: number }
  setRichToolbarVisible: (v: boolean) => void
  selectedFontSize?: string
  setSelectedFontSize?: (size: string) => void
  tempSize?: string
  setTempSize?: (size: string) => void
}) => {
  const isFontSizingEnabled = useFeatureFlag('richEditorFontSizing')

  const [showFontSizePick, setShowFontSizePick] = useState(false)

  if (!isRichToolbarVisible) return null

  const applyFormatting = (command: string, action?: string) => {
    refEditor.current?.injectJavascript(`
      if (window.restoreEditorSelection) {
        window.restoreEditorSelection();
      }
      if (document.queryCommandState("${command}")) {
        document.execCommand("${command}", false, null);
      } else {
        document.execCommand("${command}", false, null);
      }
      window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'FORMAT_STATE', format: "${action ?? command}", active: document.queryCommandState("${command}")})
      );
      true;
    `)

    setTimeout(() => {
      setRichToolbarVisible(false)
    }, 450)
  }

  const handleSelectFontSize = (size: string) => {
    if (setSelectedFontSize) {
      setSelectedFontSize(size)
    }
    applyFontSizeSelection(refEditor as RefObject<RichEditor>, size)
  }

  return (
    <Pressable
      onPressOut={() => setRichToolbarVisible(false)}
      style={StyleSheet.absoluteFill}
    >
      <View
        style={[
          styles.modalView,
          {
            top: allActionModalPosition.y,
            left: allActionModalPosition.x,
            zIndex: 9999,
          },
        ]}
        pointerEvents="box-none"
      >
        <RichToolbar
          key={`toolbar-${selectedFontSize}-${showFontSizePick}`}
          editor={refEditor}
          actions={toolbarActions.filter(
            (action) => action !== 'fontSizePick' || isFontSizingEnabled
          )}
          iconMap={{
            bold: () => (
              <ToolbarIconWrapper
                activeFormats={activeFormats}
                iconSlug="bold"
                onPress={() => applyFormatting('bold')}
              >
                <ThemedText
                  style={[
                    styles.iconsCommonStyle,
                    {
                      color: activeFormats?.bold
                        ? Theme.brand.black
                        : Theme.brand.grey,
                    },
                  ]}
                >
                  B
                </ThemedText>
              </ToolbarIconWrapper>
            ),
            italic: () => (
              <ToolbarIconWrapper
                activeFormats={activeFormats}
                iconSlug="italic"
                onPress={() => applyFormatting('italic')}
              >
                <ThemedText
                  style={[
                    styles.iconsCommonStyle,
                    {
                      color: activeFormats?.italic
                        ? Theme.brand.black
                        : Theme.brand.grey,
                      fontStyle: 'italic',
                    },
                  ]}
                >
                  I
                </ThemedText>
              </ToolbarIconWrapper>
            ),
            underline: () => (
              <ToolbarIconWrapper
                activeFormats={activeFormats}
                iconSlug="underline"
                onPress={() => applyFormatting('underline')}
              >
                <ThemedText
                  style={[
                    styles.iconsCommonStyle,
                    {
                      color: activeFormats?.underline
                        ? Theme.brand.black
                        : Theme.brand.grey,
                      textDecorationLine: 'underline',
                    },
                  ]}
                >
                  U
                </ThemedText>
              </ToolbarIconWrapper>
            ),
            unorderedList: () => (
              <ToolbarIconWrapper
                activeFormats={activeFormats}
                iconSlug="unorderedList"
                onPress={() =>
                  applyFormatting('insertUnorderedList', 'unorderedList')
                }
              >
                <FontAwesome5
                  name="list"
                  size={20}
                  color={
                    activeFormats?.unorderedList
                      ? Theme.brand.black
                      : Theme.brand.grey
                  }
                />
              </ToolbarIconWrapper>
            ),
            orderedList: () => (
              <ToolbarIconWrapper
                activeFormats={activeFormats}
                iconSlug="orderedList"
                onPress={() =>
                  applyFormatting('insertOrderedList', 'orderedList')
                }
              >
                <FontAwesome5
                  name="list-ol"
                  size={20}
                  color={
                    activeFormats?.orderedList
                      ? Theme.brand.black
                      : Theme.brand.grey
                  }
                />
              </ToolbarIconWrapper>
            ),
            ...(isFontSizingEnabled
              ? {
                fontSizePick: () => (
                  <TouchableOpacity
                    onPress={() => setShowFontSizePick(true)}
                    style={styles.fontSizePickerButton}
                  >
                    <Text style={styles.fontSizeText}>
                      {selectedFontSize || '16'}
                    </Text>
                    <Ionicons
                      name="caret-down-outline"
                      size={14}
                      color={Theme.brand.grey}
                    />
                  </TouchableOpacity>
                ),
              }
              : {}),
          }}
          flatContainerStyle={styles.subToolbarContainer}
          style={[
            styles.subToolbar,
            { minWidth: isFontSizingEnabled ? 280 : 0 },
          ]}
        />
      </View>
    </Pressable>
  )
}

const ToolbarIconWrapper = ({
  activeFormats,
  iconSlug,
  children,
  onPress,
}: {
  activeFormats: Record<string, boolean>
  iconSlug: string
  children: React.ReactNode
  onPress: () => void
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      {
        backgroundColor: activeFormats?.[iconSlug]
          ? Theme.brand.coolGrey
          : 'transparent',
        borderRadius: 5,
      },
      pressed && { opacity: 0.6 },
    ]}
  >
    <ThemedView
      style={[
        styles.iconsCommonStyle,
        {
          alignItems: 'center',
          backgroundColor: activeFormats?.[iconSlug]
            ? Theme.brand.coolGrey
            : 'transparent',
          borderRadius: 5,
          width: '100%',
        },
      ]}
    >
      {children}
    </ThemedView>
  </Pressable>
)

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  subToolbar: {
    height: 35,
    minWidth: 280,
    borderRadius: 8,
    backgroundColor: Theme.brand.white,
    shadowColor: Theme.brand.black,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: Platform.OS === 'android' ? 10 : 0,
  },
  subToolbarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  iconsCommonStyle: {
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  fontSizePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: heightPixel(2),
    borderColor: Theme.brand.grey,
    borderRadius: heightPixel(4),
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 40,
    justifyContent: 'center',
  },
  fontSizeText: {
    fontSize: fontPixel(14),
    color: Theme.brand.grey,
  },
})
