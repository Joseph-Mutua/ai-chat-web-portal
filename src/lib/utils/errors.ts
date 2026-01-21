import { AxiosError } from 'axios'

export interface AppError {
  message: string
  status?: number
  code?: string
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'An error occurred'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof AxiosError) {
    return error.response?.status
  }
  return undefined
}

export function isAuthError(error: unknown): boolean {
  const status = getErrorStatus(error)
  return status === 401 || status === 403
}

export function formatError(error: unknown): AppError {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error),
  }
}
