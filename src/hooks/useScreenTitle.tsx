import { capitalize } from 'lodash'

import { useEffect, useLayoutEffect, useRef } from 'react'

import { usePathname, useRouter } from 'expo-router'

const getRootPath = (path: string) => {
  const _title = path.split('/')[1]

  if (_title === 'emails') {
    return 'Email'
  }

  if (_title === 'chats') {
    return 'Messenger'
  }

  if (_title === 'ai-assistant') {
    return 'AI Chat'
  }

  if (_title === 'chat-ai') {
    return 'AI Chat'
  }

  if (_title === 'user-centre') {
    return 'User Centre'
  }

  return capitalize(_title)
}

export const useGetScreenTitle = () => {
  const pathname = usePathname()
  const previousPathnameRef = useRef<string | null>(null)

  // When the pathname changes, store the previous pathname
  useEffect(() => {
    if (pathname !== '/filter' && pathname !== '/tags') {
      previousPathnameRef.current = pathname
    }
  }, [pathname])

  if (pathname === '/filter' || pathname === '/tags') {
    return getRootPath(previousPathnameRef.current ?? '')
  }

  return getRootPath(pathname) || null
}

export const useSetHeaderTitle = (title?: string | null) => {
  const route = useRouter()

  useLayoutEffect(() => {
    route.setParams({
      title: title ? capitalize(title) : 'warpSpeed',
    })
  }, [route, title])
}
