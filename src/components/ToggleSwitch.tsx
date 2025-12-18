import { Pressable, StyleSheet } from 'react-native'

import { Theme } from '@/constants/Colors'

import { ThemedView } from './ThemedView'

export function ToggleSwitch({
  enabled = false,
  disableField = false,
  onSwitch,
}: {
  enabled?: boolean
  disableField?: boolean
  onSwitch: () => void
}) {
  return !disableField ? (
    <Pressable onPress={onSwitch}>
      <ThemedView
        style={[styles.container, enabled && styles.enabledContainer]}
      >
        <ThemedView style={[styles.circle, enabled && styles.enabledCircle]} />
      </ThemedView>
    </Pressable>
  ) : (
    <ThemedView
      style={[
        styles.container,
        enabled && styles.enabledContainer,
        disableField && styles.disabledSwitch,
      ]}
    >
      <ThemedView style={[styles.circle, enabled && styles.enabledCircle]} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 48,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.brand.grey,
    padding: 2,
  },
  enabledContainer: {
    justifyContent: 'flex-end',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Theme.brand.grey,
  },
  enabledCircle: {
    backgroundColor: Theme.brand.green,
  },
  disabledSwitch: {
    opacity: 0.3,
  },
})
