import { useBackHandler } from '@react-native-community/hooks'
import { DrawerNavigationOptions } from '@react-navigation/drawer'

import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Ionicons } from '@expo/vector-icons'

import {
  RelativePathString,
  router,
  useGlobalSearchParams,
  usePathname,
} from 'expo-router'
import { Drawer } from 'expo-router/drawer'

import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { H3 } from '@/components/ui/elements/typography/Typography'
import { CollapsibleHeader } from '@/components/ui/layout/CollapsibleHeader'

import { Theme } from '@/constants/Colors'

import { useGetScreenTitle } from '@/hooks/useScreenTitle'

import { pixelSizeHorizontal } from '@/utils/responsive'

const profileImageSize = 34

const isFromViewMode = ({
  calendarId,
  viewAsAttachment,
  pathname,
}: {
  calendarId?: string
  viewAsAttachment?: string
  pathname?: string
}) => {
  const isCalendarView = calendarId && pathname === `/calendar/${calendarId}`

  return viewAsAttachment === 'yes' && isCalendarView
}

export default function DrawerLayout() {
  const title = useGetScreenTitle()
  const insets = useSafeAreaInsets()
  const pathname = usePathname()

  const {
    selectAsAttachment,
    viewAsAttachment,
    backUrl,
    calendarId,
  } = useGlobalSearchParams()

  const moduleParams = {
    calendarId,
  }

  const isViewMode = isFromViewMode(moduleParams as Record<string, string>)

  useBackHandler(() => {
    if (selectAsAttachment === 'yes' || isViewMode) {
      router.push({
        pathname: backUrl as RelativePathString,
        params: moduleParams,
      })
      return true
    }

    if (backUrl) {
      try {
        router.replace({
          pathname: backUrl as RelativePathString,
          params: moduleParams,
        })
        return true
      } catch {
        return false
      }
    }

    return false
  }, [])

  const getDrawerOptions = () => {
    let options: DrawerNavigationOptions = {
      headerLeft: () => (
        <PressableOpacity
          style={styles.headerLeft}
          onPress={() => router.push('/')}
        >
          <H3>{title ?? 'Home'}</H3>
        </PressableOpacity>
      ),
      headerRight: () => (
        <PressableOpacity onPress={() => { }}>
          <Ionicons
            name="person-circle-outline"
            size={profileImageSize}
            color={Theme.colors.black}
            style={styles.menuIcon}
          />
        </PressableOpacity>
      ),
    }

    if (selectAsAttachment === 'yes') {
      options = {
        headerRight: () => null,
        headerLeft: () => (
          <View style={styles.rowStyle}>
            <H3>{title ?? 'Home'}</H3>
            <PressableOpacity
              onPress={() =>
                router.replace({
                  pathname: backUrl as RelativePathString,
                  params: moduleParams,
                })
              }
            >
              <Ionicons
                name="person-circle-outline"
                size={profileImageSize}
                color={Theme.colors.black}
                style={styles.menuIcon}
              />
            </PressableOpacity>
          </View>
        ),
      }
    } else if (viewAsAttachment === 'yes') {
      options = {
        headerLeft: () => null,
        headerRight: () => null,
        headerStyle: {
          height: insets.top,
          backgroundColor: Theme.colors.black,
        },
      }
    }

    return {
      headerShown: false,
      swipeEnabled: false,
      ...options,
    }
  }

  return (
    <>
      <CollapsibleHeader title={title ?? 'Home'} />
      <Drawer screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="(tabs)" options={getDrawerOptions} />
      </Drawer>
    </>
  )
}

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    paddingHorizontal: pixelSizeHorizontal(10),
  },
  logo: {
    marginLeft: pixelSizeHorizontal(16),
    width: '100%',
  },
  menuIcon: {
    marginRight: pixelSizeHorizontal(16),
  },
  profileImage: {
    width: profileImageSize,
    height: profileImageSize,
    borderRadius: profileImageSize / 2,
    marginRight: pixelSizeHorizontal(16),
  },
})
