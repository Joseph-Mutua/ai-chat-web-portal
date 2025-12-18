import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useCallback, useEffect } from 'react'

import { useFocusEffect, useNavigation } from 'expo-router'

import { EMAILS_FILTER_OPTIONS } from '@/messages/common/sort-filter-options'

import { getFilterConfig } from '@/utils/sort-filter'

import { ModulesType } from '@/types'
import { FilterConfig, FilterFieldsType } from '@/types/filters'

const defaultValues: FilterFieldsType = {
  senders: [],
  recipients: [],
  hasWords: [],
  doesNotHave: [],
  hasAttachment: false,
  sortBy: null,
  sortTask: null,
  orderBy: null,
  tags: [],
  startDate: null,
  endDate: null,
  activityModuleType: 'calendar,chat,email,note,task',
  alertType: null,
  assignees: [],
  dueDate: null,
  dateRange: { startDate: null, endDate: null },
  attendees: [],
  emailStatus: 'All',
}

const defaultFilterConfig: FilterConfig = {
  filterOptions: EMAILS_FILTER_OPTIONS,
  moduleName: 'emails',
}

const useSortFilterManager = (
  moduleName?: ModulesType,
  defaultFilters?: Partial<FilterFieldsType>,
  accountId?: string
) => {
  const queryClient = useQueryClient()

  const isScreenFocused = useNavigation().isFocused()

  const { data: filters } = useQuery({
    queryKey: ['filterManager'],
    queryFn: () => defaultValues,
    initialData: (queryClient.getQueryData(['filterManager']) ||
      defaultValues) as FilterFieldsType,
    staleTime: Infinity,
  })

  const { data: filterConfig } = useQuery({
    queryKey: ['filterConfig'],
    queryFn: () => defaultFilterConfig,
    initialData: (queryClient.getQueryData(['filterConfig']) ||
      defaultFilterConfig) as FilterConfig,
    staleTime: Infinity,
  })

  // Reset filter values when moduleName changes or screen is focused again
  useFocusEffect(
    useCallback(() => {
      if (moduleName && moduleName != filterConfig.moduleName) {
        resetConfig()
      }
    }, [moduleName, filterConfig, accountId, defaultFilters])
  )

  // Reset filter values when screen is focused initially
  useEffect(() => {
    if (moduleName && isScreenFocused) {
      resetConfig()
    }
  }, [moduleName, accountId, defaultFilters])

  const resetConfig = () => {
    if (moduleName) {
      const config = getFilterConfig(moduleName, accountId)
      queryClient.setQueryData(['filterConfig'], config)
      queryClient.setQueryData(['filterManager'], {
        ...defaultValues,
        ...defaultFilters,
      })
    }
  }

  const setFilterValues = useMutation({
    mutationFn: (values: FilterFieldsType) => {
      return new Promise<void>((resolve) => {
        queryClient.setQueryData(['filterManager'], values)
        resolve()
      })
    },
  })

  const resetFilter = useMutation({
    mutationFn: () => {
      return new Promise<void>((resolve) => {
        queryClient.setQueryData(['filterManager'], defaultValues)
        resolve()
      })
    },
  })

  return {
    filters,
    filterConfig,
    setFilterValues: setFilterValues.mutate,
    resetFilter: resetFilter.mutate,
  }
}

export default useSortFilterManager
