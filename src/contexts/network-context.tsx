import { createContext } from 'react'

import { NetworkContextType } from '@/types/emails'

export const NetworkContext = createContext<NetworkContextType>({
  isConnected: false,
  netInfo: null,
  lastConnectedAt: null,
  lastDisconnectedAt: null,
})
