import React from 'react'
import { StyleSheet, View } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import { Theme } from '@/constants/Colors'

import { ThemedText } from '../ThemedText'

export const GradientProgressBar = ({ progress = 0 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <LinearGradient
          colors={[
            Theme.brand.green,
            Theme.brand.purple['500'],
            Theme.brand.purple['300'],
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>
      <View style={styles.progressView}>
        <ThemedText type="small" style={styles.progressText}>
          Your Progress: {progress}%
        </ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  progressBackground: {
    width: 250,
    height: 20,
    backgroundColor: Theme.brand.grey,
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 20,
  },
  progressText: {
    color: Theme.brand.white,
    lineHeight: 18,
  },
  progressView: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
