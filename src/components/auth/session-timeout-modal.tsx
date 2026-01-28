'use client'

import { memo, useMemo } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'

interface SessionTimeoutModalProps {
  isOpen: boolean
  timeRemaining: number
  onStayLoggedIn: () => void
  onLogout: () => void
}

const WarningIcon = memo(function WarningIcon() {
  return (
    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
})

function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return minutes > 0 ? `${minutes}:${secs.toString().padStart(2, '0')}` : `${secs}s`
}

export const SessionTimeoutModal = memo(function SessionTimeoutModal({
  isOpen,
  timeRemaining,
  onStayLoggedIn,
  onLogout,
}: SessionTimeoutModalProps) {
  const formattedTime = useMemo(() => formatTimeRemaining(timeRemaining), [timeRemaining])

  return (
    <Modal isOpen={isOpen} onClose={onStayLoggedIn} title="Session Timeout Warning" closeOnBackdrop closeOnEscape>
      <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center" aria-hidden="true">
        <WarningIcon />
      </div>

      <h2 className="text-text-dark text-lg font-semibold text-center mb-2">Session Timeout Warning</h2>

      <ModalBody className="mb-6 text-center">
        <p className="text-grey text-sm mb-2">Your session is about to expire due to inactivity.</p>
        <div className="text-center">
          <span className="text-3xl font-bold text-primary-dark" role="timer" aria-live="polite" aria-atomic="true">
            {formattedTime}
          </span>
          <p className="text-grey text-xs mt-1">until automatic logout</p>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onLogout}
          className="flex-1 py-3 border border-border text-text rounded-full font-medium hover:bg-background transition-colors"
        >
          Log Out Now
        </button>
        <button
          type="button"
          onClick={onStayLoggedIn}
          className="flex-1 py-3 bg-primary-dark text-white rounded-full font-medium hover:bg-primary-darker transition-colors"
        >
          Stay Logged In
        </button>
      </ModalFooter>
    </Modal>
  )
})
