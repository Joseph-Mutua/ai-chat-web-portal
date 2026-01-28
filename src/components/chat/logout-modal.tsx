'use client'

import { memo, useCallback } from 'react'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const LogoutIcon = memo(function LogoutIcon() {
  return (
    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  )
})

export const LogoutModal = memo(function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const handleCancel = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }, [onClose])

  const handleConfirm = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onConfirm()
  }, [onConfirm])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Logout Confirmation" showCloseButton className="p-0 overflow-hidden">
      <div className="px-8 pb-8 pt-12 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-error-red rounded-xl flex items-center justify-center" aria-hidden="true">
            <LogoutIcon />
          </div>
        </div>

        <ModalBody className="mb-8">
          <h2 className="text-text-dark text-base font-normal leading-6 tracking-normal text-center mb-2">
            Are you sure you want to Log Out?
          </h2>
          <p className="text-text-dark text-base font-normal leading-6 tracking-normal text-center">
            You&apos;ll need to log in again to access your account.
          </p>
        </ModalBody>

        <ModalFooter className="gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3 px-6 border border-border text-text font-medium rounded-full hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-6 bg-error-red text-white font-medium rounded-full hover:bg-error-red-hover transition-colors"
          >
            Log Out
          </button>
        </ModalFooter>
      </div>
    </Modal>
  )
})
