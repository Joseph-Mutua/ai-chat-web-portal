import { useCallback, useEffect } from 'react'
import { BackHandler, FlatList, StyleSheet, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { RelativePathString, router, useLocalSearchParams } from 'expo-router'

import { SourceCard } from '@/components/chat-ai/SourceCard'
import { LoadingContainer } from '@/components/page/LoadingContainer'
import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { DividerStandard } from '@/components/ui/elements/divider/DividerStandart'
import { Typography } from '@/components/ui/elements/typography/Typography'
import { ScreenContainer } from '@/components/ui/layout/ScreenContainer'

import { Theme } from '@/constants/Colors'

import { useChatSources } from '@/hooks/api'

import { pixelSizeHorizontal, pixelSizeVertical } from '@/utils/responsive'

export default function Sources() {
  const {
    conversationId,
    messageId,
    backUrl,
    fromAIAssistant,
    path,
    params,
    data,
  } = useLocalSearchParams<{
    conversationId: string
    messageId: string
    backUrl?: string
    fromAIAssistant?: string
    path?: string
    params?: string
    data?: string
  }>()

  const { data: sources, isPending } = useChatSources(conversationId, messageId)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    )

    return () => backHandler.remove()
  }, [handleBackPress])

  const handleBackPress = useCallback(() => {
    if (fromAIAssistant === 'true') {
      router.replace({
        pathname: `/ai-assistant`,
        params: {
          conversationId: conversationId as string,
          path,
          params,
          data,
        },
      })
      return true
    }

    if (backUrl) {
      router.replace(backUrl as RelativePathString)
      return true
    }

    router.back()
    return true
  }, [fromAIAssistant, backUrl, conversationId])

  return (
    <ScreenContainer withSafeAreaView={false} withScroll>
      {isPending ? (
        <LoadingContainer />
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.container}
          data={sources}
          keyExtractor={(_, index) => `source-${index}`}
          renderItem={(props) => <SourceCard {...props} />}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <DividerStandard />}
          ListHeaderComponent={
            <View style={styles.headerView}>
              <PressableOpacity onPress={handleBackPress}>
                <Ionicons name="arrow-back-outline" size={28} color="black" />
              </PressableOpacity>

              <Typography variant="h4">Sources</Typography>
            </View>
          }
          bounces={false}
        />
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(12),
    paddingVertical: pixelSizeVertical(12),
    gap: pixelSizeHorizontal(10),
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.greyLight,
  },
  container: {
    flexGrow: 1,
    paddingBottom: pixelSizeVertical(16),
  },
  list: {
    flex: 1,
    backgroundColor: Theme.brand.white,
  },
})
