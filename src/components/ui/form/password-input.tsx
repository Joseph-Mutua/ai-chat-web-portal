'use client'

import { useState, useId } from 'react'
import { cn } from '@/lib/utils/cn'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  label?: string
  placeholder?: string
  error?: string
  showError?: boolean
  autoComplete?: 'current-password' | 'new-password'
  className?: string
  disabled?: boolean
}

export function PasswordInput({
  value,
  onChange,
  onBlur,
  label = 'Password',
  placeholder = 'Enter Password',
  error,
  showError = true,
  autoComplete = 'current-password',
  className,
  disabled = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = useId()
  const errorId = useId()
  const hasError = showError && !!error

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(
            'w-full px-4 py-3.5 pr-12 bg-background border rounded-xl text-text placeholder:text-text-placeholder text-sm focus:outline-none focus:ring-2 transition-colors',
            hasError
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-border focus:ring-primary-dark focus:border-primary-dark',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-placeholder hover:text-text transition-colors disabled:opacity-50"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.736m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {hasError && (
        <p id={errorId} className="text-xs text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
