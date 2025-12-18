import { ReactNode } from 'react'
import {
  Animated,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Ionicons } from '@expo/vector-icons'

import { router, usePathname } from 'expo-router'

import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { H1 } from '@/components/ui/elements/typography/Typography'

import { Theme } from '@/constants/Colors'

import { useUser } from '@/hooks/api'

import { pixelSizeHorizontal, pixelSizeVertical } from '@/utils/responsive'

import { useCollapsibleHeader } from '@/contexts/collapsible-header-provider'

interface Props {
  title: string | ReactNode
}

const profileImageSize = 42

export function CollapsibleHeader({ title }: Props) {
  const insets = useSafeAreaInsets()

  const { headerTranslateY, headerHeightWithInset } = useCollapsibleHeader()

  const { data } = useUser()

  const userProfileImage = data?.profileImage?.url

  return (
    <>
      <View style={[styles.headerSpacer, { height: insets.top }]} />
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeightWithInset,
            paddingTop: insets.top,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.contentContainer}>
          <PressableOpacity onPress={() => router.push('/')}>
            <H1>{title ?? 'warpSpeed'}</H1>
          </PressableOpacity>

          <PressableOpacity onPress={() => {}}>
            {userProfileImage ? (
              <Image
                source={{ uri: userProfileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={profileImageSize}
                color={Theme.colors.black}
                style={styles.menuIcon}
              />
            )}
          </PressableOpacity>
        </View>
      </Animated.View>
    </>
  )
}

export const CollapsibleSubHeaderWrapper = ({
  children,
}: {
  children: ReactNode
}) => {
  const { headerHeightWithInset, subHeaderTranslateY } = useCollapsibleHeader()

  return (
    <Animated.View
      style={[
        styles.subHeader,
        {
          top: headerHeightWithInset,
          transform: [{ translateY: subHeaderTranslateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}

export const CollapsibleHeaderSpacer = ({
  children,
}: {
  children: ReactNode
}) => {
  const pathname = usePathname()
  const { headerHeightWithInset } = useCollapsibleHeader()

  const hideHeader = pathname === '/emails/email-flow'

  return (
    <View
      style={{ flex: 1, paddingTop: hideHeader ? 0 : headerHeightWithInset }}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  headerSpacer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 996,
    backgroundColor: Theme.brand.ghostWhite,
  },
  header: {
    justifyContent: 'flex-end',
    position: 'absolute',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingBottom: pixelSizeVertical(8),
    top: 0,
    left: 0,
    right: 0,
    zIndex: 995,
    backgroundColor: Theme.brand.ghostWhite,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIcon: {
    marginRight: pixelSizeHorizontal(16),
  },
  profileImage: {
    width: profileImageSize,
    height: profileImageSize,
    borderRadius: profileImageSize / 2,
  },
  subHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
})
