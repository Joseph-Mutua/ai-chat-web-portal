import { Image, Linking, StyleSheet, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { Typography } from '@/components/ui/elements/typography/Typography'

import { Theme } from '@/constants/Colors'

import { useNotifications } from '@/hooks/context'

import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@/utils/responsive'

import { SourceType } from '@/types/chat-ai'

export const SourceCard = ({
  item,
  index,
}: {
  item: SourceType
  index: number
}) => {
  const { pushNotification } = useNotifications()

  // Function to handle the link press
  const onPressLink = () => {
    const errorMessage = 'Unable to open URI: ' + item.url

    Linking.openURL(item.url).catch((err) => {
      pushNotification({ title: 'Error', text: errorMessage })
    })
  }

  const renderSourcesButton = () => (
    <PressableOpacity style={styles.sourcesButton} onPress={onPressLink}>
      {item.logo ? (
        <Image source={{ uri: item.logo }} style={styles.sourceIcon} />
      ) : (
        <Ionicons name="link-outline" size={20} color="black" />
      )}
      <Typography variant="caption" numberOfLines={1}>
        {item.publisher ? item.publisher : 'Source'}
      </Typography>
    </PressableOpacity>
  )

  return (
    <View style={styles.container}>
      <Typography variant="body" style={styles.title}>
        {index + 1}. {item.title != '' ? item.title : 'Reference'}
      </Typography>
      {item.description != '' && (
        <Typography variant="body" style={styles.description} numberOfLines={2}>
          {item.description}
        </Typography>
      )}
      {renderSourcesButton()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: pixelSizeVertical(16),
  },
  title: {
    fontWeight: '500',
    marginBottom: pixelSizeVertical(10),
  },
  description: {
    marginBottom: pixelSizeVertical(13),
  },
  sourcesButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pixelSizeVertical(5),
    paddingHorizontal: pixelSizeHorizontal(8),
    borderRadius: widthPixel(10),
    gap: pixelSizeHorizontal(6),
    borderWidth: 0.8,
    borderColor: Theme.brand.grey,
    backgroundColor: Theme.brand.white,
    shadowColor: Theme.brand.grey,
    shadowOpacity: 0.5,
    shadowOffset: { width: 1, height: 1 },
    elevation: 4,
  },
  sourceIcon: {
    height: heightPixel(20),
    aspectRatio: 1,
    borderRadius: widthPixel(15),
    resizeMode: 'contain',
  },
})
