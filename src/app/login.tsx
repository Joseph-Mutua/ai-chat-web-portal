import { CommonActions } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { useCallback, useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import Constants from 'expo-constants'
import { useFocusEffect, useNavigation, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'

import { SvgComponent } from '@/components/SvgComponent'
import { Button } from '@/components/ui/elements/button/Button'
import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { TextLink } from '@/components/ui/elements/common/TextLink'
import { DividerWithText } from '@/components/ui/elements/divider/DividerWithText'
import { TitleAndSubtitleHeader } from '@/components/ui/elements/header/TitleAndSubtitleHeader'
import {
  Error as ErrorText,
  Typography,
} from '@/components/ui/elements/typography/Typography'
import { CheckboxWithLabel } from '@/components/ui/form/CheckboxWithLabel'
import { LabeledInput } from '@/components/ui/form/LabeledInput'
import { ScreenContainer } from '@/components/ui/layout/ScreenContainer'

import { Theme } from '@/constants/Colors'

import { useLogin, useSocialSignIn } from '@/hooks/api'

import { validateInput } from '@/utils/helpers'
import { heightPixel, pixelSizeVertical, widthPixel } from '@/utils/responsive'
import {
  rememberedEmailStorage,
  setIsRegistrationInStorage,
  setMarketingPopupShown,
  setTokenInStorage,
} from '@/utils/storage'

import { loginSchema } from '@/schemas/auth'
import { reportError } from '@/services/bugsnag'

const defaultValueState = {
  email: '',
  password: '',
}
const defaultErrorState: {
  email: string | null
  password: string | null
  loginFailMsg: string | null
} = {
  email: null,
  password: null,
  loginFailMsg: null,
}

export default function LoginScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  const queryClient = useQueryClient()

  const login = useLogin()
  const socialSignIn = useSocialSignIn()

  const [values, setValues] = useState(defaultValueState)
  const [errors, setErrors] = useState(defaultErrorState)

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const email = await rememberedEmailStorage.get()
      setRememberMe(!!email)
      if (email) handleInputChange('email', email)
    }
    loadSavedCredentials()
  }, [])

  useFocusEffect(
    useCallback(() => {
      let timeout: ReturnType<typeof setTimeout>
      const checkMarketingPopup = async () => {
        timeout = setTimeout(() => {
          setShowModal(true)
          setMarketingPopupShown(true)
        }, 1500)
      }
      checkMarketingPopup()
      return () => {
        if (timeout) clearTimeout(timeout)
      }
    }, [])
  )

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (!!errors.email || !!errors.password || !!errors.loginFailMsg) {
      setErrors(defaultErrorState)
    }
  }

  const redirectToHome = () => {
    try {
      navigation.dispatch(
        CommonActions.reset({
          routes: [{ name: '(app)' }],
        })
      )
    } catch (e) {
      router.replace('/(app)/(drawer)/(tabs)')
    }
  }

  const handleLogin = async () => {
    const [success, errors] = validateInput(loginSchema, values)
    if (!success) {
      setErrors({ ...defaultErrorState, ...errors })
      return
    }
    await login.mutateAsync(values, {
      onSuccess: async () => {
        await rememberedEmailStorage.set(values.email)
        redirectToHome()
      },
      // API must return correct errors with messages
      onError: (error: unknown) => {
        if (isAxiosError(error)) {
          const loginFailMsg = error.response?.data.message
          setErrors({
            ...defaultErrorState,
            loginFailMsg,
            ...((error.response?.status === 400 ||
              error.response?.status === 404) && {
              loginFailMsg: 'Email or password is incorrect.',
            }),
          })
          console.error(loginFailMsg, error.response?.status)
        } else {
          setErrors({
            ...defaultErrorState,
            loginFailMsg: 'An unknown error occurred',
          })
          console.error(error)
        }
      },
    })
  }

  const handleSocialsLogin = async (type: 'google' | 'apple' | 'facebook') => {
    try {
      const { authUrl } = await socialSignIn.mutateAsync(type)
      if (authUrl) {
        const redirectUrl = Constants.expoConfig?.scheme
        const data: any = await WebBrowser.openAuthSessionAsync(
          authUrl,
          (redirectUrl ?? 'exp+warp-speed-ai-app') as string,
          {
            showInRecents: false,
          }
        )
        if (data?.error && data?.type !== 'cancel') {
          console.error(data?.error)
        } else if (data?.type == 'success' && data?.url) {
          const urlObj = new URL(data?.url)
          const params = new URLSearchParams(urlObj.search)
          const accessToken = params.get('accessToken')
          if (accessToken) {
            await setTokenInStorage(accessToken.split('#_=_')[0])
          }
          const isRegistration = params.get('isRegistration')
          if (isRegistration && isRegistration == 'true') {
            await setIsRegistrationInStorage(isRegistration.toString())
          }
          queryClient.clear()
          setTimeout(() => {
            redirectToHome()
          }, 1000)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <ScreenContainer withGradient withScroll>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.brand.white} />
      <View style={styles.container}>
        <View>
          <View style={styles.headerWrapper}>
            <TitleAndSubtitleHeader
              title="warpSpeed"
              subtitle={
                'AI Powered Calendar, Email, Tasks,\nMessenger & Notes—All in One Place'
              }
            />
          </View>

          {/* Inputs */}
          <View>
            <View style={styles.fieldGroup}>
              <LabeledInput
                label="Email"
                value={values.email}
                error={errors.email}
                hasError={!!errors.loginFailMsg}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <LabeledInput
                label="Password"
                value={values.password}
                hasError={!!errors.loginFailMsg}
                error={errors.password}
                onChangeText={(password) =>
                  handleInputChange('password', password)
                }
                secureTextEntry={!showPassword}
                rightIcon={
                  <PressableOpacity
                    onPress={() => setShowPassword((password) => !password)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={24}
                      color={Theme.brand.grey}
                    />
                  </PressableOpacity>
                }
              />
              {errors.loginFailMsg && (
                <ErrorText>{errors.loginFailMsg}</ErrorText>
              )}
              <View style={styles.loginActions}>
                <CheckboxWithLabel
                  checked={rememberMe}
                  label="Remember Me"
                  onPress={async () => {
                    if (rememberMe) {
                      await rememberedEmailStorage.delete()
                      setRememberMe(false)
                    }
                    setRememberMe(!rememberMe)
                  }}
                />
                <TextLink text="Forgot Password?" to="/forgot-password" />
              </View>
            </View>

            <Button
              title="Login"
              isProcessing={login.isPending}
              onPress={handleLogin}
            />

            <DividerWithText />

            {/* Social Buttons */}
            <Button
              variant="outline"
              title="Continue with Google"
              onPress={() => handleSocialsLogin('google')}
              icon={
                <SvgComponent
                  slug="google-logo"
                  width={widthPixel(18)}
                  height={heightPixel(18)}
                />
              }
            />
            <Button
              variant="outline"
              title="Continue with Apple"
              onPress={() => handleSocialsLogin('apple')}
              icon={
                <SvgComponent
                  slug="apple-logo"
                  width={widthPixel(18)}
                  height={heightPixel(18)}
                />
              }
            />
          </View>
        </View>

        <View style={styles.footerRow}>
          <Typography variant="label">Don't have an account? </Typography>
          <TextLink text="Sign Up" to="/register/one" underline />
        </View>
      </View>

    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerWrapper: {
    marginVertical: pixelSizeVertical(42),
  },
  fieldGroup: {
    gap: pixelSizeVertical(14),
  },
  loginActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: pixelSizeVertical(4),
    marginBottom: pixelSizeVertical(16),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
