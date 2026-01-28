'use client'

import { useEffect } from 'react'

interface SessionTimeoutModalProps {
  isOpen: boolean
  timeRemaining: number
  onStayLoggedIn: () => void
  onLogout: () => void
}

export function SessionTimeoutModal({
  isOpen,
  timeRemaining,
  onStayLoggedIn,
  onLogout,
}: SessionTimeoutModalProps) {
  // Prevent scrolling when modal is open
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

  // Format time remaining
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const formattedTime = minutes > 0 
    ? `${minutes}:${seconds.toString().padStart(2, '0')}` 
    : `${seconds}s`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onStayLoggedIn}
      />
      
      {/* Modal */}
      <div className="relative bg-background-light rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-yellow-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-text-dark text-lg font-semibold text-center mb-2">
          Session Timeout Warning
        </h2>

        {/* Message */}
        <p className="text-grey text-sm text-center mb-2">
          Your session is about to expire due to inactivity.
        </p>

        {/* Countdown */}
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-primary-dark">
            {formattedTime}
          </span>
          <p className="text-grey text-xs mt-1">
            until automatic logout
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
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
        </div>
      </div>
    </div>
  )
}
