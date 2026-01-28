'use client'

import { ReactNode } from 'react'
import { useModal } from '@/hooks/use-modal'
import { cn } from '@/lib/utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  showCloseButton?: boolean
  className?: string
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full',
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = false,
  className,
  closeOnBackdrop = true,
  closeOnEscape = true,
  maxWidth = 'md',
}: ModalProps) {
  const { modalRef, handleBackdropClick } = useModal({
    isOpen,
    onClose,
    closeOnClickOutside: closeOnBackdrop,
    closeOnEscape,
  })

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className={cn(
          'relative bg-background-light rounded-2xl shadow-xl w-full mx-4 p-6',
          'animate-in fade-in zoom-in duration-200',
          maxWidthClasses[maxWidth],
          className
        )}
        tabIndex={-1}
      >
        {title && <h2 id="modal-title" className="sr-only">{title}</h2>}

        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-grey hover:text-text transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-6', className)}>{children}</div>
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex gap-3', className)}>{children}</div>
}
