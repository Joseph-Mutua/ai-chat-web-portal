'use client'

import { useState, useCallback } from 'react'
import { extractFieldErrors, extractErrorMessage, type FormFieldErrors } from '@/types'

interface UseApiErrorReturn {
  error: string
  fieldErrors: FormFieldErrors
  setError: (message: string) => void
  setFieldErrors: (errors: FormFieldErrors) => void
  setFieldError: (field: string, message: string | undefined) => void
  clearErrors: () => void
  clearFieldError: (field: string) => void
  handleError: (error: unknown) => void
  hasFieldError: (field: string) => boolean
  getFieldError: (field: string) => string | undefined
}

export function useApiError(): UseApiErrorReturn {
  const [error, setErrorState] = useState('')
  const [fieldErrors, setFieldErrorsState] = useState<FormFieldErrors>({})

  const setError = useCallback((message: string) => {
    setErrorState(message)
  }, [])

  const setFieldErrors = useCallback((errors: FormFieldErrors) => {
    setFieldErrorsState((prev) => ({ ...prev, ...errors }))
  }, [])

  const setFieldError = useCallback((field: string, message: string | undefined) => {
    setFieldErrorsState((prev) => ({ ...prev, [field]: message }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrorState('')
    setFieldErrorsState({})
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setFieldErrorsState((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
  }, [])

  const handleError = useCallback((err: unknown) => {
    const extractedFieldErrors = extractFieldErrors(err)
    
    if (extractedFieldErrors && Object.keys(extractedFieldErrors).length > 0) {
      setFieldErrorsState((prev) => ({ ...prev, ...extractedFieldErrors }))
    } else {
      const message = extractErrorMessage(err)
      setErrorState(message)
    }
  }, [])

  const hasFieldError = useCallback((field: string): boolean => {
    return !!fieldErrors[field]
  }, [fieldErrors])

  const getFieldError = useCallback((field: string): string | undefined => {
    return fieldErrors[field]
  }, [fieldErrors])

  return {
    error,
    fieldErrors,
    setError,
    setFieldErrors,
    setFieldError,
    clearErrors,
    clearFieldError,
    handleError,
    hasFieldError,
    getFieldError,
  }
}
