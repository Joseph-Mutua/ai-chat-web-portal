import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { AwesomeSliderProps, Slider } from 'react-native-awesome-slider'
import { useSharedValue } from 'react-native-reanimated'

import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'

type CustomSliderProps = {
  minValue: number
  maxValue: number
  value: number
  showMinMax?: boolean
  minFormattedValue?: string
  maxFormattedValue?: string
}

export const CustomSlider = ({
  minValue,
  maxValue,
  value,
  showMinMax,
  minFormattedValue,
  maxFormattedValue,
  ...rest
}: CustomSliderProps &
  Omit<AwesomeSliderProps, 'progress' | 'minimumValue' | 'maximumValue'>) => {
  const progress = useSharedValue(value)
  const min = useSharedValue(minValue)
  const max = useSharedValue(maxValue)

  useEffect(() => {
    progress.value = value
  }, [value])

  return (
    <ThemedView>
      <Slider
        {...rest}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
      />

      {showMinMax && (
        <ThemedView style={styles.rowStyle}>
          <ThemedText type={'small'}>{minFormattedValue}</ThemedText>
          <ThemedText type={'small'}>{maxFormattedValue}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
})
