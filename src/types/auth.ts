export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
  profileImageUrl?: string // Legacy field
  profileImage?: {
    url: string | null
    publicId: string | null
  }
  phoneNumber?: string | null
  dateOfBirth?: string | null
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null
  nickname?: string | null
  bio?: string | null
  settings?: UserSettings
}

export interface UserSettings {
  dataSharing?: boolean
  [key: string]: boolean | string | undefined
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface SocialSignInResponse {
  authUrl: string
}

export type OAuthProvider = 'google' | 'apple' | 'facebook'
