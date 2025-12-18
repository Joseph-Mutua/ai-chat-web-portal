import { StyleSheet, View } from 'react-native'

import { Theme } from '@/constants/Colors'

export function HorizontalLine({
  marginVertical = 0,
  marginTop = 0,
  marginBottom = 0,
  styleProps = undefined,
}: {
  marginVertical?: number
  marginTop?: number
  marginBottom?: number
  styleProps?: object
}) {
  const generateAdditionalStyles = () => {
    const styles: {
      marginVertical?: number
      marginTop?: number
      marginBottom?: number
    } = {}
    if (!!marginVertical) {
      styles['marginVertical'] = marginVertical
    }
    if (!!marginTop) {
      styles['marginTop'] = marginTop
    }
    if (!!marginBottom) {
      styles['marginBottom'] = marginBottom
    }
    return styles
  }
  return <View style={[styles.line, generateAdditionalStyles(), styleProps]} />
}

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Theme.brand.grey,
  },
})
