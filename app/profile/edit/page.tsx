'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSession } from '@/hooks/use-session'
import { LoadingContainer } from '@/components/ui/loading'
import { ConversationSidebar } from '@/components/chat/conversation-sidebar'
import logoImage from '@/assets/images/logo.png'
import { cn } from '@/lib/utils/cn'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isLoading: sessionLoading, isAuthenticated } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birthday, setBirthday] = useState('')

  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [sessionLoading, isAuthenticated, router])

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setEmail(user.email || '')
      setPhoneNumber(user.phoneNumber || '')
      // Format birthday if available
      if (user.dateOfBirth) {
        const date = new Date(user.dateOfBirth)
        const day = date.getDate()
        const month = date.toLocaleDateString('en-US', { month: 'long' })
        const year = date.getFullYear()
        setBirthday(`${day} ${month} ${year}`)
      }
    }
  }, [user])

  const handleBack = () => {
    router.back()
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save profile:', { firstName, lastName, email, phoneNumber, birthday })
  }

  if (sessionLoading) {
    return <LoadingContainer />
  }

  if (!isAuthenticated) {
    return null
  }

  const profileImageUrl = user?.profileImage?.url || user?.profileImageUrl

  return (
    <div className="min-h-screen bg-white lg:hidden">
      {/* Sidebar */}
      <ConversationSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={logoImage}
            alt="warpSpeed"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
          <span className="text-text font-semibold text-base">warpSpeed</span>
        </div>
        <button
          className="p-2 text-text"
          onClick={() => setIsSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="px-4 pb-8">
        {/* Profile Picture Section */}
        <div className="flex justify-center mt-6 mb-8">
          <div className="relative">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={user?.firstName || 'User'}
                width={120}
                height={120}
                className="w-30 h-30 rounded-full object-cover"
              />
            ) : (
              <div className="w-30 h-30 rounded-full bg-avatar-bg flex items-center justify-center">
                <span className="text-primary-dark font-semibold text-4xl">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            {/* Camera Icon Button - Bottom Right Overlay */}
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-hover transition-colors"
              onClick={() => {/* TODO: Handle photo upload */}}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0l1.5-1.5m-1.5 1.5l-1.5 1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 max-w-md mx-auto">
          {/* First Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <label className="text-sm text-grey font-medium">First Name</label>
            </div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-background rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-0"
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <label className="text-sm text-grey font-medium">Last Name</label>
            </div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-background rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-0"
              placeholder="Last Name"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <label className="text-sm text-grey font-medium">Email Address</label>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-background rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-0"
              placeholder="Email Address"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <label className="text-sm text-grey font-medium">Phone Number</label>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-background rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-0"
              placeholder="Phone Number"
            />
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <label className="text-sm text-grey font-medium">Birthday</label>
            </div>
            <input
              type="text"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full px-4 py-3 bg-background rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-0"
              placeholder="Birthday"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
