import { useState } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import RNFS from 'react-native-fs'

import * as Sharing from 'expo-sharing'

import { getFileName } from '@/utils/generateAttachmentFileName'

import { Attachment } from '@/types'

import { reportError } from '@/services/bugsnag'

const DOWNLOAD_FOLDER = RNFS.DownloadDirectoryPath
const DOCUMENT_FOLDER = RNFS.DocumentDirectoryPath
const FOLDER_NAME = 'warpSpeed'

export const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'App needs access to your storage to download files.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED
  }
  return true // iOS or Android 10+ does not need it
}

export const createFolder = async (path: string, fallback: string) => {
  try {
    const isGranted = await requestStoragePermission()
    if (!isGranted) {
      return fallback
    }
    const exists = await RNFS.exists(path)
    if (!exists) await RNFS.mkdir(path)
    return path
  } catch {
    return fallback
  }
}

export const getDownloadDir = async () =>
  Platform.OS === 'android'
    ? createFolder(`${DOWNLOAD_FOLDER}/${FOLDER_NAME}`, DOWNLOAD_FOLDER)
    : DOCUMENT_FOLDER

const downloadFile = async (url: string, filePath: string) => {
  const options = { fromUrl: url, toFile: filePath }
  const result = await RNFS.downloadFile(options).promise

  if (result.statusCode !== 200) {
    throw new Error(`Download failed: ${result.statusCode}`)
  }

  return result
}

const handleError = (error: any, attachment: Attachment) => {
  const errorMessage = error?.message || 'Download failed'

  reportError(error, {
    context: 'Download Error',
    severity: 'error',
    metadata: { attachment: attachment.name, error: errorMessage },
  })

  return errorMessage
}

const toFileUri = (p: string) => (p.startsWith('file://') ? p : `file://${p}`)

export const useDownloadAttachment = () => {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadAttachment = async (attachment: Attachment) => {
    try {
      setIsDownloading(true)

      const downloadDir = await getDownloadDir()

      const filePath = getFileName(
        { ...attachment, expiryAt: new Date() },
        downloadDir
      )

      // Return existing file if it exists
      if (await RNFS.exists(filePath)) {
        // On iOS, present share sheet so user can save/export the file
        if (Platform.OS === 'ios' && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(toFileUri(filePath), {
            mimeType: attachment.mimetype,
            dialogTitle: 'Save or Share',
          })
        }
        return { filePath, error: null }
      }

      // Download new file
      await downloadFile(attachment.url, filePath)

      // On iOS, present share sheet so user can save/export the file
      if (Platform.OS === 'ios' && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(toFileUri(filePath), {
          mimeType: attachment.mimetype,
          dialogTitle: 'Save or Share',
        })
      }

      return { filePath, error: null }
    } catch (error) {
      const errorMessage = handleError(error, attachment)
      return { filePath: null, error: errorMessage }
    } finally {
      setIsDownloading(false)
    }
  }

  return { downloadAttachment, isDownloading }
}
