import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import FileViewer from 'react-native-file-viewer'
import RNFS from 'react-native-fs'

import { useNotifications } from '@/hooks/context'

import { getFileName } from '@/utils/generateAttachmentFileName'

import { Attachment } from '@/types'

import { reportError } from '@/services/bugsnag'

const fileDir = RNFS.CachesDirectoryPath

export const useCachedAttachment = (
  attachment: Attachment,
  cacheOnPress?: boolean
) => {
  const { id, name, mimetype, url, expiryAt } = attachment

  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [downloadedPath, setDownloadedPath] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState(false)

  const { pushNotification } = useNotifications()

  useEffect(() => {
    if (attachment && !cacheOnPress) {
      cacheFile()
    }
  }, [attachment, cacheOnPress])

  const cacheFile = async () => {
    const filePath = getFileName()
    const isFileExists = await RNFS.exists(filePath)

    if (!isFileExists) {
      setIsDownloading(true)

      try {
        const options = { fromUrl: url, toFile: filePath }
        // Download the file and wait for the download to complete
        await RNFS.downloadFile(options).promise
        setDownloadedPath(filePath)
        setDownloadError(null)
        setIsDownloading(false)

        return filePath
      } catch (error: any) {
        reportError(error, {
          context: 'Error downloading audio',
          severity: 'error',
          metadata: { error: error },
        })
        setDownloadError(
          error?.message || 'An error occurred while downloading the file'
        )
        setIsDownloading(false)
        return null
      }
    } else {
      setDownloadedPath(filePath)
      setIsDownloading(false)
      return filePath
    }
  }

  // Generate a file name based on the URL and a prefix (default is "DOC") e.g. DOC-123456789.pdf
  const getFileName = (): string => {
    let prefix = 'DOC'
    if (mimetype.includes('audio')) {
      prefix = 'AUD'
    } else if (mimetype.includes('video')) {
      prefix = 'VID'
    } else if (mimetype.includes('image')) {
      prefix = 'IMG'
    }
    const regax = /(?:\.([^.]+))?$/
    const fileExtension = regax.exec(name)?.[1] || ''
    const time = new Date(expiryAt).getTime()
    return `${fileDir}/${prefix}-${time}-${id}.${fileExtension}`
  }

  // open the document in the default viewer
  const openAttachment = async (isRetry = false) => {
    try {
      const path = downloadedPath ?? (await cacheFile())

      if (path) {
        if (mimetype.includes('image') && Platform.OS === 'android') {
          setPreviewImage(true)
          return
        }
        FileViewer.open(path, { showOpenWithDialog: true }).catch((error) => {
          pushNotification(
            {
              title: 'Error',
              text: error.message || 'An error occurred while opening the file',
            },
            5000
          )
        })
      } else if (isRetry) {
        throw new Error('Failed to download the attachment. Please try again.')
      } else {
        openAttachment(true)
      }
    } catch (error: any) {
      pushNotification(
        {
          title: 'Error',
          text: error?.message || 'An error occurred while opening the file',
        },
        5000
      )
    }
  }

  return {
    isDownloading,
    downloadedPath,
    downloadError,
    previewImage,
    setPreviewImage,
    openAttachment,
  }
}

export const useGetCachedFile = () => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  const getCachedFile = async (
    attachment: Attachment
  ): Promise<{ filePath: string | null; error: string | null }> => {
    const filePath = getFileName(attachment, fileDir)

    const isFileExists = await RNFS.exists(filePath)

    if (!isFileExists) {
      setIsDownloading(true)

      try {
        const options = { fromUrl: attachment.url, toFile: filePath }
        // Download the file and wait for the download to complete
        await RNFS.downloadFile(options).promise
        setIsDownloading(false)

        return { filePath, error: null }
      } catch (error: any) {
        reportError(error, {
          context: 'Error downloading file from URL',
          severity: 'error',
          metadata: { error: error },
        })
        setIsDownloading(false)
        return {
          filePath: null,
          error:
            error?.message || 'An error occurred while downloading the file',
        }
      }
    } else {
      setIsDownloading(false)
      return { filePath, error: null }
    }
  }

  return { getCachedFile, getFileName, isDownloading }
}
