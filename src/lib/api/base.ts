import axios, { AxiosInstance, AxiosError } from 'axios'
import { storage } from '../utils/storage'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.iamwarpspeed.com'
const UPLOAD_URL =
  process.env.NEXT_PUBLIC_UPLOAD_URL || 'https://upload.iamwarpspeed.com'

// Create axios instances
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadClient: AxiosInstance = axios.create({
  baseURL: UPLOAD_URL,
  timeout: 300000, // 5 minutes for uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

uploadClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for data unwrapping
apiClient.interceptors.response.use(
  (response) => {
    // Some APIs wrap data in a 'data' property
    if (response.data?.data) {
      response.data = response.data.data
    }
    return response
  },
  (error: AxiosError) => {
    // Handle 401 errors globally
    if (error.response?.status === 401) {
      storage.clear()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

uploadClient.interceptors.response.use(
  (response) => {
    if (response.data?.data) {
      response.data = response.data.data
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.clear()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Token management functions
export function setToken(token: string): void {
  storage.setToken(token)
}

export function clearToken(): void {
  storage.clear()
}
