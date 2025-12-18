import { isAxiosError } from 'axios'

import { useCallback, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'

import { useFocusEffect, useRouter } from 'expo-router'

import { Button } from '@/components/ui/elements/button/Button'
import { HeaderBar } from '@/components/ui/elements/header/HeaderBar'
import { Subheading } from '@/components/ui/elements/typography/Typography'
import { LabeledInput } from '@/components/ui/form/LabeledInput'
import { ScreenContainer } from '@/components/ui/layout/ScreenContainer'

import { useRequestResetPassword } from '@/hooks/api'

import { validateInput } from '@/utils/helpers'
import { pixelSizeHorizontal, pixelSizeVertical } from '@/utils/responsive'

import { requestResetPasswordSchema } from '@/schemas/auth'

const defaultValueState = {
  email: '',
}

const defaultErrorState: {
  email: string | null
  failMsg: string | null
} = {
  email: null,
  failMsg: null,
}

export default function ForgotPasswordScreen() {
  const router = useRouter()

  const requestResetPassword = useRequestResetPassword()

  const [values, setValues] = useState(defaultValueState)
  const [errors, setErrors] = useState(defaultErrorState)
  const [requestSent, setRequestSent] = useState(false)

  useFocusEffect(
    useCallback(() => {
      return () => {
        setValues(defaultValueState)
        setErrors(defaultErrorState)
        setRequestSent(false)
      }
    }, [])
  )

  const handleRequestResetPassword = async () => {
    const [success, errors] = validateInput(requestResetPasswordSchema, values)

    if (!success) {
      setErrors({ ...defaultErrorState, ...errors })
      return
    }

    await requestResetPassword.mutateAsync(values, {
      onSuccess: () => {
        setRequestSent(true)
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          const failMsg = error.response?.data.message
          setErrors({ ...defaultErrorState, failMsg })
          console.error(failMsg, error.status)
        } else {
          setErrors({
            ...defaultErrorState,
            failMsg: 'An unknown error occurred',
          })
          console.error(error)
        }
      },
    })
  }

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (!!errors.email) {
      setErrors(defaultErrorState)
    }
  }

  return (
    <ScreenContainer withGradient>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.content}>
        <HeaderBar title="Forgot Password" onBackPress={() => router.back()} />

        {requestSent ? (
          <>
            <Subheading style={{ textAlign: 'center' }}>
              Reset Password Email Sent
            </Subheading>
            <Button
              title="Return to Login"
              onPress={() => {
                router.push('/login')
              }}
            />
          </>
        ) : (
          <>
            <Subheading style={{ textAlign: 'center' }}>
              Enter your email address below, and we’ll send you a link to reset
              your password.
            </Subheading>

            <LabeledInput
              label="Email"
              placeholder="e.g. johnparker@gmail.com"
              value={values.email}
              error={errors.email}
              onChangeText={(email) => handleInputChange('email', email)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button
              title="Reset Password"
              isProcessing={requestResetPassword.isPending}
              onPress={handleRequestResetPassword}
            />
          </>
        )}
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: pixelSizeVertical(18),
  },

  textContent: {
    alignItems: 'center',
    paddingHorizontal: pixelSizeHorizontal(12),
    gap: pixelSizeVertical(12),
  },
  subheading: {
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
