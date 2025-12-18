import { StyleSheet, TouchableOpacity } from 'react-native'

import { SvgComponent } from '@/components/SvgComponent'
import { CreditExpiredViewWrapper } from '@/components/subscription/credits/CreditExpiredViewWrapper'

import { heightPixel, widthPixel } from '@/utils/responsive'

type AttachFileButtonProps = {
  onPress: () => void
  disabled?: boolean
}

export const AttachFileButton = ({
  onPress,
  disabled = false,
}: AttachFileButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.attachButton}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Attach file"
    >
      <CreditExpiredViewWrapper>
        {() => <SvgComponent slug="attach-ai-chat" width={30} height={30} />}
      </CreditExpiredViewWrapper>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  attachButton: {
    width: widthPixel(30),
    height: heightPixel(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
})
