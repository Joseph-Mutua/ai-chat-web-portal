'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSession } from '@/hooks/use-session'
import { LogoutModal } from './logout-modal'
import { cn } from '@/lib/utils/cn'

interface AccountDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AccountDetailsModal({ isOpen, onClose }: AccountDetailsModalProps) {
  const router = useRouter()
  const { user, logout } = useSession()
  const modalRef = useRef<HTMLDivElement>(null)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  useEffect(() => {
    setIsLogoutModalOpen(false)
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLogoutModalOpen) {
        return
      }
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen && !isLogoutModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, isLogoutModalOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || 'User'
  const email = user?.email || 'user@example.com'

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={(e) => {
          if (!isLogoutModalOpen) {
            onClose()
          }
        }}
        style={{ pointerEvents: isLogoutModalOpen ? 'none' : 'auto' }}
      />
      
      {/* Modal - Bottom Sheet Style for Mobile */}
      <div
        ref={modalRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-white',
          'lg:hidden', 
          'rounded-t-[24px]', 
          'max-h-[70vh]', 
          'flex flex-col',
          'shadow-lg',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
      
        <div className="flex justify-end pt-4 pr-4 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-text hover:bg-background rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

     
        <div className="flex-1 overflow-y-auto px-4 pb-6">
  
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-shrink-0">
              {user?.profileImage?.url || user?.profileImageUrl ? (
                <Image
                  src={user.profileImage?.url || user.profileImageUrl || ''}
                  alt={fullName}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-avatar-bg flex items-center justify-center">
                  <span className="text-primary-dark font-semibold text-xl">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* Name and Email */}
            <div className="flex-1 min-w-0">
              <h3 className="text-text font-semibold text-lg">
                {fullName}
              </h3>
              <p className="text-grey text-sm mt-0.5">
                {email}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-0">
            {/* Subscription */}
            <div className="w-full flex items-center justify-between px-2 py-3 hover:bg-background rounded-lg transition-colors">
              <button
                type="button"
                className="flex items-center gap-3 flex-1 text-left"
                onClick={() => {}}
              >
                <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <span className="text-black text-base font-normal leading-[14px] tracking-normal">Subscription</span>
              </button>
              <button
                type="button"
                className="w-18 h-8 bg-secondary-light text-text text-xs font-medium rounded-2xl hover:bg-secondary-light-hover transition-colors flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                Launch
              </button>
            </div>

            {/* Change Password */}
            <button
              type="button"
              className="w-full flex items-center gap-3 px-2 py-3 hover:bg-background rounded-lg transition-colors"
              onClick={() => {/* TODO: Handle change password */}}
            >
              <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="text-black text-base font-normal leading-[14px] tracking-normal">Change Password</span>
            </button>

            {/* Edit Profile */}
            <button
              type="button"
              className="w-full flex items-center gap-3 px-2 py-3 hover:bg-background rounded-lg transition-colors"
              onClick={() => {
                onClose()
                router.push('/profile/edit')
              }}
            >
              <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <span className="text-black text-base font-normal leading-[14px] tracking-normal">Edit Profile</span>
            </button>

            {/* Log Out */}
            <button
              type="button"
              className="w-full flex items-center gap-3 px-2 py-3 hover:bg-background rounded-lg transition-colors"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsLogoutModalOpen(true)
              }}
            >
              <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="text-black text-base font-normal leading-[14px] tracking-normal">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={() => {
            logout()
            onClose()
          }}
        />
      )}
    </>
  )
}
