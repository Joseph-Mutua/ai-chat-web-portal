import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import {
  router,
  useLocalSearchParams,
  useNavigation,
  usePathname,
} from 'expo-router'

import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import useModuleItemsAsAttachments from '@/hooks/attachments/useModuleItemsAsAttachments'

import { COMMON_ATTACHMENT_OPTIONS } from '@/messages/common/attachment-options'

import { Attachment, ModulesType } from '@/types'
import { ModuleItemsAsAttachmentType } from '@/types/attachments'

import { UPLOAD_FILE_TYPE } from '@/enums/common'

import { ThemedText } from '../ThemedText'
import { AddedAttachments } from './AddedAttachments'
import { AttachmentOptions } from './AttachmentOptions'
import { UploadPreviews } from './UploadPreviews'

type AddAttachmentsViewProps = {
  attchments: Attachment[]
  emails?: ModuleItemsAsAttachmentType['emails']
  notes?: ModuleItemsAsAttachmentType['notes']
  events?: ModuleItemsAsAttachmentType['events']
  tasks?: ModuleItemsAsAttachmentType['tasks']
  moduleType?: ModulesType
  infoDetails?: { title: string; description: string }
  showTourGuide?: boolean
  uniqueId?: string
  onChanges: (attachments: Attachment[]) => void
  onPressTour?: () => void
}

export const AddAttachmentsView = ({
  attchments,
  emails = [],
  notes = [],
  events = [],
  tasks = [],
  infoDetails,
  showTourGuide,
  moduleType = 'calendarEvent',
  uniqueId,
  onChanges,
  onPressTour,
}: AddAttachmentsViewProps) => {
  const pathName = usePathname()
  // DO NOT REMOVE OR CHANGE EXTRA PARAMS FROM THIS LINE
  const {
    hasItemAttachments,
    attachedItems,
    attachItems,
    resetAttachedItems,
    restorePreAttachedItems,
  } = useModuleItemsAsAttachments()
  const { __EXPO_ROUTER_key, ...rest } = useLocalSearchParams()

  const [showAttachmentsOptions, setShowAttachmentsOptions] = useState(false)
  const [openUploadPreview, setOpenUploadPreview] = useState(false)
  const [previewUploadType, setPreviewUploadType] =
    useState<UPLOAD_FILE_TYPE | null>(null)

  const navigation = useNavigation()

  const hasAttachments = attchments.length > 0 || hasItemAttachments

  useEffect(() => {
    attachItems({
      emails,
      notes,
      events,
      tasks,
    })

    const unsubscribe = navigation.addListener('focus', () =>
      restorePreAttachedItems(uniqueId ?? moduleType)
    )

    return () => {
      resetAttachedItems()
      unsubscribe()
    }
  }, [uniqueId, moduleType])

  const handleOnPressOption = (option: UPLOAD_FILE_TYPE) => {
    // Check if the selected option is common attachment option to show the preview
    const ifAnyOfTheOptions = COMMON_ATTACHMENT_OPTIONS.find(
      (opt) => opt.title === option
    )
    if (ifAnyOfTheOptions) {
      setPreviewUploadType(option)
      setTimeout(() => {
        setOpenUploadPreview(true)
      }, 100)
      setShowAttachmentsOptions(false)
    } else {
      const params = {
        selectAsAttachment: 'yes',
        backUrl: pathName,
        ...rest,
      }

      if (rest?.chatId) {
        params.backUrl = pathName
      }

      switch (option) {
        case UPLOAD_FILE_TYPE.CALENDAR_EVENT:
          router.push({ pathname: '/calendar', params: params })
          break
        case UPLOAD_FILE_TYPE.EMAIL:
          router.push({ pathname: '/emails', params: params })
          break
        case UPLOAD_FILE_TYPE.NOTE:
          router.push({ pathname: '/notes', params: params })
          break
        case UPLOAD_FILE_TYPE.TASK:
          router.push({ pathname: '/tasks', params: params })
          break
        default:
          break
      }
      setShowAttachmentsOptions(false)
    }
  }

  const handleOnPickAttachments = (newAttachments: Attachment[]) => {
    setOpenUploadPreview(false)
    setShowAttachmentsOptions(false)
    onChanges([...attchments, ...newAttachments])
  }

  const renderCustomView = () => {
    if (moduleType === 'notes' || moduleType === 'emails') {
      return (
        <TouchableOpacity
          onPress={() => setShowAttachmentsOptions(true)}
          style={{ ...(moduleType === 'notes' && { marginRight: 10 }) }}
        >
          <Ionicons name="attach-outline" size={22} color={Theme.brand.grey} />
        </TouchableOpacity>
      )
    }

    return hasAttachments ? (
      <ThemedView>
        <AddedAttachments
          attchments={attchments}
          emails={attachedItems.emails}
          notes={attachedItems.notes}
          events={attachedItems.events}
          tasks={attachedItems.tasks}
          isEditable
          editId={uniqueId ?? moduleType}
          onRemoveAttachment={(attachment) =>
            onChanges(attchments.filter((i) => i.id !== attachment.id))
          }
        />

        <Pressable onPress={() => setShowAttachmentsOptions(true)}>
          <ThemedText style={styles.grayText}>Add Attachment</ThemedText>
        </Pressable>
      </ThemedView>
    ) : (
      <Pressable
        style={styles.rowStyle}
        onPress={() => setShowAttachmentsOptions(true)}
      >
        <ThemedText style={styles.titleText}>Add Attachments</ThemedText>

      </Pressable>
    )
  }

  return (
    <>
      {renderCustomView()}
      <AttachmentOptions
        visible={showAttachmentsOptions}
        onCloseOptions={() => setShowAttachmentsOptions(false)}
        onChangeUploadType={handleOnPressOption}
        moduleType={moduleType}
      />

      <UploadPreviews
        visible={openUploadPreview}
        uploadType={previewUploadType as UPLOAD_FILE_TYPE}
        onSelectFiles={handleOnPickAttachments}
        onClose={() => setOpenUploadPreview(false)}
        uploadAttachmentToGCS={false}
      />
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
  },
  grayText: {
    color: Theme.brand.grey,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
})
