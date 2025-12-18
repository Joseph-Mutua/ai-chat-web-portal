import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { SvgComponent } from '@/components/SvgComponent'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { PulseShadowWrapper } from '@/components/animations/PulseShadowWrapper'

import { Theme } from '@/constants/Colors'

export const AbsoluteBottomButton = ({
  title,
  icon,
  svg,
  size,
  showTour = false,
  onPress,
  boxStyle,
}: {
  title?: string
  icon?: string
  svg?: string
  size?: number
  showTour?: boolean
  onPress: () => void
  boxStyle?: StyleProp<ViewStyle>
}) => {
  return (
    <ThemedView style={styles.addEventBox}>
      <PulseShadowWrapper isAnimated={showTour} style={styles.shadowStyle}>
        <ThemedView style={[styles.boxStyle, boxStyle]}>
          <TouchableOpacity onPress={onPress}>
            <ThemedView style={{ backgroundColor: 'transparent' }}>
              {icon && (
                <Ionicons
                  name={icon as keyof typeof Ionicons.glyphMap}
                  size={size}
                  color={Theme.brand.white}
                />
              )}
              {svg && <SvgComponent slug={svg} width={size} height={size} />}
              {title && (
                <ThemedText type="small" style={styles.addEventBoxText}>
                  {title}
                </ThemedText>
              )}
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </PulseShadowWrapper>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  addEventBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 12,
    backgroundColor: 'transparent',
  },
  boxStyle: {
    borderRadius: 12,
    backgroundColor: Theme.brand.purple[500],
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  shadowStyle: {
    paddingVertical: 0,
    borderRadius: 12,
  },
  addEventBoxText: {
    color: Theme.brand.white,
    fontWeight: 'bold',
  },
})
