import { ParamListBase, TabNavigationState } from '@react-navigation/native'

import { useMemo } from 'react'
import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


import { router } from 'expo-router'

import { ThemedView } from '@/components/ThemedView'

import { Colors, Theme } from '@/constants/Colors'

import { useColorScheme } from '@/hooks/useColorScheme'

import { TabBarIcon } from './TabBarIcon'
import { WarpSpeedAIcon } from './WarpSpeedAIcon'

type PropType = {
  state: TabNavigationState<ParamListBase>
}

export const CustomBottomTabBar = ({ state }: PropType) => {
  const colorScheme = useColorScheme()
  const { bottom } = useSafeAreaInsets()
  const palette = useMemo(() => Colors[colorScheme ?? 'light'], [colorScheme])

  const focusedScreen = state.routes[state.index].name

  // Handle tab presses: navigate to the respective screen
  const onPressTab = (e: GestureResponderEvent) => {
    e.preventDefault()
    router.push('/(app)/(drawer)/(tabs)/chat-ai')
  }

  return (
    <ThemedView
      style={[
        styles.tabBarStyle,
        { marginBottom: bottom },
      ]}
    >
      <TabBarIcon
        name={focusedScreen === 'index' ? 'home' : 'home-outline'}
        color={focusedScreen === 'index' ? palette.activeTint : palette.tint}
      />
      <TabBarIcon
        name={focusedScreen === 'calendar' ? 'calendar' : 'calendar-outline'}
        color={palette.activeTint}
      />
      <Pressable onPress={(e) => onPressTab(e)}>
        <WarpSpeedAIcon active={focusedScreen === 'ai-assistant'} />
      </Pressable>
      <TabBarIcon
        name={'checkbox-outline'}
        color={focusedScreen === 'tasks' ? palette.activeTint : palette.tint}
      />

      <TabBarIcon
        name='pencil'
        color={focusedScreen === 'notes' ? palette.activeTint : palette.tint}
      />

    </ThemedView>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    zIndex: 1,
    paddingHorizontal: 30,
    borderTopColor: Theme.brand.coolGrey,
  },
})
