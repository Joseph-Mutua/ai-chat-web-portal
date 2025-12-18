import { isAxiosError } from 'axios'

import { useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { Link, useNavigation, useRouter } from 'expo-router'

import { Button } from '@/components/ui/elements/button/Button'
import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { TextLink } from '@/components/ui/elements/common/TextLink'
import { TitleAndSubtitleHeader } from '@/components/ui/elements/header/TitleAndSubtitleHeader'
import {
  Small,
  Typography,
} from '@/components/ui/elements/typography/Typography'
import { CheckboxWithLabel } from '@/components/ui/form/CheckboxWithLabel'
import { LabeledInput } from '@/components/ui/form/LabeledInput'
import { ScreenContainer } from '@/components/ui/layout/ScreenContainer'

import { Theme } from '@/constants/Colors'

import { useRegister } from '@/hooks/api'

import { validateInput } from '@/utils/helpers'
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from '@/utils/responsive'
import { getPasswordStrength } from '@/utils/validators'

import { registerOneSchema } from '@/schemas/auth'

const screenHeight = Dimensions.get('screen').height

const strengthColors = [
  Theme.brand.redSalsa,
  Theme.brand.amber,
  Theme.brand.sunflowerYellow,
  Theme.brand.mediumGreen,
] // Weak, Better, Medium, Strong

const defaultValueState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const defaultErrorState: {
  firstName: string | null
  lastName: string | null
  email: string | null
  password: string | null
  confirmPassword: string | null
  registerFailMsg: string | null
} = {
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  confirmPassword: null,
  registerFailMsg: null,
}

export default function RegisterOneScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  const register = useRegister()

  const [values, setValues] = useState(defaultValueState)
  const [errors, setErrors] = useState(defaultErrorState)

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true)
  const [secureTextEntryForConfirm, setSecureTextEntryForConfirm] =
    useState<boolean>(true)
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [confirmation, setConfirmation] = useState<Record<string, boolean>>({
    ageConfirmation: false,
    termsConfirmation: false,
  })

  const redirectToHome = () => {
    router.replace('/(app)/(drawer)/(tabs)')
  }

  const handleRegisterOne = async () => {
    const newValues = {
      ...values,
      confirmPassword: values.password,
    }

    const [success, errors] = validateInput(registerOneSchema, newValues)

    if (!success) {
      setErrors({ ...defaultErrorState, ...errors })
      return
    }

    if (values.confirmPassword.length <= 0) {
      return setErrors({
        ...defaultErrorState,
        ...errors,
        confirmPassword: 'Confirm password is required',
      })
    }

    if (values.password !== values.confirmPassword) {
      return setErrors({
        ...defaultErrorState,
        ...errors,
        confirmPassword: 'Passwords do not match',
      })
    }

    await register.mutateAsync(newValues, {
      onSuccess: () => {
        redirectToHome()
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          const registerFailMsg = error.response?.data.message
          setErrors({ ...defaultErrorState, registerFailMsg })
          console.error(registerFailMsg, error.status)
        } else {
          setErrors({
            ...defaultErrorState,
            registerFailMsg: 'An unknown error occurred',
          })
          console.error(error)
        }
      },
    })
  }

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (
      !!errors.firstName ||
      !!errors.lastName ||
      !!errors.email ||
      !!errors.password
    ) {
      setErrors(defaultErrorState)
    }
  }

  const handlePasswordChange = (value: string) => {
    handleInputChange('password', value)
    setPasswordStrength(getPasswordStrength(value))
  }

  const handleConfirmation = (slug: string) => {
    setConfirmation((previousValues) => ({
      ...previousValues,
      [slug]: !previousValues[slug],
    }))
  }

  return (
    <ScreenContainer withGradient withScroll>
      <View style={styles.container}>
        <View>
          <View style={styles.headerWrapper}>
            <TitleAndSubtitleHeader
              title="Welcome!"
              subtitle="Let's get started & maximise your productivity."
              contentAlignment="flex-start"
              subtitleTextAlignment="left"
            />
          </View>

          <View style={styles.fieldGroup}>
            <LabeledInput
              label="First Name"
              placeholder="e.g. John"
              value={values.firstName}
              error={errors.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              keyboardType="default"
              autoCapitalize="words"
            />

            <LabeledInput
              label="Last Name"
              placeholder="e.g. Parker"
              value={values.lastName}
              error={errors.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              keyboardType="default"
              autoCapitalize="words"
            />

            <LabeledInput
              label="Email"
              placeholder="e.g. johnparker@gmail.com"
              value={values.email}
              error={errors.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <LabeledInput
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              error={errors.password}
              onChangeText={handlePasswordChange}
              secureTextEntry={secureTextEntry}
              rightIcon={
                <PressableOpacity
                  onPress={() => setSecureTextEntry((password) => !password)}
                >
                  <Ionicons
                    name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color={Theme.brand.grey}
                  />
                </PressableOpacity>
              }
            />

            <LabeledInput
              label="Confirm Password"
              placeholder="Enter your password"
              editable={values.password.length > 0}
              value={values.confirmPassword}
              error={errors.confirmPassword}
              onChangeText={(value) => {
                const isMatch =
                  values.password.length > 0 && value === values.password
                setErrors({
                  ...defaultErrorState,
                  confirmPassword: isMatch ? null : 'Passwords do not match',
                })
                handleInputChange('confirmPassword', value)
              }}
              secureTextEntry={secureTextEntryForConfirm}
              rightIcon={
                <PressableOpacity
                  onPress={() =>
                    setSecureTextEntryForConfirm((password) => !password)
                  }
                >
                  <Ionicons
                    name={
                      secureTextEntryForConfirm
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={24}
                    color={Theme.brand.grey}
                  />
                </PressableOpacity>
              }
            />
            {/* Password Strength */}
            {values.password?.length && (
              <View style={styles.passwordStrengthBox}>
                <Typography variant="subheading">Password strength</Typography>
                <View style={styles.strengthView}>
                  {Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.passwordStrengthBar,
                          {
                            backgroundColor:
                              values?.password.length > 0 &&
                                index <= passwordStrength
                                ? strengthColors[passwordStrength]
                                : Theme.brand.flashWhite,
                          },
                        ]}
                      />
                    ))}
                </View>
                <Small>
                  Create a strong password to keep your account secure. Use a
                  mix of letters, numbers, and symbols, and aim for at least 12
                  characters.
                </Small>
              </View>
            )}
          </View>

          {/* Accept Terms and Privacy */}
          <View style={styles.termsAndPrivacy}>
            <CheckboxWithLabel
              checked={confirmation.ageConfirmation}
              label="I confirm that I am over 16 years old."
              onPress={() => handleConfirmation('ageConfirmation')}
            />
            <CheckboxWithLabel
              checked={confirmation.termsConfirmation}
              onPress={() => handleConfirmation('termsConfirmation')}
              renderLabel={(checked) => (
                <Typography variant="caption">
                  {'I agree to the '}
                  <Link
                    href="https://iamwarpspeed.com/en-gb/terms"
                    style={styles.link}
                  >
                    Terms and Conditions
                  </Link>
                  {' and '}
                  <Link
                    href="https://iamwarpspeed.com/en-gb/privacy"
                    style={styles.link}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              )}
            />
          </View>

          {/* Errors */}
          {errors.registerFailMsg && (
            <View>
              <Typography variant="error">{errors.registerFailMsg}</Typography>
            </View>
          )}

          <Button
            title="Sign Up"
            isProcessing={register.isPending}
            disabled={
              register.isPending ||
              !values.firstName ||
              !values.lastName ||
              !values.email ||
              !values.password ||
              !values.confirmPassword ||
              !confirmation.ageConfirmation ||
              !confirmation.termsConfirmation
            }
            onPress={handleRegisterOne}
          />
        </View>

        <View style={styles.footerRow}>
          <Typography variant="label">Already have an account? </Typography>
          <TextLink text="Login" onPress={() => router.back()} underline />
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
  fieldGroup: {
    gap: pixelSizeVertical(14),
  },
  headerWrapper: {
    marginVertical: pixelSizeVertical(18),
  },
  passwordStrengthBar: {
    flex: 1,
    height: heightPixel(4),
    borderRadius: pixelSizeHorizontal(6),
    overflow: 'hidden',
  },
  passwordStrengthBox: {
    gap: pixelSizeVertical(6),
  },
  termsAndPrivacy: {
    marginVertical: pixelSizeVertical(18),
    gap: pixelSizeVertical(12),
    maxWidth: '96%',
  },
  link: {
    color: Theme.brand.green,
    textDecorationLine: 'underline',
    fontWeight: 500,
  },
  passwordStrength: {
    fontSize: fontPixel(14),
  },
  strengthView: {
    flexDirection: 'row',
    gap: pixelSizeHorizontal(8),
  },
  buttonWrapper: {
    marginBottom: screenHeight + 60 - screenHeight,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
