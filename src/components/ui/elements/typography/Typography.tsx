import { StyleSheet, Text, TextProps } from 'react-native'

import { Theme } from '@/constants/Colors'

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'subheading'
  | 'body'
  | 'bodyBold'
  | 'label'
  | 'caption'
  | 'link'
  | 'error'
  | 'small'
  | 'medium'

interface TypographyProps extends TextProps {
  variant?: Variant
  children?: React.ReactNode
}

export const Typography = ({
  variant = 'body',
  style,
  children,
  ...rest
}: TypographyProps) => {
  return (
    <Text style={[styles.base, styles[variant], style]} {...rest}>
      {children}
    </Text>
  )
}

export const H1 = (props: TextProps) => <Typography variant="h1" {...props} />

export const H2 = (props: TextProps) => <Typography variant="h2" {...props} />

export const H3 = (props: TextProps) => <Typography variant="h3" {...props} />

export const H4 = (props: TextProps) => <Typography variant="h4" {...props} />

export const H5 = (props: TextProps) => <Typography variant="h5" {...props} />

export const Subheading = (props: TextProps) => (
  <Typography variant="subheading" {...props} />
)

export const Body = (props: TextProps) => (
  <Typography variant="body" {...props} />
)

export const BodyBold = (props: TextProps) => (
  <Typography variant="bodyBold" {...props} />
)

export const Caption = (props: TextProps) => (
  <Typography variant="caption" {...props} />
)

export const Link = (props: TextProps) => (
  <Typography variant="link" {...props} />
)

export const Label = (props: TextProps) => (
  <Typography variant="label" {...props} />
)

export const Error = (props: TextProps) => (
  <Typography variant="error" {...props} />
)

export const Small = (props: TextProps) => (
  <Typography variant="small" {...props} />
)

export const Medium = (props: TextProps) => (
  <Typography variant="medium" {...props} />
)

const styles = StyleSheet.create({
  base: {
    fontFamily: 'inter',
    color: Theme.colors.black,
  },
  h1: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  },
  h2: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
  },
  h3: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
  },
  h4: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
  },
  h5: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  subheading: {
    fontSize: 14.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Theme.colors.label,
  },
  body: {
    fontSize: 14.5,
    lineHeight: 18,
    fontWeight: '400',
  },
  bodyBold: {
    fontSize: 14.5,
    lineHeight: 18,
    fontWeight: '700',
  },
  caption: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '400',
  },
  link: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Theme.colors.primary,
  },
  small: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  medium: {
    fontSize: 14,
    fontWeight: '400',
  },
  error: {
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '400',
    color: Theme.colors.error,
  },
})
