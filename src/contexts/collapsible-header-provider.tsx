import { ReactNode, createContext, useContext, useEffect, useRef } from 'react'
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { usePathname } from 'expo-router'

const headerHeight = 60
const subheaderHeight = 40

interface CollapsibleHeaderContextType {
  scrollY: Animated.Value
  scrollYClamped: Animated.Value
  headerTranslateY: Animated.AnimatedInterpolation<number>
  subHeaderTranslateY: Animated.AnimatedInterpolation<number>
  headerHeightWithInset: number
  totalCollapsibleHeight: number
  headerHeight: number
  subheaderHeight: number
  listProps: {
    onScroll: ReturnType<typeof Animated.event>
    scrollEventThrottle: number
  }
}

const CollapsibleHeaderContext = createContext<CollapsibleHeaderContextType>({
  scrollY: new Animated.Value(0),
  scrollYClamped: new Animated.Value(0),
  headerTranslateY: new Animated.Value(0),
  subHeaderTranslateY: new Animated.Value(0),
  headerHeightWithInset: 0,
  totalCollapsibleHeight: 0,
  headerHeight: headerHeight,
  subheaderHeight: subheaderHeight,
  listProps: {
    onScroll: () => {},
    scrollEventThrottle: 16,
  },
})

interface Props {
  children: ReactNode
}

export function CollapsibleHeaderProvider({ children }: Props) {
  const pathname = usePathname()

  const insets = useSafeAreaInsets()
  const scrollY = useRef(new Animated.Value(0)).current
  const scrollYClamped = useRef(new Animated.Value(0)).current

  const headerHeightWithInset = headerHeight + insets.top
  const totalCollapsibleHeight = headerHeightWithInset + subheaderHeight

  const clamped = Animated.diffClamp(scrollYClamped, 0, headerHeight)

  useEffect(() => {
    scrollY.setValue(0)
    scrollYClamped.setValue(0)
  }, [pathname])

  const handleScroll = useRef(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y
        scrollYClamped.setValue(Math.max(0, offsetY))
      },
    })
  ).current

  const headerTranslateY = clamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  })

  const subHeaderTranslateY = clamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  })

  return (
    <CollapsibleHeaderContext.Provider
      value={{
        scrollY,
        scrollYClamped,
        headerTranslateY,
        subHeaderTranslateY,
        headerHeightWithInset,
        totalCollapsibleHeight,
        headerHeight,
        subheaderHeight,
        listProps: {
          onScroll: handleScroll,
          scrollEventThrottle: 16,
        },
      }}
    >
      {children}
    </CollapsibleHeaderContext.Provider>
  )
}

export const useCollapsibleHeader = () => useContext(CollapsibleHeaderContext)
