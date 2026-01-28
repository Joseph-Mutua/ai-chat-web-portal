'use client'

import { useState, useId } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLogin } from '@/hooks/api/use-auth'
import { useApiError } from '@/hooks/use-api-error'
import { PasswordInput, SocialLoginButtons, FormError, FormDivider } from '@/components/ui/form'
import logoImage from '@/assets/images/logo.png'

interface LoginFormProps {
  isMobile?: boolean
}

export function LoginForm({ isMobile = false }: LoginFormProps) {
  const login = useLogin()
  const { error, setError, clearErrors } = useApiError()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const emailInputId = useId()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      await login.mutateAsync({ email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    }
  }

  const isLoading = login.isPending

  return (
    <div className="w-full flex items-center justify-center px-6 py-8 lg:p-12 bg-background-light min-h-[calc(100vh-56px)] lg:min-h-screen">
      <div className="w-full max-w-sm space-y-5">
        <div className="flex justify-center mb-4">
          <Image src={logoImage} alt="warpSpeed Logo" width={56} height={56} className="w-14 h-14 object-contain" priority />
        </div>

        <div className="text-center mb-6">
          <h1 className="lg:hidden text-2xl font-normal text-text">Sign in to access your AI partner</h1>
          <h1 className="hidden lg:block text-2xl font-bold text-text mb-2">Let&apos;s get you started</h1>
          <p className="hidden lg:block text-sm text-grey">
            Sign up to experience AI that actually understands<br />your workflow
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor={emailInputId} className="block text-sm font-medium text-text">Email</label>
            <input
              id={emailInputId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email ID"
              autoComplete="email"
              disabled={isLoading}
              aria-describedby={error ? 'login-error' : undefined}
              className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-text placeholder:text-text-placeholder text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" disabled={isLoading} />

          <FormError message={error} />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-primary-dark hover:bg-primary-darker text-white text-base font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <FormDivider />
        <SocialLoginButtons disabled={isLoading} />

        <p className="hidden lg:block text-xs text-center text-grey mt-6">
          We respect your privacy. You can unlink your account anytime.
        </p>

        <p className="lg:hidden text-sm text-center text-grey mt-6">
          Don&apos;t have an account?{' '}
          <Link href="#" className="text-primary-dark hover:underline font-medium">Download our app</Link>
          <br />
          <span className="text-xs">to create an account and join the productivity revolution.</span>
        </p>
        
        <p className="hidden lg:block text-sm text-center text-grey mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-secondary underline font-medium">Find out more</Link>
        </p>
      </div>
    </div>
  )
}
