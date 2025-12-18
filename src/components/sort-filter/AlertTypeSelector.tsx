import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import { ACITIVITY_ALERT_TYPES } from '@/messages/common/sort-filter-options'

import { FilterFieldsType } from '@/types/filters'

import { Checkbox } from '../Checkbox'

type AlertTypeSelectorProps = {
  alertType: FilterFieldsType['alertType'] | null
  onChangeAlertType: (module: FilterFieldsType['alertType']) => void
}

type AlertTypeItemProps = {
  alertTypeName: FilterFieldsType['alertType'] | null
} & AlertTypeSelectorProps

const AlertTypeItem = ({
  alertType,
  alertTypeName,
  onChangeAlertType,
}: AlertTypeItemProps) => {
  return (
    <TouchableOpacity
      style={styles.filterItem}
      onPress={() => onChangeAlertType(alertTypeName)}
    >
      <ThemedView style={styles.iconContainer}>
        <Checkbox
          dimensions={styles.checkboxDimensions}
          checked={alertType === alertTypeName}
          customCheckedStyles={{
            backgroundColor: Theme.brand.green,
          }}
        />
      </ThemedView>
      {alertTypeName && (
        <ThemedText type="small">
          {alertTypeName.charAt(0).toUpperCase() + alertTypeName.slice(1)}
        </ThemedText>
      )}
    </TouchableOpacity>
  )
}

export const AlertTypeSelector = ({
  alertType,
  onChangeAlertType,
}: AlertTypeSelectorProps) => {
  return (
    <View style={[styles.column, { flex: 0.75 }]}>
      {ACITIVITY_ALERT_TYPES.map(
        (item: FilterFieldsType['alertType'], index: number) => (
          <AlertTypeItem
            key={`alert-${index}`}
            onChangeAlertType={onChangeAlertType}
            alertType={alertType}
            alertTypeName={item}
          />
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  column: {},
  checkboxDimensions: {
    width: 16,
    height: 16,
  },
  iconText: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
})
