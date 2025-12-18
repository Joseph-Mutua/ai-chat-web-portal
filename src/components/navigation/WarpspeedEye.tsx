import { ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'

import { SvgComponent } from '@/components/SvgComponent'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

export const WarpspeedEye = ({
  active,
  isProcessing = false,
  size,
  marginTop = 10,
  viewStyle,
}: {
  active: boolean
  isProcessing?: boolean
  size?: number
  containerStyle?: ViewStyle
  marginTop?: number
  viewStyle?: ViewStyle
}) => (
  <ThemedView
    style={[
      { marginTop: marginTop, backgroundColor: 'transparent' },
      viewStyle,
    ]}
  >
    {!isProcessing ? (
      <SvgComponent
        slug={active ? 'warpspeed-ai-active' : 'warpspeed-ai-inactive'}
        width={size ? size : 34}
        height={size ? size : 34}
        color={Theme.brand.black}
      />
    ) : (
      <FastImage
        source={require('@/assets/animations/loading-spinner.gif')}
        style={{
          width: size ? size : 34,
          height: size ? size : 34,
        }}
      />
    )}
  </ThemedView>
)
