import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

import { Theme } from '@/constants/Colors'

import { ACITIVITY_MODULE_TYPES } from '@/messages/common/sort-filter-options'

import { FilterFieldsType } from '@/types/filters'

type ItemProps = {
  module: FilterFieldsType['activityModuleType']
  icon: keyof typeof Ionicons.glyphMap
}

type ModuleSelectorProps = {
  activityModuleType: FilterFieldsType['activityModuleType']
  onChangeModule: (module: FilterFieldsType['activityModuleType']) => void
}

type ModuleItemProps = ItemProps & ModuleSelectorProps

const ModuleItem = ({
  module,
  icon,
  onChangeModule,
  activityModuleType,
}: ModuleItemProps) => {
  const isActive =
    module && activityModuleType ? activityModuleType.includes(module) : false

  return (
    <TouchableOpacity
      style={styles.filterItem}
      onPress={() => onChangeModule(isActive ? null : module)}
    >
      <ThemedView style={styles.iconText}>
        <ThemedView style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={Theme.brand.black} />
        </ThemedView>
        {module && (
          <ThemedText type="small">
            {module.charAt(0).toUpperCase() + module.slice(1)}
          </ThemedText>
        )}
      </ThemedView>
      <Ionicons
        name={!isActive ? 'eye-off-outline' : 'eye-outline'}
        size={20}
        color={Theme.brand.grey}
        style={styles.eyeIcon}
      />
    </TouchableOpacity>
  )
}

export const ModuleSelector = ({
  activityModuleType,
  onChangeModule,
}: {
  activityModuleType: FilterFieldsType['activityModuleType']
  onChangeModule: (module: FilterFieldsType['activityModuleType']) => void
}) => {
  return (
    <View style={[styles.column, { flex: 1 }]}>
      {ACITIVITY_MODULE_TYPES.map((item: ItemProps, index: number) => (
        <ModuleItem
          key={`module-${index}`}
          module={item.module}
          icon={item.icon}
          onChangeModule={() => onChangeModule(item.module)}
          activityModuleType={activityModuleType}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  column: {},

  iconText: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    marginEnd: 24,
  },
})
