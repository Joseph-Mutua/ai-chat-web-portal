import { useEffect, useRef } from 'react'
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native'
import Svg, {
  Circle,
  Defs,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg'

import { SvgComponent } from '@/components/SvgComponent'

import { Theme } from '@/constants/Colors'

type AnimatedBorderProps = {
  active: boolean
  size: number
  strokeWidth?: number
  style?: ViewStyle
}

const AnimatedView = Animated.createAnimatedComponent(View)

const RotatingBorder = ({
  active,
  size,
  strokeWidth = 4,
  style,
}: AnimatedBorderProps) => {
  const spin = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!active) {
      spin.stopAnimation()
      spin.setValue(0)
      return
    }
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    loop.start()
    return () => loop.stop()
  }, [active, spin])

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const radius = (size - strokeWidth) / 2
  const circle = 2 * Math.PI * radius
  const dash = 1 * circle
  const gap = circle - dash
  const center = size / 2

  return (
    <AnimatedView
      style={[
        {
          width: size,
          height: size,
          transform: [{ rotate }],
          shadowColor: Theme.brand.purple[500],
        },
        styles.shadows,
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <SvgLinearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={Theme.brand.purple[300]} />
            <Stop offset="50%" stopColor={Theme.brand.purple[500]} />
            <Stop offset="100%" stopColor={Theme.brand.green} />
          </SvgLinearGradient>
        </Defs>

        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#g)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
    </AnimatedView>
  )
}

export const WarpSpeedAIcon = ({
  active,
  size = 34,
  marginTop = 6,
  viewStyle,
}: {
  active: boolean
  isProcessing?: boolean
  size?: number
  containerStyle?: ViewStyle
  marginTop?: number
  viewStyle?: ViewStyle
}) => {
  const padding = 6
  const box = size + padding * 2
  const radius = box / 2

  return (
    <View
      style={[
        styles.container,
        {
          marginTop,
          width: box,
          height: box,
          borderRadius: radius,
          backgroundColor: active ? Theme.brand.white : Theme.brand.green,
        },
        viewStyle,
      ]}
    >
      {active && (
        <RotatingBorder
          active={active}
          size={box}
          strokeWidth={2}
          style={styles.border}
        />
      )}
      <SvgComponent
        slug={active ? 'warpspeed-ai-active' : 'warpspeed-ai-white'}
        width={size}
        height={size}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    pointerEvents: 'none',
  },
  shadows: {
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
})
