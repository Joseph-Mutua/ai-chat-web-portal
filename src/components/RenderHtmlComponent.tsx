import React from 'react'
import { useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'

export const RenderHtmlComponent = ({
  content,
  textColour,
  styles,
  ellipsMode,
  numLines = 0,
  allowFontScaling,
}: {
  content: string
  textColour: string
  styles?: any
  ellipsMode?: boolean
  numLines?: number
  allowFontScaling?: boolean
}) => {
  const { width } = useWindowDimensions()

  const tagsStyles = React.useMemo(
    () => ({
      b: { fontWeight: 'bold' as 'bold' },
      i: { fontStyle: 'italic' as 'italic' },
      u: { textDecorationLine: 'underline' as 'underline' },
      p: { color: textColour },
      a: {
        color: 'blue',
        textDecorationLine: 'underline' as
          | 'none'
          | 'underline'
          | 'line-through'
          | 'underline line-through'
          | undefined,
      },
    }),
    [textColour]
  )

  return (
    <RenderHtml
      contentWidth={width}
      source={{ html: content }}
      tagsStyles={tagsStyles}
      ignoredDomTags={['noreply@icloud.com']}
      defaultTextProps={{
        ...(ellipsMode && {
          numberOfLines: numLines || 1,
          ellipsizeMode: 'tail',
          allowFontScaling: allowFontScaling,
        }),
        style: [styles],
      }}
    />
  )
}
