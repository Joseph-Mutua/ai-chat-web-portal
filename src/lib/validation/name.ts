export const NAME_REGEX = /^[a-zA-Z\s\-']+$/
export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 50

export function isNameValid(name: string): boolean {
  const trimmed = name.trim()
  return (
    trimmed.length >= NAME_MIN_LENGTH &&
    trimmed.length <= NAME_MAX_LENGTH &&
    NAME_REGEX.test(trimmed)
  )
}

export function validateName(name: string, fieldName: string = 'Name'): string | undefined {
  const trimmed = name.trim()
  
  if (!trimmed) return `${fieldName} is required`
  if (trimmed.length < NAME_MIN_LENGTH) return `${fieldName} must be at least ${NAME_MIN_LENGTH} characters`
  if (trimmed.length > NAME_MAX_LENGTH) return `${fieldName} must be less than ${NAME_MAX_LENGTH} characters`
  if (!NAME_REGEX.test(trimmed)) return `${fieldName} can only contain letters`
  return undefined
}
