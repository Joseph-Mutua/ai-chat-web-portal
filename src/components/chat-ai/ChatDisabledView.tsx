import { Dimensions, StyleSheet } from 'react-native'

import { Button } from '@/components//Button'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { ScrollContainer } from '@/components/page/ScrollContainer'

import ChatDisabled from '@/assets/svgs/warpy-colour-2.svg'

export const ChatDisabledView = ({
  handleDataSharing,
}: {
  handleDataSharing?: () => void
}) => {
  return (
    <ScrollContainer
      scrollPrompt={{ show: true, downIndicator: true }}
      style={{ flex: 1 }}
    >
      <ThemedView style={styles.assistantContainer}>
        {/* Assistant header */}
        <ThemedView style={styles.headerView}>
          <ChatDisabled width={100} height={100} />
          <ThemedText style={styles.textStyle}>
            This page is unavailable because data sharing is turned off.
          </ThemedText>
          <ThemedText style={styles.textStyle}>
            Enable data sharing in settings to access this feature.
          </ThemedText>
          <Button
            title="Data Sharing Controls"
            loading={false}
            onPress={() => handleDataSharing && handleDataSharing()}
            customOpacityStyles={styles.buttonStyle}
          />
        </ThemedView>
        <ThemedView style={styles.contentView} />
      </ThemedView>
    </ScrollContainer>
  )
}

const styles = StyleSheet.create({
  assistantContainer: {
    alignItems: 'center',
    marginTop: 64,
    gap: 24,
    flex: 1,
    justifyContent: 'flex-end',
  },
  assistantImage: {
    width: 100,
    height: 105,
  },
  headerView: {
    alignItems: 'center',
    width: '90%',
    gap: 16,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonStyle: {
    width: Dimensions.get('window').width - 32,
  },
  contentView: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
