'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useSession } from '@/hooks/use-session'
import { LogoutModal } from './logout-modal'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
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

  if (!isOpen) return null

  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || 'User'
  const email = user?.email || 'user@example.com'

  return (
    <>

      <div 
        className="fixed inset-0 z-40"
        onClick={(e) => {
          // Don't close if logout modal is open
          if (!isLogoutModalOpen) {
            onClose()
          }
        }}
        style={{ pointerEvents: isLogoutModalOpen ? 'none' : 'auto' }}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed top-16 right-6 z-50 w-80 bg-background-light rounded-2xl shadow-lg border border-border overflow-hidden"
      >
        {/* Profile Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-4">
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
              {/* Edit Icon Overlay */}
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary border border-white rounded-full flex items-center justify-center hover:bg-secondary-hover transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            </div>

            {/* Name and Email */}
            <div className="flex-1 min-w-0">
              <h3 className="text-black font-medium text-lg leading-[18px] tracking-normal text-left truncate">
                {fullName}
              </h3>
              <p className="text-grey text-sm truncate mt-0.5">
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {/* Subscription */}
          <div className="w-full flex items-center justify-between px-5 py-3 hover:bg-background transition-colors">
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
            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-background transition-colors"
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
            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-background transition-colors"
            onClick={() => {}}
          >
            <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <span className="text-black text-base font-normal leading-[14px] tracking-normal">Edit Profile</span>
          </button>

          {/* Delete Account */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-background transition-colors"
            onClick={() => {}}
          >
            <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            <span className="text-black text-base font-normal leading-[14px] tracking-normal">Delete Account</span>
          </button>

          {/* Log Out */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-background transition-colors"
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

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={() => {
            logout()
          }}
        />
      )}
    </>
  )
}
