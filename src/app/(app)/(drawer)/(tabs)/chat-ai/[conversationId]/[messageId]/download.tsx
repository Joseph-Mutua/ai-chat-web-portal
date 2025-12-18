import { useCallback, useEffect, useMemo, useState } from 'react'
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import * as FileSystem from 'expo-file-system'
import { router, useLocalSearchParams } from 'expo-router'

import { CustomDropdownPicker } from '@/components/input/CustomDropdownPicker'
import { CustomTextInput } from '@/components/input/CustomTextInput'
import { Header } from '@/components/page/Header'
import { Button } from '@/components/ui/elements/button/Button'
import { Typography } from '@/components/ui/elements/typography/Typography'
import { ScreenContainer } from '@/components/ui/layout/ScreenContainer'

import { Theme } from '@/constants/Colors'

import { useDownloadChatAI } from '@/hooks/api'
import { useNotifications } from '@/hooks/context'
import { useDocumentPreview } from '@/hooks/useDocumentPreview'

import { pixelSizeHorizontal, pixelSizeVertical } from '@/utils/responsive'

type ExportOption = 'message' | 'chat'
type FileType = 'pdf' | 'docx'

type FormErrors = Partial<
  Record<'exportOption' | 'fileName' | 'fileType', string>
>

function arrayBufferToBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf)
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk)) as any
    )
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(binary, 'binary').toString('base64')
  }

  if (typeof btoa !== 'undefined') return btoa(binary)

  throw new Error('No base64 encoder available')
}

const DownloadGeneratedContent = () => {
  const {
    conversationId,
    messageId,
    chatConversationTitle,
    selectedOption,
    fromAIAssistant,
    path,
    params,
    data,
  } = useLocalSearchParams()

  const { pushNotification } = useNotifications()

  const { openPreview } = useDocumentPreview()

  const initialExportOption = (selectedOption as ExportOption) ?? 'message'
  const initialFileName = (chatConversationTitle as string) ?? ''
  const initialFileType: FileType = 'pdf'

  const [exportOption, setExportOption] =
    useState<ExportOption>(initialExportOption)

  const [fileName, setFileName] = useState<string>(initialFileName)

  const [fileType, setFileType] = useState<FileType>(initialFileType)

  const [errors, setErrors] = useState<FormErrors>({})

  const { mutateAsync, isPending } = useDownloadChatAI()

  const exportItems = useMemo(
    () => [
      { label: 'Export Answer', value: 'message' as ExportOption },
      { label: 'Export Full Chat', value: 'chat' as ExportOption },
    ],
    []
  )

  const fileTypeItems = useMemo(
    () => [
      { label: 'PDF', value: 'pdf' as const },
      { label: 'Docx', value: 'docx' as const },
    ],
    []
  )

  // Handle back navigation based on presence of fromAIAssistant param
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    )

    return () => backHandler.remove()
  }, [])

  const validate = useCallback((): FormErrors => {
    const next: FormErrors = {}
    if (!exportOption) next.exportOption = 'Please select what to export.'
    if (!fileName?.trim()) next.fileName = 'Please enter a file name.'
    if (!fileType) next.fileType = 'Please choose a file type.'
    return next
  }, [exportOption, fileName, fileType])

  const handleSubmit = useCallback(async () => {
    const validation = validate()
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    try {
      const payload = {
        content: exportOption,
        name: fileName,
        type: fileType,
        messageId,
      }

      const fileBytes = await mutateAsync({
        conversationId: conversationId as string,
        params: payload as Record<string, string>,
      })

      const ext = fileType.toLowerCase() as FileType
      const targetPath = FileSystem.documentDirectory + `${fileName}.${ext}`

      const b64 = arrayBufferToBase64(fileBytes as ArrayBuffer)
      await FileSystem.writeAsStringAsync(targetPath, b64, {
        encoding: FileSystem.EncodingType.Base64,
      })

      await openPreview({
        uri: targetPath,
        ext,
        title: `${fileName}.${ext}`,
      })
    } catch (e) {
      console.error(e)
      pushNotification({
        title: 'Error',
        text: 'Couldn’t download your export.',
      })
    }
  }, [
    validate,
    exportOption,
    fileName,
    fileType,
    conversationId,
    messageId,
    setErrors,
    pushNotification,
  ])

  const clearError = (key: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }))

  // Handle back navigation based on presence of fromAIAssistant param
  const handleBackPress = useCallback(() => {
    if (fromAIAssistant === 'true') {
      router.replace({
        pathname: `/ai-assistant`,
        params: {
          conversationId: conversationId as string,
          path,
          params,
          data,
        },
      })
      return true // Indicate that the back action has been handled
    }
    router.back()
    return true
  }, [fromAIAssistant, conversationId])

  return (
    <ScreenContainer withSafeAreaView={false}>
      <View style={styles.head}>
        <Header
          title="Export Options"
          textType="header"
          customNav={handleBackPress}
        />
      </View>

      <View style={styles.content}>
        <View style={{ zIndex: 2 }}>
          <CustomDropdownPicker
            label="Export"
            items={exportItems}
            value={exportOption}
            error={errors.exportOption ?? ''}
            onChange={(val: string) => {
              clearError('exportOption')
              setExportOption(val as ExportOption)
            }}
            placeholder="Choose export range"
            renderListItem={(props: any) => (
              <Pressable
                onPress={() => props.onPress(props)}
                style={({ pressed }) => [
                  styles.customListItem,
                  pressed ? { opacity: 0.6 } : {},
                ]}
              >
                <Ionicons
                  name={
                    props.item.value === 'chat'
                      ? 'albums-outline'
                      : 'document-outline'
                  }
                  color={Theme.brand.black}
                  size={16}
                />
                <Text style={{ fontWeight: props.isSelected ? 'bold' : 500 }}>
                  {props.item.label}
                </Text>
              </Pressable>
            )}
            {...dropdownStyleProps}
          />
        </View>

        <View style={{ zIndex: 1 }}>
          <CustomTextInput
            label="File Name"
            value={fileName}
            error={errors.fileName ?? ''}
            onChangeText={(value: string) => {
              clearError('fileName')
              setFileName(value)
            }}
            placeholder="File Name"
            autoCapitalize="none"
            customStyles={{ borderColor: Theme.brand.green }}
            labelStyle={{ color: Theme.brand.green, fontWeight: 500 }}
          />
        </View>
        <CustomDropdownPicker
          label="File Type"
          items={fileTypeItems}
          value={fileType}
          error={errors.fileType ?? ''}
          placeholder="Choose document type"
          onChange={(value: string) => {
            clearError('fileType')
            setFileType(value as FileType)
          }}
          renderListItem={(props: any) => (
            <Pressable
              onPress={() => props.onPress(props)}
              style={({ pressed }) => [
                styles.customListItem,
                pressed ? { opacity: 0.6 } : {},
              ]}
            >
              <Typography variant={props.isSelected ? 'bodyBold' : 'body'}>
                {props.item.label}
              </Typography>
            </Pressable>
          )}
          {...dropdownStyleProps}
        />

        <View
          style={[
            styles.innerBox,
            { justifyContent: 'flex-start', gap: pixelSizeHorizontal(12) },
          ]}
        >
          <Button
            variant="primary"
            title="Download"
            isProcessing={isPending}
            onPress={handleSubmit}
            disabled={isPending}
          />
          <Button
            variant="outline"
            title="Cancel"
            onPress={() => {
              setExportOption(initialExportOption)
              setFileName(initialFileName)
              setFileType(initialFileType)
              setErrors({})
              handleBackPress()
            }}
            disabled={isPending}
          />
        </View>
      </View>
    </ScreenContainer>
  )
}

const dropdownStyleProps = {
  customStyles: {
    borderColor: Theme.brand.green,
  },
  customLabelStyles: {
    color: Theme.brand.green,
    fontWeight: '500',
  },
  dropDownContainerStyle: {
    marginTop: pixelSizeVertical(1),
    borderColor: 'transparent',
    backgroundColor: Theme.brand.coolGrey,
    shadowRadius: pixelSizeVertical(4),
    shadowOpacity: 0.25,
    shadowColor: Theme.brand.black,
    shadowOffset: {
      width: 0,
      height: pixelSizeVertical(2),
    },
    elevation: 5,
  },
  customIconColour: Theme.brand.green,
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: pixelSizeVertical(12),
  },
  content: {
    flexDirection: 'column',
    marginVertical: pixelSizeVertical(24),
    gap: pixelSizeVertical(32),
  },
  menu: {
    flexDirection: 'column',
    gap: pixelSizeVertical(16),
    marginTop: pixelSizeVertical(24),
  },
  customListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: pixelSizeVertical(12),
    gap: pixelSizeHorizontal(6),
  },
  box: {
    backgroundColor: 'white',
    borderRadius: pixelSizeVertical(8),
    paddingVertical: pixelSizeVertical(20),
    paddingHorizontal: pixelSizeHorizontal(16),
    marginBottom: pixelSizeVertical(8),

    shadowColor: Theme.brand.grey,
    shadowOffset: { width: 0, height: pixelSizeVertical(4) },
    shadowOpacity: 0.2,
    shadowRadius: pixelSizeVertical(4),
    elevation: 2,
  },
  innerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    marginTop: pixelSizeVertical(4),
  },
})

export default DownloadGeneratedContent
