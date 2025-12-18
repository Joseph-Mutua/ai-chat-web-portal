import React, { useEffect } from 'react'
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { useLocalSearchParams, useNavigation } from 'expo-router'

import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import { useCachedAttachment } from '@/hooks/attachments/useCachedAttachment'
import useModuleItemsAsAttachments from '@/hooks/attachments/useModuleItemsAsAttachments'

import { getIconForAttachment } from '@/utils/helpers'

import { Attachment, ModulesType } from '@/types'
import {
  CommonItemAttachmentType,
  EmailAsAttachmentType,
  EventAsAttachmentType,
  ModuleItemsAsAttachmentType,
} from '@/types/attachments'

import { ThemedText } from '../ThemedText'
import { ImageViewer } from './ImageViewer'

type AddedAttachmentsProps = {
  attchments: Attachment[]
  emails?: ModuleItemsAsAttachmentType['emails']
  notes?: ModuleItemsAsAttachmentType['notes']
  events?: ModuleItemsAsAttachmentType['events']
  tasks?: ModuleItemsAsAttachmentType['tasks']
  isEditable?: boolean
  editId?: string
  onRemoveAttachment?: (attachment: Attachment) => void
}

type AttachmentItemProps = {
  attachment: Attachment
  isEditable?: boolean
  onRemoveAttachment?: (attachment: Attachment) => void
}

const getModuleIcon = (moduleType: ModulesType) => {
  switch (moduleType) {
    case 'calendarEvent':
      return 'calendar-outline'
    case 'emails':
      return 'mail-outline'
    case 'notes':
      return 'pencil-outline'
    case 'tasks':
      return 'checkbox'
    default:
      return 'document-text'
  }
}

const AttachmentItem = ({
  attachment,
  isEditable,
  onRemoveAttachment,
}: AttachmentItemProps) => {
  const {
    isDownloading,
    downloadedPath,
    previewImage,
    setPreviewImage,
    openAttachment,
  } = useCachedAttachment(attachment, true)

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
    <ThemedView style={[styles.rowStyle, { backgroundColor: 'transparent' }]}>
      <Ionicons name={icon} size={25} color={Theme.brand.black} />

      <Pressable onPress={() => openAttachment()} disabled={isDownloading}>
        <ThemedText
          style={[styles.attText, { ...(isEditable && { fontWeight: '500' }) }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {attachment.name}
        </ThemedText>
      </Pressable>

      {isEditable && (
        <Pressable onPress={handleOnRemoveAttachment}>
          <Ionicons name="close" size={24} color={Theme.brand.black} />
        </Pressable>
      )}

      {isDownloading && (
        <View>
          <Image
            source={require('@/assets/animations/loading-spinner-transparent.gif')}
            style={{ height: 20, aspectRatio: 1, marginLeft: 5 }}
          />
        </View>
      )}

      <ImageViewer
        url={downloadedPath ? `file://${downloadedPath}` : attachment.url}
        visible={previewImage}
        onClose={() => setPreviewImage(false)}
      />
    </ThemedView>
  )
}

const ModuleItemAttachment = ({
  moduleType,
  data,
  isEditable,
  editId,
}: {
  moduleType: ModulesType
  isEditable?: boolean
  editId?: string
  data: CommonItemAttachmentType | EmailAsAttachmentType | EventAsAttachmentType
}) => {
  const { removeAttachment, redirectToDetailsPage } =
    useModuleItemsAsAttachments()

  const icon = getModuleIcon(moduleType)

  // Remove the attachment from the list of attachments
  const onPressRemoveAttachment = () => {
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
          onPress: () =>
            removeAttachment({ id: data.id, moduleName: moduleType }),
        },
      ]
    )
  }

  return (
    <ThemedView style={[styles.rowStyle, { backgroundColor: 'transparent' }]}>
      <Ionicons name={icon} size={25} color={Theme.brand.black} />

      <Pressable
        onPress={() =>
          redirectToDetailsPage(moduleType, data, isEditable, editId)
        }
      >
        <ThemedText
          style={[styles.attText, { ...(isEditable && { fontWeight: '500' }) }]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {'title' in data ? data.title : data?.subject}
        </ThemedText>
      </Pressable>

      {isEditable && (
        <Pressable onPress={onPressRemoveAttachment}>
          <Ionicons name="close" size={24} color={Theme.brand.black} />
        </Pressable>
      )}
    </ThemedView>
  )
}

export const AddedAttachments = ({
  attchments,
  isEditable,
  editId,
  emails = [],
  notes = [],
  events = [],
  tasks = [],
  onRemoveAttachment,
}: AddedAttachmentsProps) => {
  const { attachedItems, hasItemAttachments, attachItems, resetAttachedItems } =
    useModuleItemsAsAttachments()
  const { viewAsAttachment } = useLocalSearchParams()

  const navigation = useNavigation()

  useEffect(() => {
    initItemAttachments()
    const unsubscribe = navigation.addListener('focus', initItemAttachments)

    return () => {
      if (!isEditable && viewAsAttachment != 'yes') {
        resetAttachedItems()
        unsubscribe()
      }
    }
  }, [
    isEditable,
    viewAsAttachment,
    JSON.stringify(emails),
    JSON.stringify(notes),
    JSON.stringify(events),
    JSON.stringify(tasks),
  ])

  const initItemAttachments = () => {
    if (!isEditable) {
      attachItems({
        emails,
        notes,
        events,
        tasks,
      })
    }
  }

  const isEmpty = !hasItemAttachments && attchments.length === 0

  // Render the attached items based on the module type
  const renderItemAttachments = (
    key: 'notes' | 'emails' | 'events' | 'tasks',
    moduleType: ModulesType
  ) => {
    return attachedItems[key].map((item) => (
      <ModuleItemAttachment
        key={`item-${item.id}`}
        data={item}
        moduleType={moduleType}
        isEditable={isEditable}
        editId={editId}
      />
    ))
  }

  return (
    <>
      <ThemedText style={styles.titleText}>
        {isEmpty ? 'No Attachments' : 'Attachments'}
      </ThemedText>
      {!isEmpty && (
        <ThemedView
          style={{
            backgroundColor: 'transparent',
            ...(isEditable ? { marginVertical: 10 } : { marginTop: 10 }),
          }}
        >
          {attchments.map((attachment) => (
            <AttachmentItem
              key={`attachment-${attachment.id}`}
              attachment={attachment}
              isEditable={isEditable}
              onRemoveAttachment={onRemoveAttachment}
            />
          ))}
          {renderItemAttachments('notes', 'notes')}
          {renderItemAttachments('emails', 'emails')}
          {renderItemAttachments('events', 'calendarEvent')}
          {renderItemAttachments('tasks', 'tasks')}
        </ThemedView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 14,
    color: Theme.brand.black,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '80%',
  },
  attText: {
    color: Theme.brand.black,
    fontSize: 14,
    textDecorationLine: 'underline',
    marginLeft: 8,
  },
})
