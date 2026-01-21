import React from 'react'
import { Button } from './button'

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
  retryText?: string
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again',
}: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="mb-4">
        <svg
          className="h-12 w-12 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-text mb-2">{title}</h2>
      <p className="text-text-secondary mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          {retryText}
        </Button>
      )}
    </div>
  )
}
