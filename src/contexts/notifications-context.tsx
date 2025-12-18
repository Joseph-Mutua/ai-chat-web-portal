import { createContext } from 'react'

import { NotificationsContextType } from '@/types/notifications'

export const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  pushNotification: () => {},
  removeNotification: () => {},
  clearAll: () => {},
})
