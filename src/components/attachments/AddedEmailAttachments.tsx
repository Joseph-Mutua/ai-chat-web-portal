import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { Theme } from '@/constants/Colors'

import { useCachedAttachment } from '@/hooks/attachments/useCachedAttachment'

import { getIconForAttachment } from '@/utils/helpers'

import { Attachment } from '@/types'

import { HorizontalLine } from '../HorizontalLine'
import { ThemedText } from '../ThemedText'
import { ImageViewer } from './ImageViewer'

type AddedEmailAttachmentsProps = {
  attachments: Attachment[]
  isEditable?: boolean
  loading?: boolean
  onRemoveAttachment?: (attachment: Attachment) => void
}

type AttachmentItemProps = {
  attachment: Attachment
  isEditable?: boolean
  onRemoveAttachment?: (attachment: Attachment) => void
}

const AttachmentItem = ({
  attachment,
  isEditable,
  onRemoveAttachment,
}: AttachmentItemProps) => {
  const {
    isDownloading,
    downloadedPath,
    openAttachment,
    previewImage,
    setPreviewImage,
  } = useCachedAttachment(attachment, true)

  const { mimetype, size } = attachment
  const icon = getIconForAttachment(attachment)

  const handleOnRemoveAttachment = () => {
    Alert.alert(
      'Remove Attachment',
      'Are you sure you want to remove this attachment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemoveAttachment?.(attachment),
        },
      ]
    )
  }

  return (
    <Pressable
      onPress={() => openAttachment()}
      disabled={isDownloading}
      style={styles.rowStyle}
    >
      {mimetype.includes('image') ? (
        <Image
          source={{
            uri: downloadedPath != null ? downloadedPath : attachment.url,
          }}
          style={{ width: 24, height: 24, borderRadius: 6 }}
        />
      ) : (
        <Ionicons
          name={icon}
          size={18}
          color={Theme.brand.grey}
          style={{
            ...(icon === 'attach-outline' && {
              transform: [{ rotate: '-45deg' }],
            }),
          }}
        />
      )}

      <View style={styles.textContainer}>
        <View style={{ flexShrink: 1, marginLeft: 2 }}>
          <ThemedText
            type="small"
            style={styles.attText}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {attachment.name}
          </ThemedText>
          {size && (
            <ThemedText style={styles.sizeText} type="small">
            </ThemedText>
          )}
        </View>
        {isDownloading && (
          <View>
            <Image
              source={require('@/assets/animations/loading-spinner-transparent.gif')}
              style={{ height: 20, aspectRatio: 1, marginLeft: 5 }}
            />
          </View>
        )}
      </View>

      {isEditable && (
        <Pressable onPress={handleOnRemoveAttachment}>
          <Ionicons name="close" size={24} color={Theme.brand.black} />
        </Pressable>
      )}

      <ImageViewer
        url={downloadedPath ? `file://${downloadedPath}` : attachment.url}
        visible={previewImage}
        onClose={() => setPreviewImage(false)}
      />
    </Pressable>
  )
}

export const AddedEmailAttachments = ({
  attachments,
  isEditable,
  loading,
  onRemoveAttachment,
}: AddedEmailAttachmentsProps) => {
  const isEmpty = attachments.length === 0
  return (
    (loading || !isEmpty) && (
      <View>
        {!isEmpty ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.wrapper}
          >
            {attachments.map((attachment, index) => (
              <AttachmentItem
                key={`attachment-${attachment.id}`}
                attachment={attachment}
                isEditable={isEditable}
                onRemoveAttachment={onRemoveAttachment}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View>
              <Image
                source={require('@/assets/animations/loading-spinner-transparent.gif')}
                style={{ height: 20, aspectRatio: 1, marginLeft: 5 }}
              />
            </View>
            <ThemedText style={styles.sizeText}>
              Uploading Attachment…
            </ThemedText>
          </View>
        )}
        <HorizontalLine
          marginVertical={12}
          styleProps={{ backgroundColor: Theme.brand.coolGrey }}
        />
      </View>
    )
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 6,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: Theme.brand.purple[100],
    padding: 8,
    borderRadius: 12,
    maxWidth: '100%',
  },
  attText: {
    color: Theme.brand.black,
    fontSize: 12,
    fontWeight: '500',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 120,
    gap: 6,
  },
  sizeText: {
    fontSize: 10,
    color: Theme.brand.grey,
  },
})
