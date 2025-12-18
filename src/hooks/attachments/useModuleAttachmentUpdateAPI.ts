import { EmailType, ModulesType, NoteType } from '@/types'
import { TaskType } from '@/types/task'

import { getNoteById, useUpdateNoteMutation } from '../api'

type emails = {
  emails: {
    emails: EmailType[]
  }
}

type tasks = {
  tasks: {
    tasks: TaskType[]
  }
}

type events = {
  events: {
    events: { id: string }[]
  }
}

type note = {
  note: {
    note: NoteType[]
  }
}
type Prettify<T> = {
  [K in keyof T]: T[K] extends Array<infer U> ? Array<Prettify<U>> : T[K]
}
type ExtendedNoteType = Prettify<NoteType & emails & tasks & events>

type ExistingIds = {
  attachmentIds: string[]
  emailMessageIds: string[]
  taskIds: string[]
  eventIds: string[]
  noteIds: string[]
}

const useModuleAttachmentUpdateAPI = () => {
  const { mutateAsync: updateNote, isPending: isUpdateNotePending } =
    useUpdateNoteMutation()

  const getModulesParams = (
    moduleName: ModulesType,
    itemId: string,
    ExistingIds: ExistingIds
  ) => {
    switch (moduleName) {
      case 'notes':
        return {
          ...ExistingIds,
          noteIds: [...ExistingIds.noteIds, itemId],
        }
      case 'tasks':
        return {
          ...ExistingIds,
          taskIds: [...ExistingIds.taskIds, itemId],
        }
      case 'calendarEvent':
        return {
          ...ExistingIds,
          eventIds: [...ExistingIds.eventIds, itemId],
        }
      case 'emails':
        return {
          ...ExistingIds,
          emailMessageIds: [...ExistingIds.emailMessageIds, itemId],
        }
      default:
        return undefined
    }
  }

  const updateNoteAttachment = async (
    noteId: string,
    moduleName: ModulesType,
    itemId: string
  ): Promise<NoteType | undefined> => {
    const note = await getNoteById(noteId)
    if (!note) {
      return
    }
    const _notes: ExtendedNoteType = note.note

    const attachmentIds =
      _notes.attachments?.map((attachment) => attachment.id) ?? []
    const emailMessageIds =
      _notes.emails?.emails?.map((emailMessage) => emailMessage.id) ?? []
    const taskIds = _notes.tasks?.tasks?.map((task) => task.id) ?? []
    const eventIds = _notes.events?.events?.map((event) => event.id) ?? []
    const params: ExistingIds | undefined = getModulesParams(
      moduleName,
      itemId,
      {
        attachmentIds: attachmentIds,
        taskIds: taskIds.map((task) => task.toString()),
        eventIds: eventIds,
        emailMessageIds: emailMessageIds.map((emailMessage) =>
          emailMessage.toString()
        ),
        noteIds: [],
      }
    )
    if (!params) {
      return
    }

    if ('noteIds' in params && params.noteIds !== undefined) {
      delete (params as Partial<typeof params>).noteIds
    }

    const response = await updateNote({
      noteId: noteId,
      //   @ts-expect-error: The parameters object may include extra fields depending on the module type. This is intentional
      parameters: {
        ...params,
      },
    })

    return response
  }

  return {
    isUpdateNotePending,
    updateNoteAttachment,
  }
}

export default useModuleAttachmentUpdateAPI
