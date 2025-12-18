import { useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import DatePicker from 'react-native-date-picker'

import { format } from 'date-fns'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { ErrorText } from '@/components/input/ErrorText'

import { Theme } from '@/constants/Colors'

import { toValidDate } from '@/utils/time'

export function CustomEventDatePicker({
  title,
  value,
  error,
  textType,
  theme = 'auto',
  mode = 'date',
  customStyles,
  minimumDate,
  maximumDate,
  zone,
  renderCustomComponent,
  onChange,
}: {
  textType?:
    | 'title'
    | 'small'
    | 'default'
    | 'link'
    | 'header'
    | 'defaultSemiBold'
    | 'defaultLight'
    | 'subtitle'
  title?: string
  value: Date | string | null
  error?: string | null
  theme?: 'auto' | 'light' | 'dark'
  mode?: 'date' | 'time' | 'datetime'
  customStyles?: object
  customTextStyle?: object
  minimumDate?: Date
  maximumDate?: Date
  zone?: string
  renderCustomComponent?: () => React.ReactElement
  onChange: (value: Date) => void
}) {
  const [open, setOpen] = useState(false)
  const isDateTimeMode = mode === 'datetime'
  const safeDate = toValidDate(value)

  return (
    <ThemedView>
      <Pressable onPress={() => setOpen(true)}>
        {!renderCustomComponent ? (
          <ThemedView
            style={[
              styles.inputContainer,
              error ? styles.inputContainerError : {},
              customStyles,
            ]}
          >
            {isDateTimeMode ? (
              <ThemedView style={styles.dateTimeMode}>
                <ThemedText type={textType}>
                  {format(safeDate, 'do MMMM yyyy')}
                </ThemedText>
                <ThemedText type={textType}>
                  {format(safeDate, 'h:mm a')}
                </ThemedText>
              </ThemedView>
            ) : (
              <ThemedView style={{ alignItems: 'flex-end' }}>
                <ThemedText
                  type={textType}
                  style={!value && styles.placeholderText}
                >
                  {format(
                    safeDate,
                    mode === 'date' ? 'do MMMM yyyy' : 'h:mm a'
                  )}
                </ThemedText>
                {mode === 'time' && zone && (
                  <ThemedText type="small" style={styles.zoneText}>
                    {zone}
                  </ThemedText>
                )}
              </ThemedView>
            )}
          </ThemedView>
        ) : (
          renderCustomComponent()
        )}
      </Pressable>

      {error && <ErrorText error={error} />}

      <DatePicker
        modal
        title={title}
        open={open}
        date={safeDate}
        mode={mode}
        onConfirm={(date) => {
          setOpen(false)
          onChange(date)
        }}
        theme={theme}
        onCancel={() => setOpen(false)}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  dateTimeMode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputContainerError: {
    borderColor: Theme.brand.red,
  },
  placeholderText: {
    color: Theme.brand.grey,
  },
  zoneText: {
    color: Theme.brand.purple[500],
    marginTop: 2,
  },
})
