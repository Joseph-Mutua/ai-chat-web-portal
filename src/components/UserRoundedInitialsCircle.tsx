import React from 'react'
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { ThemedText } from '@/components/ThemedText'

import { Theme } from '@/constants/Colors'

import { ThemedView } from './ThemedView'

export const UserRoundedInitialsCircle = ({
  firstName = '',
  lastName = '',
  imageUrl,
  customPicContainerStyles,
  onPress,
}: {
  firstName?: string
  lastName?: string
  imageUrl?: string
  customPicContainerStyles?: StyleProp<ViewStyle>
  onPress?: () => void
}) => {
  return imageUrl ? (
    <ThemedView style={[styles.profilePicContainer, customPicContainerStyles]}>
      <Image source={{ uri: imageUrl }} style={styles.profilePic} />
    </ThemedView>
  ) : (
    <Pressable style={styles.container} onPress={onPress}>
      <ThemedText type="small" style={{ color: Theme.brand.white }}>
        {firstName?.charAt(0) + lastName?.charAt(0)}
      </ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: Theme.brand.red,
  },
  profilePicContainer: {
    height: 44,
    width: 44,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profilePic: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
})
