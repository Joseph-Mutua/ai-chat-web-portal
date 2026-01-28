'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useRegister, useLogin } from '@/hooks/api/use-auth'
import { getErrorMessage } from '@/lib/utils/errors'
import logoImage from '@/assets/images/logo.png'

interface RegisterFormProps {
  isMobile?: boolean
}

interface FieldErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

interface PasswordRequirement {
  label: string
  validator: (password: string) => boolean
}

// Password requirements configuration
const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: 'At least 12 characters', validator: (p) => p.length >= 12 },
  { label: 'One uppercase letter', validator: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', validator: (p) => /[a-z]/.test(p) },
  { label: 'One number', validator: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$%^&*)', validator: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Name validation - letters, spaces, hyphens, apostrophes only
const NAME_REGEX = /^[a-zA-Z\s\-']+$/

export function RegisterForm({ isMobile = false }: RegisterFormProps) {
  const router = useRouter()
  const register = useRegister()
  const login = useLogin()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [generalError, setGeneralError] = useState('')
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Check password requirements
  const passwordChecks = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.validator(password),
    }))
  }, [password])

  const isPasswordValid = useMemo(() => {
    return passwordChecks.every((check) => check.met)
  }, [passwordChecks])

  // Validate individual fields
  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case 'firstName':
        if (!value.trim()) return 'First name is required'
        if (value.trim().length < 2) return 'First name must be at least 2 characters'
        if (value.trim().length > 50) return 'First name must be less than 50 characters'
        if (!NAME_REGEX.test(value)) return 'First name can only contain letters'
        return undefined

      case 'lastName':
        if (!value.trim()) return 'Last name is required'
        if (value.trim().length < 2) return 'Last name must be at least 2 characters'
        if (value.trim().length > 50) return 'Last name must be less than 50 characters'
        if (!NAME_REGEX.test(value)) return 'Last name can only contain letters'
        return undefined

      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address'
        return undefined

      case 'password':
        if (!value) return 'Password is required'
        if (!PASSWORD_REQUIREMENTS.every((req) => req.validator(value))) {
          return 'Password does not meet all requirements'
        }
        return undefined

      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== password) return 'Passwords do not match'
        return undefined

      default:
        return undefined
    }
  }, [password])

  // Handle field blur
  const handleBlur = useCallback((field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, value)
    setFieldErrors((prev) => ({ ...prev, [field]: error }))
  }, [validateField])

  // Handle field change with real-time validation for already touched fields
  const handleFieldChange = useCallback((
    field: string,
    value: string,
    setter: (value: string) => void
  ) => {
    setter(value)
    if (touched[field]) {
      const error = validateField(field, value)
      setFieldErrors((prev) => ({ ...prev, [field]: error }))
    }
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('')
    }
  }, [touched, validateField, generalError])

  // Validate all fields
  const validateAllFields = useCallback((): boolean => {
    const errors: FieldErrors = {
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    }

    setFieldErrors(errors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    return !Object.values(errors).some((error) => error !== undefined)
  }, [firstName, lastName, email, password, confirmPassword, validateField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    // Validate all fields
    if (!validateAllFields()) {
      return
    }

    try {
      const result = await register.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      })
      
      // If registration returns a token, the hook handles login automatically
      // If no token is returned, manually login with the same credentials
      if (!result?.token) {
        await login.mutateAsync({
          email: email.trim().toLowerCase(),
          password,
        })
      }
      // If both succeed, redirect is handled by the hooks
    } catch (err: unknown) {
      // Try to parse API error response with field-specific errors
      const apiError = err as { response?: { data?: { errors?: Array<{ field: string; message: string }> } } }
      const errors = apiError?.response?.data?.errors
      
      if (errors && Array.isArray(errors)) {
        // Handle field-specific errors from API
        const newFieldErrors: FieldErrors = {}
        errors.forEach((error) => {
          if (error.field === 'firstName') {
            newFieldErrors.firstName = error.message
          } else if (error.field === 'lastName') {
            newFieldErrors.lastName = error.message
          } else if (error.field === 'email') {
            newFieldErrors.email = error.message
          } else if (error.field === 'password') {
            newFieldErrors.password = error.message
          } else if (error.field === 'confirmPassword') {
            newFieldErrors.confirmPassword = error.message
          }
        })
        
        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors((prev) => ({ ...prev, ...newFieldErrors }))
          // Mark fields with errors as touched
          setTouched((prev) => ({
            ...prev,
            ...Object.keys(newFieldErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
          }))
        } else {
          // If no recognized fields, show general error
          setGeneralError(errors.map((e) => e.message).join('. '))
        }
      } else {
        // Fallback to general error message parsing
        const errorMessage = getErrorMessage(err)
        const lowerError = errorMessage.toLowerCase()
        
        if (lowerError.includes('email') && lowerError.includes('exist')) {
          setFieldErrors((prev) => ({ ...prev, email: 'An account with this email already exists' }))
          setTouched((prev) => ({ ...prev, email: true }))
        } else if (lowerError.includes('email') && lowerError.includes('invalid')) {
          setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }))
          setTouched((prev) => ({ ...prev, email: true }))
        } else if (lowerError.includes('password')) {
          setFieldErrors((prev) => ({ ...prev, password: errorMessage }))
          setTouched((prev) => ({ ...prev, password: true }))
        } else {
          setGeneralError(errorMessage)
        }
      }
    }
  }

  // Check if form can be submitted
  const canSubmit = useMemo(() => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      password &&
      confirmPassword &&
      isPasswordValid &&
      password === confirmPassword &&
      !register.isPending &&
      !login.isPending
    )
  }, [firstName, lastName, email, password, confirmPassword, isPasswordValid, register.isPending, login.isPending])

  return (
    <div className="w-full flex items-center justify-center px-6 py-8 lg:p-12 bg-background-light min-h-[calc(100vh-56px)] lg:min-h-screen">
      <div className="w-full max-w-sm space-y-5">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src={logoImage}
            alt="warpSpeed Logo"
            width={56}
            height={56}
            className="w-14 h-14 object-contain"
            priority
          />
        </div>

        {/* Heading - Different for mobile vs desktop */}
        <div className="text-center mb-6">
          {/* Mobile heading */}
          <h1 className="lg:hidden text-2xl font-normal text-text">
            Create your account
          </h1>
          {/* Desktop heading */}
          <h1 className="hidden lg:block text-2xl font-bold text-text mb-2">
            Let&apos;s get you started
          </h1>
          <p className="hidden lg:block text-sm text-grey">
            Sign up to experience AI that actually understands
            <br />
            your workflow
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value, setFirstName)}
                onBlur={(e) => handleBlur('firstName', e.target.value)}
                placeholder="John"
                autoComplete="given-name"
                className={`w-full px-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-placeholder text-sm focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.firstName && touched.firstName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-border focus:ring-primary-dark focus:border-primary-dark'
                }`}
              />
              {fieldErrors.firstName && touched.firstName && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value, setLastName)}
                onBlur={(e) => handleBlur('lastName', e.target.value)}
                placeholder="Doe"
                autoComplete="family-name"
                className={`w-full px-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-placeholder text-sm focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.lastName && touched.lastName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-border focus:ring-primary-dark focus:border-primary-dark'
                }`}
              />
              {fieldErrors.lastName && touched.lastName && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              placeholder="Enter Email ID"
              autoComplete="email"
              className={`w-full px-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-placeholder text-sm focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.email && touched.email
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-border focus:ring-primary-dark focus:border-primary-dark'
              }`}
            />
            {fieldErrors.email && touched.email && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                placeholder="Enter Password"
                autoComplete="new-password"
                className={`w-full px-4 py-3.5 pr-12 bg-background border rounded-xl text-text placeholder:text-text-placeholder text-sm focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.password && touched.password
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-border focus:ring-primary-dark focus:border-primary-dark'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-placeholder hover:text-text transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.736m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Password Requirements */}
            <div className="mt-2 space-y-1">
              <p className="text-xs text-grey mb-1">Password must contain:</p>
              <div className="grid grid-cols-1 gap-0.5">
                {passwordChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    {check.met ? (
                      <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-grey flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      </svg>
                    )}
                    <span className={`text-xs ${check.met ? 'text-green-600' : 'text-grey'}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => handleFieldChange('confirmPassword', e.target.value, setConfirmPassword)}
                onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                placeholder="Re-enter Password"
                autoComplete="new-password"
                className={`w-full px-4 py-3.5 pr-12 bg-background border rounded-xl text-text placeholder:text-text-placeholder text-sm focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.confirmPassword && touched.confirmPassword
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-border focus:ring-primary-dark focus:border-primary-dark'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-placeholder hover:text-text transition-colors"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.736m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
            )}
            {/* Password match indicator */}
            {confirmPassword && !fieldErrors.confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Passwords match
              </p>
            )}
          </div>

          {/* General Error Message */}
          {generalError && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">
              {generalError}
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 mt-2 bg-primary-dark hover:bg-primary-darker text-white text-base font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {(register.isPending || login.isPending) ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background-light text-text-placeholder">Or</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => router.push('/auth/callback?provider=google')}
            className="w-full py-3.5 bg-background-light border border-border rounded-full text-text text-sm font-medium hover:bg-background transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue With Google
          </button>

          {/* Apple Button */}
          <button
            type="button"
            onClick={() => router.push('/auth/callback?provider=apple')}
            className="w-full py-3.5 bg-background-light border border-border rounded-full text-text text-sm font-medium hover:bg-background transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue With Apple
          </button>
        </div>

        {/* Desktop Privacy Text - only shows on desktop */}
        <p className="hidden lg:block text-xs text-center text-grey mt-6">
          We respect your privacy. You can unlink your account anytime.
        </p>

        {/* Footer Link - Different for mobile vs desktop */}
        {/* Mobile footer */}
        <p className="lg:hidden text-sm text-center text-grey mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-dark hover:underline font-medium">
            Sign in
          </Link>
        </p>
        
        {/* Desktop footer */}
        <p className="hidden lg:block text-sm text-center text-grey mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-secondary underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
