import { useEffect } from 'react'
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native'

import { Audio } from 'expo-av'
import { VideoView, useVideoPlayer } from 'expo-video'

import { Theme } from '@/constants/Colors'

const { width, height } = Dimensions.get('screen')

export const VideoPlayer = ({
  video,
  customStyle,
  allowsFullscreen = true,
  nativeControls = true,
}: {
  video: string
  customStyle?: ViewStyle
  allowsFullscreen?: boolean
  nativeControls?: boolean
}) => {
  const player = useVideoPlayer(video)

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    })
  }, [])

  return (
    <View style={[styles.videoContainer, customStyle]}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={allowsFullscreen}
        nativeControls={nativeControls}
      />
    </View>
  )
}

// Later on in your styles..
var styles = StyleSheet.create({
  videoContainer: {
    width: width,
    height: height - 150,
    backgroundColor: Theme.brand.white,
  },
  video: {
    flex: 1,
  },
})
