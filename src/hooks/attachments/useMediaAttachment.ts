import { isAxiosError } from 'axios'

import { Platform } from 'react-native'
import RNFS from 'react-native-fs'

import {
  FileType,
  ModuleType,
  UploadFileResponseType,
  UploadFileType,
} from '@/types/attachments'

import { reportError } from '@/services/bugsnag'

import { useNotifications } from '../context'

/**
 * Convert a file URI to Base64 string
 */
const convertFileToBase64 = async (file: FileType): Promise<string> => {
  try {
    // Handle iOS URI decoding for proper file access
    const fileUri =
      Platform.OS === 'ios' ? decodeURIComponent(file.uri) : file.uri

    const base64Data = await RNFS.readFile(fileUri, 'base64')
    return base64Data
  } catch (error) {
    reportError(error, {
      context: 'Error converting file to base64',
      severity: 'error',
      metadata: { error: error },
    })
    return ''
  }
}

/**
 * Extract filename from file URI using regex
 */
const getFileNameFromUri = (uri: string): string | null => {
  const regex = /[^/]+(\.[a-zA-Z0-9]+)$/
  const match = uri.match(regex)
  return match ? match[0] : null
}

/**
 * Generate a fallback filename with timestamp and index
 */
const generateFallbackFilename = (index: number): string => {
  const timestamp = new Date().toISOString()
  return `file-${timestamp}-${index}`
}

/**
 * Prepare file data for upload with proper error handling
 */
const prepareFileForUpload = async (file: FileType, index: number) => {
  let base64 = file.base64

  // Convert to base64 if not already provided
  if (!base64) {
    base64 = await convertFileToBase64(file)

    if (base64 === '') {
      throw new Error('Failed to convert file to base64')
    }
  }

  return {
    originalFilename:
      file.name ||
      getFileNameFromUri(file.uri) ||
      generateFallbackFilename(index),
    mimetype: file.type || '',
    size: file.size || 0,
    attachment: base64,
    url: file.uri,
  }
}

/**
 * Extract error message from API response
 */
const extractErrorMessage = (error: any): string => {
  if (
    isAxiosError(error) &&
    typeof error.response?.data?.message === 'string'
  ) {
    return error.response.data.message
  }
  return error?.message || 'Something went wrong'
}

export const useMediaAttachment = () => {
  const { pushNotification } = useNotifications()

  /**
   * Upload multiple files with comprehensive error handling
   */
  const uploadFiles = async (
    params: UploadFileType
  ): Promise<UploadFileResponseType> => {
    const { files } = params

    // Early return for empty file array
    if (files?.length === 0) {
      return {
        data: [],
        success: true,
        errorText: undefined,
      }
    }

    try {
      // Prepare all files for upload concurrently
      const preparedFiles = await Promise.all(
        files.map((file, index) => prepareFileForUpload(file, index))
      )

      // Upload all prepared files
    } catch (error) {
      // Handle file preparation errors
      if (
        error instanceof Error &&
        error.message === 'Failed to convert file to base64'
      ) {
        pushNotification?.(
          { title: 'We had a problem sending your file, please try again.' },
          5000
        )
        return {
          data: [],
          success: false,
          errorText: error.message,
        }
      }

      // Handle API upload errors
      const errorMessage = extractErrorMessage(error)
      pushNotification?.({ title: errorMessage }, 5000)

      return {
        data: [],
        success: false,
        errorText: errorMessage,
      }
    }
  }

  return {
    uploadFiles,
    isUploading: false,
  }
}
