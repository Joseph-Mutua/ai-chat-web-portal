import { StyleSheet } from 'react-native'

import { ThemedText } from '@/components/ThemedText'

import { Theme } from '@/constants/Colors'

export function ErrorText({ error }: { error: string }) {
  return (
    <ThemedText type="defaultSemiBold" style={styles.errorMsg}>
      {error}
    </ThemedText>
  )
}

const styles = StyleSheet.create({
  errorMsg: {
    fontSize: 14,
    marginTop: 2,
    paddingLeft: 4,
    paddingRight: 4,
    color: Theme.brand.red,
    backgroundColor: 'transparent',
  },
})
