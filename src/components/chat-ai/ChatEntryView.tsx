import { useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import { SvgComponent } from '@/components/SvgComponent'
import { AIChatPromptSuggestions } from '@/components/animations/AIChatPromptSuggestions'
import { Typography } from '@/components/ui/elements/typography/Typography'

import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@/utils/responsive'

export const ChatEntryView = ({
  isProcessing = false,
  isChatModule = false,
  SubTextComponent,
  containerStyle,
}: {
  isChatModule?: boolean
  isProcessing?: boolean
  triggerSendMessage: (msg: string) => void
  handleHistoryPress?: () => void
  handleNewChat?: () => void
  SubTextComponent?: () => JSX.Element
  containerStyle?: object
}) => {
  const size = useMemo(() => {
    return isChatModule ? 70 : 54
  }, [isChatModule])

  return (
    <View style={[styles.assistantContainer, containerStyle]}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.headerView}>
          {isProcessing ? (
            <FastImage
              source={require('@/assets/animations/loading-spinner.gif')}
              style={{ height: 72, width: 72 }}
            />
          ) : (
            <SvgComponent
              slug="warpspeed-ai-active"
              width={size}
              height={size}
            />
          )}

          <Typography variant="h4" style={{ marginTop: pixelSizeVertical(8) }}>
            How can I help you today?
          </Typography>

          {isChatModule && <AIChatPromptSuggestions />}
          {SubTextComponent && <SubTextComponent />}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  assistantContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pixelSizeHorizontal(20),
  },
  assistantImage: {
    width: widthPixel(100),
    height: heightPixel(105),
    marginBottom: pixelSizeVertical(10),
  },
  headerView: {
    alignItems: 'center',
    paddingVertical: pixelSizeVertical(20),
  },
  chatModuleHeader: {},
})
