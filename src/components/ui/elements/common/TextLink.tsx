import { Linking } from 'react-native'

import { Href, Link } from 'expo-router'

import { PressableOpacity } from '@/components/ui/elements/common/PressableOpacity'
import { Typography } from '@/components/ui/elements/typography/Typography'

interface Props {
  text: string
  onPress?: () => void
  href?: string
  to?: Href
  disabled?: boolean
  underline?: boolean
}

export const TextLink = ({
  text,
  onPress,
  href,
  to,
  disabled = false,
  underline = false,
}: Props) => {
  // Internal Expo Routes
  if (to) {
    return (
      <Link href={to} asChild>
        <PressableOpacity disabled={disabled}>
          <Typography
            variant="link"
            style={{ textDecorationLine: underline ? 'underline' : 'none' }}
          >
            {text}
          </Typography>
        </PressableOpacity>
      </Link>
    )
  }

  // External Links / On Press
  const handlePress = async () => {
    if (disabled) return

    onPress?.()

    if (href) {
      try {
        await Linking.openURL(href)
      } catch (err) {
        console.warn('Failed to open URL:', href, err)
      }
    }
  }

  return (
    <PressableOpacity onPress={handlePress} disabled={disabled}>
      <Typography
        variant="link"
        style={{ textDecorationLine: underline ? 'underline' : 'none' }}
      >
        {text}
      </Typography>
    </PressableOpacity>
  )
}
