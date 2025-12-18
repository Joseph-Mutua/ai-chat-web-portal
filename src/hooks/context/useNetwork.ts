import { useContext } from 'react'

import { NetworkContext } from '@/contexts/network-context'

export const useNetwork = () => {
  return useContext(NetworkContext)
}
