'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/use-session'
import { verifyEmail, resendVerifyEmail } from '@/lib/api/auth'
import { getErrorMessage } from '@/lib/utils/errors'
import { LoadingContainer } from '@/components/ui/loading'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useSession()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id && !isVerifying && !success) {
      handleVerify(id)
    }
  }, [searchParams])

  useEffect(() => {
    if (user?.emailVerified) {
      router.push('/chat')
    }
  }, [user, router])

  const handleVerify = async (id: string) => {
    setIsVerifying(true)
    setError('')
    try {
      await verifyEmail(id)
      setSuccess(true)
      setTimeout(() => {
        router.push('/chat')
      }, 2000)
    } catch (err) {
      setError(getErrorMessage(err))
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError('')
    try {
      await resendVerifyEmail(user?.email)
      setSuccess(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsResending(false)
    }
  }

  if (!user) {
    return <LoadingContainer />
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text mb-2">
              Email Verified!
            </h1>
            <p className="text-text-secondary">
              Your email has been verified. Redirecting to chat...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text mb-2">
            Verify Your Email
          </h1>
          <p className="text-text-secondary">
            We&apos;ve sent a verification link to <strong>{user?.email}</strong>
          </p>
        </div>

        {error && (
          <div className="text-sm text-error bg-error/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-text-secondary text-center">
            Click the link in the email to verify your account. If you
            didn&apos;t receive the email, you can request a new one.
          </p>

          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full"
            isLoading={isResending}
          >
            Resend Verification Email
          </Button>

          <div className="text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-primary hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
