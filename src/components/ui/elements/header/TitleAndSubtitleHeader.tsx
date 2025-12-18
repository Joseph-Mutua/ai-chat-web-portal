import { View } from 'react-native'

import { Typography } from '@/components/ui/elements/typography/Typography'

import { pixelSizeVertical } from '@/utils/responsive'

type Props = {
  title: string
  subtitle?: string
  subtitleTextAlignment?:
    | 'center'
    | 'auto'
    | 'left'
    | 'right'
    | 'justify'
    | undefined
  contentAlignment?: 'flex-start' | 'center' | 'flex-end'
}

export const TitleAndSubtitleHeader = ({
  title,
  subtitle,
  subtitleTextAlignment = 'center',
  contentAlignment = 'center',
}: Props) => (
  <View style={{ alignItems: contentAlignment, gap: pixelSizeVertical(6) }}>
    <Typography variant="h1">{title}</Typography>
    {subtitle ? (
      <Typography
        variant="subheading"
        style={{ textAlign: subtitleTextAlignment }}
      >
        {subtitle}
      </Typography>
    ) : null}
  </View>
)
