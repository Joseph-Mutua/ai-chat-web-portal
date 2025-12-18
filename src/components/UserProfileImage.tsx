import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { ThemedText, ThemedTextProps } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import type { UserType } from '@/types'

export function UserProfileImage({
  user,
  containerStyle,
  containerFontStyle,
  initialsProps,
  showTick,
  asIcon,
  colored,
  disabled,
  onPress,
}: {
  user?: UserType | null
  containerStyle?: object
  containerFontStyle?: object
  initialsProps?: ThemedTextProps
  showTick?: boolean
  asIcon?: string
  colored?: boolean
  disabled?: boolean
  onPress?: () => void
}) {
  const getInitials = (firstName?: string, lastName?: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
    return `${firstInitial}${lastInitial}`
  }

  const initials = user?.title
    ? getInitials(user?.title)
    : getInitials(user?.firstName, user?.lastName)

  const colors = [
    '#5C6BC0',
    '#D81B60',
    '#D4E157',
    '#FF7043',
    '#009688',
    '#26C6DA',
  ]
  const colorIndex = initials.charCodeAt(0) % colors.length
  const backgroundColor = colors[colorIndex]

  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.profilePicContainer,
          containerStyle,
          {
            backgroundColor: colored
              ? backgroundColor
              : Theme.brand.purple[100],
          },
        ]}
      >
        {user?.profileImageUrl || user?.profileImage ? (
          <Image
            source={{ uri: user.profileImageUrl || user?.profileImage?.url }}
            style={styles.profilePic}
          />
        ) : asIcon ? (
          <Ionicons
            name={asIcon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={Theme.brand.black}
          />
        ) : (
          <ThemedText
            type="small"
            style={[styles.initialsText, containerFontStyle]}
            {...initialsProps}
          >
            {initials}
          </ThemedText>
        )}
      </TouchableOpacity>
      {showTick && (
        <ThemedView style={styles.tickIcon}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={Theme.brand.green}
          />
        </ThemedView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  profilePicContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  profilePic: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  initialsText: {
    fontWeight: 'bold',
  },
  tickIcon: {
    position: 'absolute',
    right: 0,
    overflow: 'hidden',
    height: 24,
    width: 24,
    borderRadius: 12,
    borderColor: Theme.brand.green,
    backgroundColor: Theme.brand.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
})
