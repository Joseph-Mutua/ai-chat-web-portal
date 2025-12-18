import { Pressable, PressableProps, ViewProps } from 'react-native'

export const PressableOpacity = ({ ...props }: PressableProps & ViewProps) => {
  return (
    <Pressable
      style={({ pressed }) => [props.style, pressed ? { opacity: 0.6 } : {}]}
      {...props}
    />
  )
}
