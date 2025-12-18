import { StyleSheet, TouchableOpacity } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { RelativePathString, router } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

type TextTypes =
  | 'title'
  | 'link'
  | 'small'
  | 'default'
  | 'defaultSemiBold'
  | 'defaultLight'
  | 'subtitle'
  | 'header'

export function Header({
  title,
  taskId,
  textType = 'title',
  isProccessing,
  backHref,
  routeBack,
  customNav,
}: {
  title?: string
  taskId?: string
  textType?: TextTypes
  isProccessing?: boolean
  backHref?: string
  routeBack?: boolean
  customNav?: () => void
}) {
  const backArrowEnabled = routeBack || backHref
  return (
    <ThemedView style={styles.headerContainer}>
      {backArrowEnabled && (
        <TouchableOpacity
          disabled={isProccessing}
          onPress={() =>
            customNav
              ? customNav()
              : routeBack
                ? router.back()
                : router.navigate({
                    pathname: backHref as RelativePathString,
                    ...(taskId ? { params: { id: taskId } } : {}),
                  })
          }
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={isProccessing ? Theme.brand.grey : Theme.brand.black}
          />
        </TouchableOpacity>
      )}
      {title && (
        <ThemedText style={styles.flex1} numberOfLines={1} type={textType}>
          {title}
        </ThemedText>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
})
