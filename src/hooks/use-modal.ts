'use client'

import { useEffect, useCallback, useRef } from 'react'

interface UseModalOptions {
  isOpen: boolean
  onClose: () => void
  closeOnEscape?: boolean
  closeOnClickOutside?: boolean
  preventScroll?: boolean
}

interface UseModalReturn {
  modalRef: React.RefObject<HTMLDivElement | null>
  handleBackdropClick: (e: React.MouseEvent) => void
}

export function useModal({
  isOpen,
  onClose,
  closeOnEscape = true,
  closeOnClickOutside = true,
  preventScroll = true,
}: UseModalOptions): UseModalReturn {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!preventScroll) return

    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen, preventScroll])

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEscape, onClose])

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement

      if (modalRef.current) {
        const focusable = modalRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable) {
          focusable.focus()
        } else {
          modalRef.current.focus()
        }
      }
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (!closeOnClickOutside) return
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [closeOnClickOutside, onClose]
  )

  return {
    modalRef,
    handleBackdropClick,
  }
}
