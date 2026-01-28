'use client'

import { cn } from '@/lib/utils/cn'

interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null

  return (
    <div 
      className={cn('text-sm text-red-500 bg-red-50 p-3 rounded-xl', className)}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
