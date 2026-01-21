'use client'

import { useEffect } from 'react'
import { ErrorDisplay } from '@/components/ui/error'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ErrorDisplay
        title="Something went wrong!"
        message={error.message || 'An unexpected error occurred'}
        onRetry={reset}
      />
    </div>
  )
}
