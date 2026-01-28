'use client'

import { useState, useCallback, useMemo, useId } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRegister, useLogin } from '@/hooks/api/use-auth'
import { useApiError } from '@/hooks/use-api-error'
import { validateName, validateEmail, validatePassword, isPasswordValid } from '@/lib/validation'
import { extractFieldErrors, extractErrorMessage } from '@/types'
import { PasswordInput, SocialLoginButtons, FormError, FormDivider, PasswordRequirements } from '@/components/ui/form'
import { cn } from '@/lib/utils/cn'
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

export function RegisterForm({ isMobile = false }: RegisterFormProps) {
  const register = useRegister()
  const login = useLogin()
  const { error: generalError, setError: setGeneralError, clearErrors } = useApiError()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  
  const firstNameId = useId()
  const lastNameId = useId()
  const emailId = useId()

  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case 'firstName': return validateName(value, 'First name')
      case 'lastName': return validateName(value, 'Last name')
      case 'email': return validateEmail(value)
      case 'password': return validatePassword(value)
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== password) return 'Passwords do not match'
        return undefined
      default: return undefined
    }
  }, [password])

  const handleBlur = useCallback((field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, value)
    setFieldErrors((prev) => ({ ...prev, [field]: error }))
  }, [validateField])

  const handleFieldChange = useCallback((field: string, value: string, setter: (value: string) => void) => {
    setter(value)
    if (touched[field]) {
      const error = validateField(field, value)
      setFieldErrors((prev) => ({ ...prev, [field]: error }))
    }
    if (generalError) clearErrors()
  }, [touched, validateField, generalError, clearErrors])

  const validateAllFields = useCallback((): boolean => {
    const errors: FieldErrors = {
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    }

    setFieldErrors(errors)
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true })
    return !Object.values(errors).some((error) => error !== undefined)
  }, [firstName, lastName, email, password, confirmPassword, validateField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    if (!validateAllFields()) return

    try {
      const result = await register.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      })
      
      if (!result?.token) {
        await login.mutateAsync({ email: email.trim().toLowerCase(), password })
      }
    } catch (err: unknown) {
      const extractedErrors = extractFieldErrors(err)
      
      if (extractedErrors) {
        setFieldErrors((prev) => ({ ...prev, ...extractedErrors }))
        setTouched((prev) => ({
          ...prev,
          ...Object.keys(extractedErrors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        }))
      } else {
        const errorMessage = extractErrorMessage(err)
        const lowerError = errorMessage.toLowerCase()
        
        if (lowerError.includes('email') && lowerError.includes('exist')) {
          setFieldErrors((prev) => ({ ...prev, email: 'An account with this email already exists' }))
          setTouched((prev) => ({ ...prev, email: true }))
        } else if (lowerError.includes('email')) {
          setFieldErrors((prev) => ({ ...prev, email: errorMessage }))
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

  const passwordValid = isPasswordValid(password)
  const canSubmit = useMemo(() => {
    return firstName.trim() && lastName.trim() && email.trim() && password && confirmPassword &&
      passwordValid && password === confirmPassword && !register.isPending && !login.isPending
  }, [firstName, lastName, email, password, confirmPassword, passwordValid, register.isPending, login.isPending])

  const isLoading = register.isPending || login.isPending

  const getInputClassName = (field: keyof FieldErrors) => cn(
    'w-full px-4 py-3.5 bg-background border rounded-xl text-text placeholder:text-text-placeholder text-sm focus:outline-none focus:ring-2 transition-colors',
    fieldErrors[field] && touched[field]
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-border focus:ring-primary-dark focus:border-primary-dark',
    isLoading && 'opacity-50 cursor-not-allowed'
  )

  return (
    <div className="w-full flex items-center justify-center px-6 py-8 lg:p-12 bg-background-light min-h-[calc(100vh-56px)] lg:min-h-screen">
      <div className="w-full max-w-sm space-y-5">
        <div className="flex justify-center mb-4">
          <Image src={logoImage} alt="warpSpeed Logo" width={56} height={56} className="w-14 h-14 object-contain" priority />
        </div>

        <div className="text-center mb-6">
          <h1 className="lg:hidden text-2xl font-normal text-text">Create your account</h1>
          <h1 className="hidden lg:block text-2xl font-bold text-text mb-2">Let&apos;s get you started</h1>
          <p className="hidden lg:block text-sm text-grey">
            Sign up to experience AI that actually understands<br />your workflow
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor={firstNameId} className="block text-sm font-medium text-text">First Name</label>
              <input
                id={firstNameId}
                type="text"
                value={firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value, setFirstName)}
                onBlur={(e) => handleBlur('firstName', e.target.value)}
                placeholder="John"
                autoComplete="given-name"
                disabled={isLoading}
                aria-invalid={!!(fieldErrors.firstName && touched.firstName)}
                aria-describedby={fieldErrors.firstName && touched.firstName ? `${firstNameId}-error` : undefined}
                className={getInputClassName('firstName')}
              />
              {fieldErrors.firstName && touched.firstName && (
                <p id={`${firstNameId}-error`} className="text-xs text-red-500 mt-1" role="alert">{fieldErrors.firstName}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor={lastNameId} className="block text-sm font-medium text-text">Last Name</label>
              <input
                id={lastNameId}
                type="text"
                value={lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value, setLastName)}
                onBlur={(e) => handleBlur('lastName', e.target.value)}
                placeholder="Doe"
                autoComplete="family-name"
                disabled={isLoading}
                aria-invalid={!!(fieldErrors.lastName && touched.lastName)}
                aria-describedby={fieldErrors.lastName && touched.lastName ? `${lastNameId}-error` : undefined}
                className={getInputClassName('lastName')}
              />
              {fieldErrors.lastName && touched.lastName && (
                <p id={`${lastNameId}-error`} className="text-xs text-red-500 mt-1" role="alert">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor={emailId} className="block text-sm font-medium text-text">Email</label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
              onBlur={(e) => handleBlur('email', e.target.value)}
              placeholder="Enter Email ID"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={!!(fieldErrors.email && touched.email)}
              aria-describedby={fieldErrors.email && touched.email ? `${emailId}-error` : undefined}
              className={getInputClassName('email')}
            />
            {fieldErrors.email && touched.email && (
              <p id={`${emailId}-error`} className="text-xs text-red-500 mt-1" role="alert">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <PasswordInput
              value={password}
              onChange={(value) => handleFieldChange('password', value, setPassword)}
              onBlur={() => handleBlur('password', password)}
              autoComplete="new-password"
              error={fieldErrors.password}
              showError={touched.password}
              disabled={isLoading}
            />
            <PasswordRequirements password={password} />
          </div>

          <div>
            <PasswordInput
              value={confirmPassword}
              onChange={(value) => handleFieldChange('confirmPassword', value, setConfirmPassword)}
              onBlur={() => handleBlur('confirmPassword', confirmPassword)}
              label="Confirm Password"
              placeholder="Re-enter Password"
              autoComplete="new-password"
              error={fieldErrors.confirmPassword}
              showError={touched.confirmPassword}
              disabled={isLoading}
            />
            {confirmPassword && !fieldErrors.confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Passwords match
              </p>
            )}
          </div>

          <FormError message={generalError} />

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 mt-2 bg-primary-dark hover:bg-primary-darker text-white text-base font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <FormDivider />
        <SocialLoginButtons disabled={isLoading} />

        <p className="hidden lg:block text-xs text-center text-grey mt-6">
          We respect your privacy. You can unlink your account anytime.
        </p>

        <p className="lg:hidden text-sm text-center text-grey mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-dark hover:underline font-medium">Sign in</Link>
        </p>
        
        <p className="hidden lg:block text-sm text-center text-grey mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-secondary underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
