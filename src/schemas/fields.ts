import parsePhoneNumber from 'libphonenumber-js'
import { z } from 'zod'

export const id = z.string().cuid()

export const firstName = z
  .string({
    required_error: 'First name is required',
    invalid_type_error: 'First name must be a string',
  })
  .trim()
  .min(1, 'First name must be at least 1 characters')

export const lastName = z
  .string({
    required_error: 'Last name is required',
    invalid_type_error: 'Last name must be a string',
  })
  .trim()
  .min(1, 'Last name must be at least 1 characters')

export const email = z
  .string({
    required_error: 'Email is required',
  })
  .min(1, 'Email is required')
  .email('This is not a valid email')

export const password = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(12, 'Password must be at least 12 characters')

export const iCloudPassword = z.string({
  required_error: 'Password is required',
  invalid_type_error: 'Password must be a string',
})

export const dateOfBirth = z.date({
  required_error: 'Date of birth is required',
  invalid_type_error: 'Date of birth is required',
})

export const gender = z.enum(['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY', 'OTHER'], {
  required_error: 'Gender is required',
  invalid_type_error: 'Gender is required',
})

export const phoneNumber = z.string().transform((number, ctx) => {
  if (number === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Phone number is required',
    })
    return z.NEVER
  }

  const phone = parsePhoneNumber(
    number.substring(0, 2) === '07'
      ? `+447${number.substring(2, number.length)}`
      : number
  )

  if (phone && phone.isValid()) {
    return phone.number
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: 'Invalid phone number',
  })

  return z.NEVER
})

export const nickname = z.string({
  invalid_type_error: 'Nickname must be a string',
})

export const bio = z
  .string({
    invalid_type_error: 'Bio must be a string',
  })
  .max(141)

export const noteTitle = z.string({
  required_error: 'Note Title is required',
  invalid_type_error: 'Note Title must be a string',
})

export const noteDescription = z.string({
  required_error: 'Note description is required',
  invalid_type_error: 'Note description must be string',
})

export const taskName = z.string({
  required_error: 'Task name is required',
  invalid_type_error: 'Task name must be string',
})

export const taskDescription = z.string({
  required_error: 'Task description is required',
  invalid_type_error: 'Task description must be string',
})

export const dueAt = z.date({
  required_error: 'Task Due date is required',
  invalid_type_error: 'Task Due date is required',
})

export const integrationPassword = z.string({
  invalid_type_error: 'Password is required',
})

export const loginPassword = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, 'Password must be at least 8 characters')
