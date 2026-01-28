'use client'

import { useEffect, useRef } from 'react'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])


  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div
          ref={modalRef}
          className="w-full max-w-md bg-background-light rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {/* Close button */}
          <div className="flex justify-end p-4 pb-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-grey hover:text-text transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 pt-2 text-center">
            {/* Logout Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 bg-error-red rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-text-dark text-base font-normal leading-6 tracking-normal text-center mb-2">
              Are you sure you want to Log Out?
            </h2>

            {/* Subtitle */}
            <p className="text-text-dark text-base font-normal leading-6 tracking-normal text-center mb-8">
              You'll need to log in again to access your account.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onClose()
                }}
                className="flex-1 py-3 px-6 border border-border text-text font-medium rounded-full hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onConfirm()
                }}
                className="flex-1 py-3 px-6 bg-error-red text-white font-medium rounded-full hover:bg-error-red-hover transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
