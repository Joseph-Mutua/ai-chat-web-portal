import { useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'

import { Fontisto, Ionicons } from '@expo/vector-icons'

import { millisecondsToSeconds, secondsToMilliseconds } from 'date-fns'
import { AVPlaybackStatus, AVPlaybackStatusSuccess, Audio } from 'expo-av'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { CustomSlider } from '@/components/input/CustomSlider'

import { Theme } from '@/constants/Colors'

import type { FileType } from '@/types/attachments'

import { formatDuration } from '@/utils/helpers'

const { width } = Dimensions.get('screen')

export const AudioPlayer = ({ audio }: { audio: FileType }) => {
  const audioRef = useRef(new Audio.Sound()).current

  const [audioData, setAudioData] = useState<AVPlaybackStatusSuccess>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    })
  }, [])

  useEffect(() => {
    loadAudio()
    return () => {
      audioRef.unloadAsync()
    }
  }, [audio.uri])

  //load audio
  const loadAudio = async () => {
    try {
      await audioRef.loadAsync({ uri: audio.uri })
      audioRef.setOnPlaybackStatusUpdate(handleAudioData)
    } catch (error) {
      console.log('Error loading audio', error)
    }
  }

  // save audio data to state
  const handleAudioData = (data: AVPlaybackStatus) => {
    if (!data.isLoaded) {
      setError(data.error)
    } else {
      setAudioData(data)
    }
  }

  // play/pause audio
  const handlePlayPause = () => {
    if (!audioData?.isPlaying) {
      audioRef.playFromPositionAsync(audioData?.positionMillis || 0)
    } else {
      audioRef.pauseAsync()
    }
  }

  const renderFooter = () => {
    if (error) {
      return (
        <ThemedView style={styles.footerView}>
          <ThemedText type={'small'}>{error}</ThemedText>

          <TouchableOpacity onPress={loadAudio}>
            <ThemedText
              type={'small'}
              style={{ color: Theme.brand.purple[500] }}
            >
              Retry
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )
    }

    if (audioData) {
      const {
        isPlaying,
        playableDurationMillis,
        positionMillis,
        durationMillis,
      } = audioData

      const totalSeconds = millisecondsToSeconds(
        durationMillis || playableDurationMillis || 0
      )
      const currentPosition = millisecondsToSeconds(positionMillis || 0)

      return (
        <ThemedView style={styles.footerView}>
          {/* Seek Bar */}
          <CustomSlider
            minValue={0}
            maxValue={totalSeconds}
            value={currentPosition}
            onValueChange={(value) =>
              audioRef.setPositionAsync(secondsToMilliseconds(value))
            }
            disableTapEvent={false}
            bubble={(value) => formatDuration(value)}
            style={{ width: width - 30 }}
            theme={{
              minimumTrackTintColor: Theme.brand.purple[500],
              maximumTrackTintColor: Theme.brand.grey,
            }}
            showMinMax={true}
            minFormattedValue={formatDuration(currentPosition)}
            maxFormattedValue={formatDuration(totalSeconds - currentPosition)}
          />

          {/* Play/Pause button */}
          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <Ionicons
              name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
              size={75}
              color={Theme.brand.grey}
            />
          </TouchableOpacity>
        </ThemedView>
      )
    }

    return null
  }

  return (
    <ThemedView style={styles.audioContainer}>
      {/* Audio Icon */}
      <ThemedView style={styles.audioIcon}>
        <Fontisto name="applemusic" size={250} color={Theme.brand.grey} />
      </ThemedView>

      {/* Header View : File name and mute/unmute */}
      <ThemedView style={styles.headerView}>
        <ThemedText type={'defaultSemiBold'} style={styles.textStyle}>
          {audio.name}
        </ThemedText>

        <TouchableOpacity
          style={styles.muteButton}
          onPress={() => audioRef.setIsMutedAsync(!audioData?.isMuted)}
        >
          <Ionicons
            name={audioData?.isMuted ? 'volume-mute' : 'volume-high'}
            size={30}
            color={Theme.brand.grey}
          />
        </TouchableOpacity>
      </ThemedView>

      {renderFooter()}
    </ThemedView>
  )
}

var styles = StyleSheet.create({
  audioContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerView: {
    width: width,
    paddingHorizontal: 15,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  playButton: {
    alignSelf: 'center',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerView: {
    width: width,
    alignItems: 'center',
    paddingTop: 50,
  },
  textStyle: {
    color: Theme.brand.black,
    fontSize: 20,
    marginHorizontal: 30,
    textAlign: 'center',
  },
  muteButton: {
    position: 'absolute',
    right: 15,
    bottom: 0.5,
  },
  audioIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
