'use client'

import { ReactNode, useCallback } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'

interface ErrorBoundaryProviderProps {
  children: ReactNode
}

export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', error)
      console.error('Error Info:', errorInfo)
    }
  }, [])

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}
