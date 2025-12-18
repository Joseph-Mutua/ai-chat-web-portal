import type {
  LoginType,
  RegisterType,
  RequestDeleteAccountType,
  RequestResetPasswordType,
  ResendVerifyEmailType,
  UpdateUserSettingType,
  UpdateUserType,
  fileObj,
} from '@/types'

import { clearToken, instance, setToken } from './base'

async function getUser() {
  const { data } = await instance.get('/auth/user')
  return data
}

async function updateUser(parameters: UpdateUserType) {
  const { data } = await instance.put('/auth/user', {
    ...parameters,
    dateOfBirth: parameters.dateOfBirth?.toISOString(),
    // phoneNumber: parameters.phoneNumber,
  })
  return data
}

async function updateUserSetting(parameters: UpdateUserSettingType) {
  const { data } = await instance.put('/auth/user/setting', parameters)
  return data
}

async function login(credentials: LoginType) {
  const { data } = await instance.post('/auth/login', credentials)
  setToken(data.token)
  return data
}

async function register(credentials: RegisterType) {
  const { data } = await instance.post('/auth/register', credentials)
  setToken(data.token)
  return data
}

async function logout() {
  const { data } = await instance.post('/auth/logout')
  clearToken()
  return data
}

async function resendVerifyEmail(parameters: ResendVerifyEmailType) {
  const { data } = await instance.post('/auth/resend-verify-email', parameters)
  return data
}

async function requestResetPassword(parameters: RequestResetPasswordType) {
  const { data } = await instance.post(
    '/auth/request-reset-password',
    parameters
  )
  return data
}

async function addUserProfilePic(parameters: fileObj) {
  const { data } = await instance.put('/auth/user/profile-image', parameters, {
    timeout: 60000,
  })
  return data
}

async function deleteAccount(parameters: RequestDeleteAccountType) {
  const { data } = await instance.post('/auth/user/delete', parameters)
  return data
}

async function deactivateAccount() {
  const { data } = await instance.post('/auth/user/deactivate')
  return data
}

async function socialSignIn(type: 'google' | 'apple' | 'facebook') {
  const { data } = await instance.get(`/auth/user/${type}`)
  return data
}

export {
  addUserProfilePic,
  deactivateAccount,
  deleteAccount,
  getUser,
  login,
  logout,
  register,
  requestResetPassword,
  resendVerifyEmail,
  socialSignIn,
  updateUser,
  updateUserSetting,
}
