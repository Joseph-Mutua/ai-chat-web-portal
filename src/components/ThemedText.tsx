import { StyleSheet, Text, type TextProps } from 'react-native'

import { Theme } from '@/constants/Colors'

import { useThemeColor } from '@/hooks/useThemeColor'

import { fontPixel } from '@/utils/responsive'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'defaultLight'
    | 'subtitle'
    | 'link'
    | 'small'
    | 'header'
    | 'error'
  isSelectable?: boolean
  searchWord?: string // New prop for highlighting
}

const highlightText = (text: string, searchWord: string) => {
  if (!searchWord?.trim()) return text // Return original text if search is empty

  const regex = new RegExp(`(${searchWord})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <Text key={index.toString()} style={styles.highlight}>
        {part}
      </Text>
    ) : (
      part
    )
  )
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  isSelectable = false,
  searchWord = '',
  children,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  /* Called when the user taps in a item of the selection menu:
    - eventType: (string) is the label in menu items
    - content: (string) the selected text portion
    - selectionStart: (int) is the start position of the selected text
    - selectionEnd: (int) is the end position of the selected text
   */
  // const handleSelection = async ({
  //   eventType,
  //   content,
  // }: {
  //   eventType: string;
  //   content: string;
  // }) => {
  //   if (eventType === "wS Tools") {
  //     WSToolsRef?.current?.show({
  //       title: content,
  //       menuItems: [],
  //     });
  //   } else if (eventType === "Copy") {
  //     await Clipboard.setStringAsync(content);
  //   }
  // };

  // Apply highlighting if `searchWord` is provided
  const formattedText =
    typeof children === 'string'
      ? highlightText(children, searchWord)
      : children

  const textElement = (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'defaultLight' ? styles.defaultLight : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'header' ? styles.header : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'error' ? styles.error : undefined,
        style,
      ]}
      {...rest}
    >
      {formattedText}
    </Text>
  )

  // if (isSelectable) {
  //   return (
  //     <SelectableText
  //       menuItems={["wS Tools", "Copy"]}
  //       textComponentProps={{
  //         children: textElement,
  //       }}
  //       onSelection={handleSelection}
  //       value=""
  //       prependToChild={undefined}
  //     />
  //   );
  // }

  return textElement
}

const styles = StyleSheet.create({
  default: {
    fontSize: fontPixel(16),
    lineHeight: fontPixel(24),
  },
  defaultSemiBold: {
    fontSize: fontPixel(16),
    lineHeight: fontPixel(24),
    fontWeight: '600',
  },
  defaultLight: {
    fontSize: fontPixel(16),
    lineHeight: fontPixel(24),
    color: Theme.brand.grey,
  },
  small: {
    fontSize: fontPixel(12.5),
    lineHeight: fontPixel(16),
    fontWeight: 'light',
  },
  title: {
    fontSize: fontPixel(32),
    fontWeight: 'bold',
    lineHeight: fontPixel(40),
  },
  subtitle: {
    fontSize: fontPixel(20),
    fontWeight: 'bold',
  },
  link: {
    lineHeight: fontPixel(30),
    fontSize: fontPixel(16),
    color: '#0a7ea4',
  },
  header: {
    fontSize: fontPixel(24),
    fontWeight: 'bold',
  },
  highlight: {
    backgroundColor: Theme.brand.purple02,
    // fontWeight: "bold",
  },
  error: {
    fontSize: fontPixel(12.5),
    lineHeight: fontPixel(16),
    fontWeight: '500',
    color: Theme.brand.red,
  },
})
