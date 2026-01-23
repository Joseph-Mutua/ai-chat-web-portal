'use client'

import { LoginFormNew } from '@/components/auth/login-form-new'
import { LoginPreviewPanel } from '@/components/auth/login-preview-panel'
import { useSession } from '@/hooks/use-session'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingContainer } from '@/components/ui/loading'
import Image from 'next/image'
import logoImage from '@/assets/images/logo.png'

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white lg:relative lg:overflow-hidden">
      {/* Mobile/Tablet Header - shows below lg (1024px) */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            src={logoImage}
            alt="warpSpeed"
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
          />
          <span className="text-[#1E1E1E] font-semibold text-base">warpSpeed</span>
        </div>
        <button className="p-2 text-[#1E1E1E]">
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

      {/* Desktop Layout - Only shows at lg (1024px) and above */}
      <div className="hidden lg:block lg:relative lg:w-full lg:min-h-screen lg:bg-white">
        {/* Left Panel - AI Chat Preview */}
        <LoginPreviewPanel />

        {/* Right Panel - Login Form */}
        <div className="absolute top-0 left-[50%] right-0 h-full bg-white flex items-center justify-center">
          <LoginFormNew />
        </div>
      </div>

      {/* Mobile/Tablet Layout - shows below lg (1024px) */}
      <div className="lg:hidden flex-1 w-full bg-white">
        <LoginFormNew />
      </div>
    </div>
  )
}
