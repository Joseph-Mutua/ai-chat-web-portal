import { useRef, useState } from 'react'
import {
  Keyboard,
  StyleSheet,
  type TextInput,
  type ViewStyle,
} from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { EventGuestsList } from '@/components/calendar/Event/EventGuestsList'

import { Theme } from '@/constants/Colors'

import { useDebounceInput } from '@/hooks/useDebounceInput'

import { validateEmail } from '@/utils/validators'

import type { UserType } from '@/types'


import { CustomTextInput } from './CustomTextInput'


export type GuestType = {
  email: string
  isOwner?: boolean
  isAdmin?: boolean
  relatedUserId?: string
  firstName?: string
  lastName?: string
  profileImageUrl?: string
  status?: string
}

// Function to extract first & last name from email
export const extractNamesFromEmail = (
  email: string
): { firstName: string; lastName: string } => {
  const [localPart] = email.split('@') // Get the part before @
  const parts = localPart.split('.') // Split by dot

  if (parts.length > 1) {
    // If we have first.last format
    return { firstName: capitalize(parts[0]), lastName: capitalize(parts[1]) }
  }
  return { firstName: capitalize(localPart), lastName: '' } // Otherwise, treat it as a single name
}

// Helper function to capitalize words
const capitalize = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1)

export const AddGuestEmailsField = ({
  currentUser,
  selectedUsers = [],
  setSelectedUsers,
  handleOnMakeAdmin,
  handleRemoveGuest,
  containerStyle,
  backUrl,
  contactDetailsCallback,
}: {
  currentUser?: UserType
  selectedUsers?: any[]
  setSelectedUsers?: (user: GuestType) => void
  handleOnMakeAdmin: (email: string) => void
  handleRemoveGuest: (email: string) => void
  containerStyle?: ViewStyle
  backUrl: string
  contactDetailsCallback?: () => void
}) => {
  const inputRef = useRef<TextInput>(null)
  const [guest, setGuest] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const debouncedInput = useDebounceInput(guest)



  const handleOnGuestSet = () => {
    Keyboard.dismiss()
    const trimmedEmail = guest.trim()

    if (!trimmedEmail) {
      setError('You must provide a guest email.')
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please provide a valid email address.')
      return
    }

    const { firstName, lastName } = extractNamesFromEmail(guest)

    handleSelectUser({
      email: guest,
      firstName,
      lastName,
      profileImageUrl: '',
      relatedUserId: '',
    })
  }

  const handleOnChangeText = (text: string) => {
    setGuest(text)
    setError(null)
  }

  const handleSelectUser = (user: GuestType) => {
    setSelectedUsers?.(user)
    setGuest('')
    inputRef.current?.blur()
  }

  return (
    <ThemedView>
      <ThemedView style={styles.guestsBox}>
        <CustomTextInput
          placeholder="Add People"
          value={guest}
          onChangeText={handleOnChangeText}
          style={styles.textFields}
          inputMode="email"
          onSubmitEditing={handleOnGuestSet}
        />
      </ThemedView>
      <ThemedView
        style={[selectedUsers.length > 0 ? styles.guestViewContainer : {}]}
      >
        <EventGuestsList
          disabled={false}
          containerStyle={containerStyle}
          guests={selectedUsers}
          contactDetailsCallback={contactDetailsCallback}
          onRemoveGuest={(guestEmail) => handleRemoveGuest(guestEmail)}
          backUrl={backUrl}
        />
      </ThemedView>
      {error && (
        <ThemedText type="defaultSemiBold" style={styles.guestError}>
          {error}
        </ThemedText>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  textFields: {
    borderColor: 'transparent',
    marginLeft: -14,
    paddingVertical: 0,
    fontSize: 14,
    lineHeight: 18,
  },
  guestsBox: {},
  guestText: {
    marginVertical: 4,
  },
  guestError: {
    fontSize: 12,
    color: Theme.brand.red,
  },
  addGuest: {
    alignItems: 'center',
    padding: 4,
    width: 22,
    borderRadius: 20,
    backgroundColor: Theme.brand.green,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Theme.brand.lightGrey,
    borderRadius: 5,
  },
  bgGrey: {
    backgroundColor: Theme.brand.lightGrey,
  },
  usersListView: {
    marginTop: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 150,
  },
  guestViewContainer: { marginTop: 12 },
})
