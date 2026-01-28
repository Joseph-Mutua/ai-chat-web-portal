'use client'

import { cn } from '@/lib/utils/cn'

interface FormDividerProps {
  text?: string
  className?: string
}

export function FormDivider({ text = 'Or', className }: FormDividerProps) {
  return (
    <div className={cn('relative py-4', className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-background-light text-text-placeholder">{text}</span>
      </div>
    </div>
  )
}
