'use client'

import { LoginFormNew } from '@/components/auth/login-form-new'
import { LoginPreviewPanel } from '@/components/auth/login-preview-panel'
import { useSession } from '@/hooks/use-session'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingContainer } from '@/components/ui/loading'

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/chat')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <LoadingContainer />
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col xl:flex-row bg-[#1E1E1E] xl:bg-white xl:relative xl:overflow-hidden">
      {/* Mobile/Tablet Header - shows below xl (1280px) */}
      <div className="xl:hidden bg-[#1E1E1E] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#006C67] via-[#531CB3] to-[#2F2F4B] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">ws</span>
          </div>
          <span className="text-white font-semibold">warpSpeed</span>
        </div>
        <button className="p-2 text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Layout - Only shows at xl (1280px) and above */}
      <div className="hidden xl:block xl:relative xl:w-full xl:min-h-screen xl:bg-white">
        {/* Left Panel - AI Chat Preview */}
        <LoginPreviewPanel />

        {/* Right Panel - Login Form */}
        <div className="absolute top-0 left-[50%] right-0 h-full bg-white flex items-center justify-center">
          <LoginFormNew />
        </div>
      </div>

      {/* Mobile/Tablet Layout - shows below xl (1280px) */}
      <div className="xl:hidden w-full bg-white">
        <LoginFormNew />
      </div>
    </div>
  )
}
