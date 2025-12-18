import { View } from 'react-native'

import { router } from 'expo-router'

import { Button } from '@/components/ui/elements/button/Button'
import { Typography } from '@/components/ui/elements/typography/Typography'

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Typography variant="h1">Hi Developer</Typography>
      <Button
        title="Go to Calendar"
        variant="primary"
        onPress={() => router.push('/calendar')}
      />
    </View>
  )
}
