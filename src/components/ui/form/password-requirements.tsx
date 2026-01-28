'use client'

import { useMemo } from 'react'
import { getPasswordValidationResults } from '@/lib/validation'

interface PasswordRequirementsProps {
  password: string
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function CircleIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-grey flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
    </svg>
  )
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const checks = useMemo(() => getPasswordValidationResults(password), [password])

  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-grey mb-1">Password must contain:</p>
      <div className="grid grid-cols-1 gap-0.5" role="list" aria-label="Password requirements">
        {checks.map((check) => (
          <div key={check.id} className="flex items-center gap-1.5" role="listitem">
            {check.met ? <CheckIcon /> : <CircleIcon />}
            <span className={`text-xs ${check.met ? 'text-green-600' : 'text-grey'}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
