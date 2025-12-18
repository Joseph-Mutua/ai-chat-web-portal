import NetInfo from '@react-native-community/netinfo'

import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import { Ionicons } from '@expo/vector-icons'

import { RelativePathString, router } from 'expo-router'

import { Button } from '@/components/ui/elements/button/Button'
import { Body, H4 } from '@/components/ui/elements/typography/Typography'
import { ScreenContainer } from '@/components/ui/layout/ScreenContainer'

import { Theme } from '@/constants/Colors'

import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@/utils/responsive'

import { reportError } from '@/services/bugsnag'

export default function OfflineScreen() {
  const [isChecking, setIsChecking] = useState(false)

  const handleRetry = async () => {
    setIsChecking(true)
    try {
      try {
        const state = await NetInfo.fetch()
        if (state.isConnected && state.isInternetReachable !== false) {
          router.replace('/login' as RelativePathString)
        }
      } catch (error) {
        reportError(error, {
          context: 'Offline Screen',
          severity: 'error',
        })
      }
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.contentContainer}>
        <FastImage
          source={require('@/assets/images/rocket/rocket-flying-stars.png')}
          style={styles.rocketImage}
        />
        <H4>You're offline.</H4>
        <Body style={styles.descriptionText}>
          warpSpeed is standing by—your tools will reconnect and sync the moment
          you're back online.
        </Body>
        <View style={styles.buttonContainer}>
          <Button
            title="Try Again"
            variant="primary"
            onPress={handleRetry}
            isProcessing={isChecking}
            icon={
              <Ionicons name="refresh" size={18} color={Theme.colors.white} />
            }
          />
        </View>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    marginHorizontal: pixelSizeHorizontal(32),
    textAlign: 'center',
    marginTop: pixelSizeVertical(20),
  },
  rocketImage: {
    width: widthPixel(180),
    height: heightPixel(90),
    resizeMode: 'contain',
    marginStart: pixelSizeHorizontal(-30),
  },
  buttonContainer: {
    marginTop: pixelSizeVertical(32),
    width: widthPixel(180),
  },
})
