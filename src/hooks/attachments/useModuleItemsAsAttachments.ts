import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import cloneDeep from 'lodash/cloneDeep'

import {
  RelativePathString,
  router,
  useLocalSearchParams,
  usePathname,
} from 'expo-router'

import { ModulesType } from '@/types'
import {
  CommonItemAttachmentType,
  EmailAsAttachmentType,
  EventAsAttachmentType,
  ModuleItemsAsAttachmentType,
} from '@/types/attachments'

const defaultValues: ModuleItemsAsAttachmentType = {
  emails: [],
  notes: [],
  events: [],
  tasks: [],
}

const defaultPrevValues: { [key: string]: ModuleItemsAsAttachmentType } = {}

const useModuleItemsAsAttachments = () => {
  const queryClient = useQueryClient()
  const pathName = usePathname()
  // DO NOT REMOVE OR CHANGE EXTRA PARAMS FROM THIS LINE
  const { __EXPO_ROUTER_key, ...rest } = useLocalSearchParams()

  const { data: attachedItems } = useQuery<ModuleItemsAsAttachmentType>({
    queryKey: ['attachmentManager'],
    queryFn: () => cloneDeep(defaultValues),
    initialData: (queryClient.getQueryData(['attachmentManager']) ||
      cloneDeep(defaultValues)) as ModuleItemsAsAttachmentType,
    staleTime: Infinity,
  })

  const { data: preAttachedItems } = useQuery({
    queryKey: ['preAttachedItems'],
    queryFn: () => defaultPrevValues,
    initialData: () =>
      (queryClient.getQueryData(['preAttachedItems']) || defaultPrevValues) as {
        [key: string]: ModuleItemsAsAttachmentType
      },
    staleTime: Infinity,
  })

  const { data: previousManager } = useQuery<ModuleItemsAsAttachmentType>({
    queryKey: ['previousManager'],
    queryFn: () => cloneDeep(defaultValues),
    initialData: (queryClient.getQueryData(['previousManager']) ||
      cloneDeep(defaultValues)) as ModuleItemsAsAttachmentType,
    staleTime: Infinity,
  })

  // Check if there are any items attached to the list of attachments
  const { data: hasItemAttachments } = useQuery({
    queryKey: ['hasItemAttachments'],
    queryFn: () => false,
    initialData: (queryClient.getQueryData(['hasItemAttachments']) ||
      attachedItems.emails.length > 0 ||
      attachedItems.notes.length > 0 ||
      attachedItems.events.length > 0 ||
      attachedItems.tasks.length > 0) as boolean,
    staleTime: Infinity,
  })

  const { data: hasPreviousManagerApplied = false } = useQuery<boolean>({
    queryKey: ['hasPreviousManagerApplied'],
    queryFn: () => false,
    staleTime: Infinity,
  })

  // Attach items to the list of attachments to be uploaded
  const attachItems = useMutation({
    mutationFn: (values: ModuleItemsAsAttachmentType) => {
      return new Promise<void>((resolve) => {
        queryClient.setQueryData(['attachmentManager'], values)
        const hasAttachment =
          values.emails.length > 0 ||
          values.notes.length > 0 ||
          values.events.length > 0 ||
          values.tasks.length > 0
        queryClient.setQueryData(['hasItemAttachments'], hasAttachment)

        resolve()
      })
    },
  })

  // Reset the list of attachments to be uploaded
  const resetAttachedItems = useMutation({
    mutationFn: () => {
      return new Promise<void>((resolve) => {
        queryClient.setQueryData(['attachmentManager'], defaultValues)
        queryClient.setQueryData(['hasItemAttachments'], false)
        resolve()
      })
    },
  })

  // Add Pre-attached items to the list of attachments to be uploaded
  const saveAsPreAttached = useMutation({
    mutationFn: (id: string) => {
      return new Promise<void>((resolve) => {
        queryClient.setQueryData(['preAttachedItems'], { [id]: attachedItems })
        resolve()
      })
    },
  })

  const restorePreAttachedItems = useMutation({
    mutationFn: (id: string) => {
      return new Promise<void>((resolve) => {
        if (id in preAttachedItems) {
          const matchedItems = preAttachedItems[id]

          queryClient.setQueryData(['attachmentManager'], matchedItems)

          const hasAttachment =
            matchedItems.emails.length > 0 ||
            matchedItems.notes.length > 0 ||
            matchedItems.events.length > 0 ||
            matchedItems.tasks.length > 0
          queryClient.setQueryData(['hasItemAttachments'], hasAttachment)

          const tempPreAttachedItems = preAttachedItems
          delete tempPreAttachedItems[id]
          queryClient.setQueryData(['preAttachedItems'], tempPreAttachedItems)
        }
        resolve()
      })
    },
  })

  // Add email as attachment to the list of attachments to be uploaded
  const addEmailAsAttachment = useMutation({
    mutationFn: (email: EmailAsAttachmentType) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(attachedItems)
        const isExist = temp.emails.find((e) => e.id === email.id)
        if (isExist) {
          resolve()
        } else {
          temp.emails.push({
            id: email.id,
            emailAccountId: email.emailAccountId,
            subject: email.subject,
          })
          queryClient.setQueryData(['attachmentManager'], temp)
          queryClient.setQueryData(['hasItemAttachments'], true)
          resolve()
        }
      })
    },
  })

  // Add calendar event as attachment to the list of attachments to be uploaded
  const addEventAsAttachment = useMutation({
    mutationFn: (event: EventAsAttachmentType) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(attachedItems)
        const isExist = temp.events.find((e) => e.id === event.id)
        if (isExist) {
          resolve()
        } else {
          temp.events.push({
            id: event.id,
            title: event.title,
            calendarId: event.calendarId,
          })
          queryClient.setQueryData(['attachmentManager'], temp)
          queryClient.setQueryData(['hasItemAttachments'], true)
          resolve()
        }
      })
    },
  })

  // Add task as attachment to the list of attachments to be uploaded
  const addTaskAsAttachment = useMutation({
    mutationFn: (task: CommonItemAttachmentType) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(attachedItems)
        const isExist = temp.tasks.find((e) => e.id === task.id)
        if (isExist) {
          resolve()
        } else {
          temp.tasks.push({ id: task.id, title: task.title })
          queryClient.setQueryData(['attachmentManager'], temp)
          queryClient.setQueryData(['hasItemAttachments'], true)
          resolve()
        }
      })
    },
  })

  // Add note as attachment to the list of attachments to be uploaded
  const addNoteAsAttachment = useMutation({
    mutationFn: (note: CommonItemAttachmentType) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(attachedItems)
        const isExist = temp.notes.find((e) => e.id === note.id)
        if (isExist) {
          resolve()
        } else {
          temp.notes.push({ id: note.id, title: note.title })
          queryClient.setQueryData(['attachmentManager'], temp)
          queryClient.setQueryData(['hasItemAttachments'], true)
          resolve()
        }
      })
    },
  })

  // Add email to previousManager
  const addEmailToPreviousManager = useMutation({
    mutationFn: (email: EmailAsAttachmentType) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(previousManager)
        const isExist = temp.emails.find((e) => e.id === email.id)
        if (isExist) {
          resolve()
        } else {
          temp.emails.push({
            id: email.id,
            emailAccountId: email.emailAccountId,
            subject: email.subject,
          })
          queryClient.setQueryData(['previousManager'], temp)
          resolve()
        }
      })
    },
  })

  // Add calendar event to previousManager
  const addEventToPreviousManager = useMutation({
    mutationFn: (event: EventAsAttachmentType) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(previousManager)
        const isExist = temp.events.find((e) => e.id === event.id)
        if (isExist) {
          resolve()
        } else {
          temp.events.push({
            id: event.id,
            title: event.title,
            calendarId: event.calendarId,
          })
          queryClient.setQueryData(['previousManager'], temp)
          resolve()
        }
      })
    },
  })

  // Add task to previousManager
  const addTaskToPreviousManager = useMutation({
    mutationFn: (task: CommonItemAttachmentType) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(previousManager)
        const isExist = temp.tasks.find((e) => e.id === task.id)
        if (isExist) {
          resolve()
        } else {
          temp.tasks.push({ id: task.id, title: task.title })
          queryClient.setQueryData(['previousManager'], temp)
          resolve()
        }
      })
    },
  })

  // Add note to previousManager
  const addNoteToPreviousManager = useMutation({
    mutationFn: (note: CommonItemAttachmentType) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(previousManager)
        const isExist = temp.notes.find((e) => e.id === note.id)
        if (isExist) {
          resolve()
        } else {
          temp.notes.push({ id: note.id, title: note.title })
          queryClient.setQueryData(['previousManager'], temp)
          resolve()
        }
      })
    },
  })

  const removeAttachment = useMutation({
    mutationFn: ({
      id,
      moduleName,
    }: {
      id: string
      moduleName: ModulesType
    }) => {
      return new Promise<void>((resolve) => {
        let temp = getAttachmentManagerState(attachedItems)
        switch (moduleName) {
          case 'notes':
            temp = { ...temp, notes: temp.notes.filter((e) => e.id !== id) }
            break
          case 'tasks':
            temp = { ...temp, tasks: temp.tasks.filter((e) => e.id !== id) }
            break
          case 'calendarEvent':
            temp = { ...temp, events: temp.events.filter((e) => e.id !== id) }
            break
          case 'emails':
            temp = { ...temp, emails: temp.emails.filter((e) => e.id !== id) }
            break
          default:
            break
        }

        queryClient.setQueryData(['attachmentManager'], temp)

        const hasAttachment =
          temp.emails.length > 0 ||
          temp.notes.length > 0 ||
          temp.events.length > 0 ||
          temp.tasks.length > 0
        queryClient.setQueryData(['hasItemAttachments'], hasAttachment)
        resolve()
      })
    },
  })

  // Move current attachments to previousManager when leaving screen
  const saveToPreviousManager = useMutation({
    mutationFn: () => {
      return new Promise<void>((resolve) => {
        queryClient.setQueryData(['previousManager'], attachedItems)
        queryClient.setQueryData(['attachmentManager'], defaultValues)
        queryClient.setQueryData(['hasItemAttachments'], false)
        resolve()
      })
    },
  })

  // Restore attachments from previousManager when coming back
  const restoreFromPreviousManager = useMutation({
    mutationFn: () => {
      return new Promise<void>((resolve) => {
        queryClient.setQueryData(['attachmentManager'], previousManager)

        const hasAttachment =
          previousManager &&
          ((previousManager.emails?.length ?? 0) > 0 ||
            (previousManager.notes?.length ?? 0) > 0 ||
            (previousManager.events?.length ?? 0) > 0 ||
            (previousManager.tasks?.length ?? 0) > 0)
        queryClient.setQueryData(['hasItemAttachments'], hasAttachment)

        queryClient.setQueryData(['previousManager'], defaultValues)
        resolve()
      })
    },
  })

  const setHasPreviousManagerApplied = (value: boolean) => {
    queryClient.setQueryData(['hasPreviousManagerApplied'], value)
  }

  const redirectToDetailsPage = async (
    moduleType: ModulesType,
    data:
      | CommonItemAttachmentType
      | EmailAsAttachmentType
      | EventAsAttachmentType,
    isEditable?: boolean,
    editId?: string
  ) => {
    const params = {
      viewAsAttachment: 'yes',
      ...rest,
      backUrl: pathName,
    }

    if (!isEditable && 'id' in params) {
      delete params.id
    }

    if (isEditable && editId) {
      // Save the attachment as pre-attached item
      await saveAsPreAttached.mutateAsync(editId)
    }

    switch (moduleType) {
      case 'calendarEvent':
        if ('calendarId' in data) {
          router.push({
            pathname:
              `calendar/${data.calendarId}/${data.id}` as RelativePathString,
            params: params,
          })
        }
        return
      case 'emails':
        if ('emailAccountId' in data) {
          router.push({
            pathname:
              `emails/${data.emailAccountId}/${data.id}` as RelativePathString,
            params: params,
          })
        }
        return
      case 'notes':
        router.push({
          pathname: `notes/${data.id}` as RelativePathString,
          params: params,
        })

        return
      case 'tasks':
        router.push({
          pathname: `tasks/${data.id}` as RelativePathString,
          params: params,
        })
        return
    }
  }

  return {
    attachedItems,
    preAttachedItems,
    previousManager,
    hasItemAttachments: hasItemAttachments,
    hasPreviousManagerApplied: hasPreviousManagerApplied,
    resetAttachedItems: resetAttachedItems.mutateAsync,
    attachItems: attachItems.mutateAsync,
    removeAttachment: removeAttachment.mutateAsync,
    saveAsPreAttached: saveAsPreAttached.mutateAsync,
    restorePreAttachedItems: restorePreAttachedItems.mutateAsync,
    saveToPreviousManager: saveToPreviousManager.mutateAsync,
    restoreFromPreviousManager: restoreFromPreviousManager.mutateAsync,
    addEmailToPreviousManager: addEmailToPreviousManager.mutateAsync,
    addEventToPreviousManager: addEventToPreviousManager.mutateAsync,
    addTaskToPreviousManager: addTaskToPreviousManager.mutateAsync,
    addNoteToPreviousManager: addNoteToPreviousManager.mutateAsync,
    addEmailAsAttachment: addEmailAsAttachment.mutateAsync,
    addEventAsAttachment: addEventAsAttachment.mutateAsync,
    addTaskAsAttachment: addTaskAsAttachment.mutateAsync,
    addNoteAsAttachment: addNoteAsAttachment.mutateAsync,
    setHasPreviousManagerApplied: setHasPreviousManagerApplied,
    redirectToDetailsPage,
  }
}

export default useModuleItemsAsAttachments

function getAttachmentManagerState(
  previousManager?: ModuleItemsAsAttachmentType
) {
  return {
    ...(previousManager || defaultValues),
    emails: [...(previousManager?.emails || defaultValues.emails)],
    events: [...(previousManager?.events || defaultValues.events)],
    tasks: [...(previousManager?.tasks || defaultValues.tasks)],
    notes: [...(previousManager?.notes || defaultValues.notes)],
  }
}
