import { useMutation, useQueryClient } from '@tanstack/react-query'

import { configureAuth } from 'react-query-auth'

import type {
  AuthResponseType,
  LoginType,
  RegisterType,
  RequestDeleteAccountType,
} from '@/types'

import { removePushNotificationTokenFromStorage, removeTokenFromStorage, setTokenInStorage } from '@/utils/storage'

import { queries } from '@/queries'
import {
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
} from '@/services/api'

async function handleUserResponse(data: AuthResponseType) {
  const { token, user } = data
  await setTokenInStorage(token)
  return user
}

async function userFn() {
  const response = await getUser()
  return response.user ?? null
}

async function loginFn(credentials: LoginType) {
  const response = await login(credentials)
  const user = await handleUserResponse(response)
  return user
}

async function registerFn(credentials: RegisterType) {
  const response = await register(credentials)
  const user = await handleUserResponse(response)
  return user
}

async function logoutFn() {
  const response = await logout()
  await removeTokenFromStorage()
  await removePushNotificationTokenFromStorage()
  return response
}

async function deleteAccountFn(requestParams: RequestDeleteAccountType) {
  const response = await deleteAccount(requestParams)
  await logout()
  await removeTokenFromStorage()
  await removePushNotificationTokenFromStorage()
  return response
}

async function deactivateAccountFn() {
  const response = await deactivateAccount()
  await logout()
  await removeTokenFromStorage()
  await removePushNotificationTokenFromStorage()
  return response
}

async function socialSignInFn(type: 'google' | 'apple' | 'facebook') {
  const response = await socialSignIn(type)
  return response
}

export const { useUser, useLogin, useRegister, useLogout, AuthLoader } =
  configureAuth({
    userFn,
    loginFn,
    registerFn,
    logoutFn,
  })

export function useUpdateUser() {
  const queryClient = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    mutationKey: ['authenticated-user'],
    onSuccess(data, variables, context) {
      // Updating User's cache
      queryClient.invalidateQueries({
        queryKey: queries.home.detail().queryKey,
      })
      queryClient.setQueryData(
        ['authenticated-user'],
        (prevData: AuthResponseType['user']) => ({
          ...prevData,
          ...variables,
        })
      )
    },
  })

  return updateUserMutation
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient()

  const updateUserSettingMutation = useMutation({
    mutationFn: updateUserSetting,
    mutationKey: ['authenticated-user-settings'],
    onSuccess(data, variables, context) {
      // Updating User's setting cache
      queryClient.setQueryData(
        ['authenticated-user'],
        (prevData: AuthResponseType['user']) => {
          if (!prevData) return prevData

          return {
            ...prevData,
            settings: {
              ...prevData?.settings,
              [variables.key]: variables.value,
            },
          }
        }
      )
    },
  })

  return updateUserSettingMutation
}

export function useResendVerifyEmail() {
  const resendVerifyEmailMutation = useMutation({
    mutationFn: resendVerifyEmail,
  })

  return resendVerifyEmailMutation
}

export function useRequestResetPassword() {
  const requestResetPasswordMutation = useMutation({
    mutationFn: requestResetPassword,
  })

  return requestResetPasswordMutation
}

export function useAddProfilePic() {
  const addProfilePicMutation = useMutation({
    mutationFn: addUserProfilePic,
  })

  return addProfilePicMutation
}

export function useDeleteAccount() {
  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccountFn,
  })

  return deleteAccountMutation
}

export function useDeactivateAccount() {
  const deactivateAccountMutation = useMutation({
    mutationFn: deactivateAccountFn,
  })

  return deactivateAccountMutation
}

export function useSocialSignIn() {
  const socialSignInMutation = useMutation({
    mutationFn: socialSignInFn,
  })

  return socialSignInMutation
}
