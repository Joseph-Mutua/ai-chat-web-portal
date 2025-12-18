import { z } from 'zod'

import {
  bio,
  dateOfBirth,
  email,
  firstName,
  gender,
  iCloudPassword,
  lastName,
  loginPassword,
  nickname,
  password,
} from './fields'

const registerOneBaseSchema = z.object({
  firstName,
  lastName,
  email: email.min(1, 'Email is required'),
  password,
  confirmPassword: z
    .string({
      required_error: 'Confirm Password is required',
    })
    .min(1, 'Confirm Password is required'),
})

export const registerOneSchema = registerOneBaseSchema
  .refine(({ password }) => /[a-zA-Z]/.test(password), {
    path: ['password'],
    message: 'Password must include at least one letter',
  })
  .refine(({ password }) => /[A-Z]/.test(password), {
    path: ['password'],
    message: 'Password must include at least one capital letter',
  })
  .refine(({ password }) => /\d/.test(password), {
    path: ['password'],
    message: 'Password must include at least one number',
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const registerTwoSchema = z.object({
  dateOfBirth: dateOfBirth,
  gender: gender,
  // phoneNumber: phoneNumber,
  nickname: nickname.optional(),
  bio: bio.optional(),
})

export const loginSchema = z.object({
  email: email.min(1, 'Email is required'),
  password: loginPassword,
})

export const iCloudLoginSchema = z.object({
  username: email.min(1, 'Email is required'),
  password: iCloudPassword.min(1, 'Password is required'),
})

export const requestResetPasswordSchema = z.object({
  email: email.min(1, 'Email is required'),
})
