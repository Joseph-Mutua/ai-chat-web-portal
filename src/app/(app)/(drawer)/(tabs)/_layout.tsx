import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Tabs, useGlobalSearchParams } from 'expo-router'

import { CustomBottomTabBar } from '@/components/navigation/CustomBottomTabBar'

import { Theme } from '@/constants/Colors'

const TabsComponent = () => {
  const { selectAsAttachment, viewAsAttachment } = useGlobalSearchParams()

  const isAttachment = useMemo(
    () => selectAsAttachment === 'yes' || viewAsAttachment === 'yes',
    [selectAsAttachment, viewAsAttachment]
  )

  return (
    <Tabs
      tabBar={
        isAttachment ? () => null : (props: any) => <CustomBottomTabBar {...props} />
      }
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      detachInactiveScreens
    >
      <Tabs.Screen name="index" />

      <Tabs.Screen
        name="chat-ai"
        options={{ href: null, lazy: true, freezeOnBlur: true }}
      />
    </Tabs>
  )
}

export default function TabsLayout() {
  return (
    <>
      <View style={styles.placeholder} />
      <TabsComponent />
    </>
  )
}

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 60,
    width: '100%',
    zIndex: 1,
    backgroundColor: Theme.brand.white,
  },
})
