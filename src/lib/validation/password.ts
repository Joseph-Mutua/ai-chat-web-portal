export interface PasswordRequirement {
  id: string
  label: string
  validator: (password: string) => boolean
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { id: 'length', label: 'At least 12 characters', validator: (p) => p.length >= 12 },
  { id: 'uppercase', label: 'One uppercase letter', validator: (p) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'One lowercase letter', validator: (p) => /[a-z]/.test(p) },
  { id: 'number', label: 'One number', validator: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$%^&*)', validator: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every((req) => req.validator(password))
}

export function getPasswordValidationResults(password: string): Array<PasswordRequirement & { met: boolean }> {
  return PASSWORD_REQUIREMENTS.map((req) => ({
    ...req,
    met: req.validator(password),
  }))
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required'
  if (!isPasswordValid(password)) return 'Password does not meet all requirements'
  return undefined
}
