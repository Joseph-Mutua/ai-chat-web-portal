import { AttachmentOptionType } from '@/types'

export const attachmentOptions: AttachmentOptionType[] = [
  {
    id: 'email',
    title: 'Attach to new email',
    icon: 'mail-outline',
  },
  {
    id: 'note',
    title: 'Attach to new note',
    icon: 'pencil-outline',
  },
  {
    id: 'task',
    title: 'Attach to new task',
    icon: 'checkmark-outline',
  },
  {
    id: 'calendar',
    title: 'Attach to new calendar event',
    icon: 'calendar-outline',
  },
  {
    id: 'download',
    title: 'Download',
    icon: 'download-outline',
  },
]
