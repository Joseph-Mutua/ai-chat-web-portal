import type { AxiosError } from 'axios'

import { StatusBar, StyleSheet, View } from 'react-native'

import { Redirect, type RelativePathString } from 'expo-router'

import { SvgComponent } from '@/components/SvgComponent'
import { ErrorContainer } from '@/components/page/ErrorContainer'
import { LoadingContainer } from '@/components/page/LoadingContainer'
import { Button } from '@/components/ui/elements/button/Button'
import {
  H2,
  Subheading,
  Typography,
} from '@/components/ui/elements/typography/Typography'
import { ScreenContainer } from '@/components/ui/layout/ScreenContainer'

import { useResendVerifyEmail, useUser } from '@/hooks/api'
import { useNotifications } from '@/hooks/context'

import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@/utils/responsive'

export default function VerifyScreen() {
  const user = useUser()
  const resendVerifyEmail = useResendVerifyEmail()
  const { pushNotification } = useNotifications()

  const handleCheckVerificationStatus = () => {
    user.refetch()
  }

  const handleResendVerificationEmail = async () => {
    await resendVerifyEmail.mutateAsync(
      {},
      {
        onSuccess: (data) => {
          let message = 'Email Sent'
          if (typeof data === 'string') {
            message = data
          }
          pushNotification({ title: message }, 3500)
        },
        onError: (error: unknown) => {
          const err = error as AxiosError<{ message: string }>
          pushNotification(
            {
              title:
                err.response?.data?.message ||
                'Failed to resend verification email',
            },
            3500
          )
        },
      }
    )
  }

  const transformEmail = (email: string) => {
    if (!email || !email.includes('@')) return email

    const parts = email.split('@')
    // Cases with multiple @ or other malformed emails
    if (parts.length !== 2) return email

    const local = parts[0]
    const domain = parts[parts.length - 1]

    if (!local || !domain) return email

    const visible = Math.min(4, local.length)
    const hiddenCount = local.length - visible
    const masked =
      local.slice(0, visible) + '*'.repeat(Math.max(0, hiddenCount))

    return `${masked}@${domain}`
  }

  if (user.isLoading) {
    return <LoadingContainer />
  }

  if (user.isError && (user.error as AxiosError).status !== 401) {
    return (
      <ErrorContainer
        handleRetry={() => {
          user.refetch()
        }}
      />
    )
  }

  if (!user.data) {
    return <Redirect href="/login" />
  }

  if (user?.data?.emailVerified) {
    return <Redirect href={'/calendar' as RelativePathString} />
  }

  const secretEmail = transformEmail(user.data.email)
  return (
    <ScreenContainer withGradient>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.content}>
        <View style={styles.image}>
          <SvgComponent
            slug="message-sent"
            width={widthPixel(92)}
            height={heightPixel(92)}
          />
        </View>
        <View style={styles.textContent}>
          <H2>Verify Your Email</H2>
          <Subheading style={styles.subheading}>
            We have sent a confirmation email to {secretEmail}
          </Subheading>
        </View>
        <Button
          variant="link"
          title="Resend Email"
          isProcessing={resendVerifyEmail.isPending}
          onPress={handleResendVerificationEmail}
        />
        <Button
          title="Check Verification Status"
          isProcessing={user.isRefetching}
          onPress={handleCheckVerificationStatus}
        />
      </View>

      <View style={styles.footerRow}>
        <Typography variant="label">
          Didn’t get the email? Check your spam folder
        </Typography>
      </View>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: pixelSizeVertical(18),
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: pixelSizeVertical(12),
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
