export interface FieldError {
  field: string
  message: string
}

export interface ApiErrorResponse {
  success: false
  message?: string
  errors?: FieldError[]
}

export interface ApiError extends Error {
  response?: {
    status: number
    data?: ApiErrorResponse | { message?: string }
  }
  code?: string
}

export interface FormFieldErrors {
  [field: string]: string | undefined
}

export function isApiError(error: unknown): error is ApiError {
  return error !== null && typeof error === 'object' && 'response' in error
}

export function hasFieldErrors(data: unknown): data is ApiErrorResponse {
  return (
    data !== null &&
    typeof data === 'object' &&
    'errors' in data &&
    Array.isArray((data as ApiErrorResponse).errors)
  )
}

export function extractFieldErrors(error: unknown): FormFieldErrors | null {
  if (!isApiError(error)) return null
  
  const data = error.response?.data
  if (!hasFieldErrors(data)) return null
  
  const fieldErrors: FormFieldErrors = {}
  data.errors?.forEach((err) => {
    fieldErrors[err.field] = err.message
  })
  
  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null
}

export function extractErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (error instanceof Error) {
    if (isApiError(error) && error.response?.data) {
      const data = error.response.data
      if (typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
        return data.message
      }
      if (hasFieldErrors(data) && data.errors?.length) {
        return data.errors.map((e) => e.message).join('. ')
      }
    }
    return error.message || fallback
  }
  
  if (typeof error === 'string') return error
  return fallback
}
