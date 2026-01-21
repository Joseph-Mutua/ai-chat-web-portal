'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRequestResetPassword } from '@/hooks/api/use-auth'
import { getErrorMessage } from '@/lib/utils/errors'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const requestReset = useRequestResetPassword()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email) {
      setError('Please enter your email address')
      return
    }

    try {
      await requestReset.mutateAsync(email)
      setSuccess(true)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Reset Password</h1>
          <p className="text-text-secondary">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-primary-light border border-primary rounded-lg p-6 text-center">
            <p className="text-text mb-4">
              If an account exists with that email, we&apos;ve sent you a password reset link.
            </p>
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />

            {error && (
              <div className="text-sm text-error bg-error/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={requestReset.isPending}
            >
              Send Reset Link
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-primary hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
