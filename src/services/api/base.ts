import axios from 'axios'

import { Platform } from 'react-native'


import Constants from 'expo-constants'

const apis = Constants.expoConfig?.extra?.apis || {}

const baseURL = apis.apiUrl || 'https://api.iamwarpspeed.com'
const uploadURL = apis.uploadUrl || 'https://upload.iamwarpspeed.com'
const googlePlacesURL = 'https://places.googleapis.com'

const instance = axios.create({
  baseURL,
  timeout: 40000,
})

const uploadInstance = axios.create({
  baseURL: uploadURL,
  timeout: 300000, // 5 minutes
})

const googlePlacesInstance = axios.create({
  baseURL: googlePlacesURL,
  timeout: 300000,
})

instance.interceptors.response.use((response) => {
  if (__DEV__) {
    console.log(
      'Request:',
      `${response.config.method?.toUpperCase()} - ${response.config.baseURL}${response.config.url}`
    )
  }

  const ct = response.headers?.['content-type'] || ''
  if (
    response.config.responseType === 'arraybuffer' ||
    response.config.responseType === 'blob' ||
    ct.includes('application/pdf') ||
    ct.includes('application/octet-stream')
  ) {
    return response
  }

  const { data } = response.data ?? {}
  response.data = data ?? response.data
  return response
})

uploadInstance.interceptors.response.use((response) => {
  const { data } = response.data
  response.data = data
  return response
})

googlePlacesInstance.interceptors.request.use((config) => {
  const API_KEY =
    Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_GOOGLE_API_KEY_ANDROID
      : process.env.EXPO_PUBLIC_GOOGLE_API_KEY_IOS

  if (!API_KEY) {
    throw new Error('Google API key is not defined')
  }

  config.headers['Content-Type'] = 'application/json'
  config.headers['X-Goog-Api-Key'] = API_KEY

  return config
})

let authInterceptor: number | null = null
let uploadAuthInterceptor: number | null = null
let creditInterceptor: number | null = null

function setToken(token: string) {
  clearToken()
  authInterceptor = instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${token}`
    return config
  })
  uploadAuthInterceptor = uploadInstance.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${token}`
    return config
  })
}

function clearToken() {
  if (authInterceptor !== null) {
    instance.interceptors.request.eject(authInterceptor)
    authInterceptor = null
  }
  if (uploadAuthInterceptor !== null) {
    uploadInstance.interceptors.request.eject(uploadAuthInterceptor)
    uploadAuthInterceptor = null
  }
  if (creditInterceptor !== null) {
    instance.interceptors.response.eject(creditInterceptor)
    creditInterceptor = null
  }
}

export { clearToken, googlePlacesInstance, instance, setToken, uploadInstance }
