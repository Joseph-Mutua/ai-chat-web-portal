import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { Theme } from '@/constants/Colors'

import { isDoc } from '@/utils/identifyFileCategory'

import { Attachment } from '@/types'

import { SvgComponent } from '../SvgComponent'

interface AttachmentPreviewProps {
  hasRemove?: boolean
  attachments: Attachment[]
  onRemoveAttachment?: (id: string) => void
  onViewAttachment: (attachment: Attachment) => void
  onLongPressAttachment?: (attachment: Attachment) => void
}

const getFileIcon = (
  mimeType?: string,
  type?: string
): keyof typeof Ionicons.glyphMap => {
  if (!mimeType && !type) return 'document-outline'

  const mime = mimeType || type || ''

  if (mime.startsWith('image/')) return 'image-outline'
  if (mime.startsWith('audio/')) return 'musical-notes-outline'
  if (
    mime.includes('pdf') ||
    mime.includes('text') ||
    mime.includes('word') ||
    mime.includes('doc')
  )
    return 'document-text-outline'

  return 'document-outline'
}

const truncateFileName = (name: string, maxLength: number = 10) => {
  if (name.length <= maxLength) return name
  const lastDotIndex = name.lastIndexOf('.')
  if (lastDotIndex === -1) return `${name.substring(0, maxLength - 3)}...`

  const extension = name.split('.').pop()
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'))
  const truncatedName = nameWithoutExt.substring(0, maxLength - 3)

  const last3Chars = name.substring(
    nameWithoutExt.length - 3,
    nameWithoutExt.length
  )
  return `${truncatedName}...${last3Chars}${extension ? `.${extension}` : ''}`
}

const AttachmentItem = ({
  attachment,
  hasRemove = true,
  onRemove,
  onView,
  onLongPress,
}: {
  attachment: Attachment
  hasRemove?: boolean
  onRemove?: (id: string) => void
  onView: (attachment: Attachment) => void
  onLongPress?: (attachment: Attachment) => void
}) => {
  const isImage = attachment?.mimetype?.startsWith('image/')
  const isPDF = attachment?.mimetype?.includes('pdf')
  const _isDoc = isDoc(attachment?.name, attachment?.mimetype)

  const renderFileIcon = () => {
    if (isPDF) {
      return <SvgComponent slug="documents-pdf" width={24} height={24} />
    }
    if (_isDoc)
      return <SvgComponent slug="documents-doc" width={24} height={24} />

    return (
      <Ionicons
        name={getFileIcon(attachment.mimetype)}
        size={24}
        color={Theme.brand.green}
      />
    )
  }
  return (
    <View
      style={[
        styles.attachmentItem,
        !isImage && { width: 130, marginHorizontal: 10 },
      ]}
    >
      <Pressable
        style={styles.attachmentContent}
        onPress={() => onView(attachment)}
        onLongPress={() => onLongPress?.(attachment)}
      >
        {isImage ? (
          <Image
            source={{ uri: attachment?.url }}
            style={styles.imageThumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.fileIconContainer}>
            {renderFileIcon()}
            <Text style={styles.fileName} numberOfLines={1}>
              {truncateFileName(attachment.name)}
            </Text>
          </View>
        )}
      </Pressable>

      {hasRemove && (
        <Pressable
          style={[styles.removeButton, !isImage && { top: -6, right: -13 }]}
          onPress={() => onRemove?.(attachment.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.removeButtonCircle}>
            <Ionicons name="close" size={14} color={Theme.brand.black} />
          </View>
        </Pressable>
      )}
    </View>
  )
}

export const AttachmentPreview = ({
  hasRemove,
  attachments,
  onRemoveAttachment,
  onViewAttachment,
  onLongPressAttachment,
}: AttachmentPreviewProps) => {
  if (attachments.length === 0) return null

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {attachments.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            hasRemove={hasRemove}
            onRemove={onRemoveAttachment}
            onView={onViewAttachment}
            onLongPress={onLongPressAttachment}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 100,
    marginBottom: 8,
    marginTop: 10,
    marginHorizontal: 10,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  attachmentItem: {
    position: 'relative',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  attachmentContent: {
    alignItems: 'center',
    width: '100%',
  },
  imageThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Theme.brand.lightGrey,
  },
  fileIconContainer: {
    width: 150,
    height: 40,
    borderRadius: 8,
    backgroundColor: Theme.brand.lightGrey,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 12,
    color: Theme.brand.black,
    textAlign: 'center',
    marginTop: 4,
    marginLeft: 4,
    maxWidth: '100%',
  },
  fileSize: {
    fontSize: 8,
    color: Theme.brand.grey,
    textAlign: 'center',
    marginTop: 2,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 1,
  },
  removeButtonCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Theme.brand.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.brand.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
})
