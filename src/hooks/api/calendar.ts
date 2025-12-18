import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash'

import { getEventFilterDatesParams } from '@/utils/calendar'

import { CalendarEventsRequestType } from '@/types/calendar'

import { queries } from '@/queries'
import {
  calendarInviteRespond,
  createCalendarEvent,
  deleteCalendarEvent,
  generateEventDescription,
  generateSmartSuggestion,
  getCalendarEventByAttendeeEmail,
  getCalendars,
  updateCalendar,
  updateCalendarEvent,
} from '@/services/api/calendar'


export function useCalendarsQuery(hasCalendarEvent: boolean = true) {
  return useQuery({
    ...queries.calendar.list(),
    enabled: hasCalendarEvent,
  })
}

export function useCalendarAccountsMutation() {
  const response = useMutation({
    mutationFn: getCalendars,
    mutationKey: ['calendar-accounts'],
  })
  return response
}

export function useCalendarEventsQuery(params: CalendarEventsRequestType) {
  return useQuery({
    ...queries.calendar.listCalendarEvents(params),
  })
}

export function useCalendarEventDetailsQuery(calendarEventId: string) {
  return useQuery({
    ...queries.calendar.listCalendarEventDetails(calendarEventId),
    enabled: !!calendarEventId,
  })
}

export function useCreateCalendarEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCalendarEvent,
    mutationKey: ['calendar-event-creation'],
    onSuccess(data, variables, context) {
      const params = getEventFilterDatesParams(
        {
          filter: {
            startDate: variables.startDateTime,
            endDate: variables.endDateTime,
          },
        },
        variables.startDateTime.split('T')[0]
      )

      queryClient.invalidateQueries({
        queryKey: queries.calendar.listCalendarEvents(params).queryKey,
      })
    },
  })
}

export function useUpdateCalendarMutation({
  isSharedCalendar = false,
  calendarSharingId,
}: {
  isSharedCalendar?: boolean
  calendarSharingId?: string
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCalendar,
    mutationKey: ['calendars-list'],
    onSuccess: async () => {
      const invalidateCalendarQueries = debounce(() => {
        queryClient.invalidateQueries({
          queryKey: queries.calendar.list().queryKey,
        })
      }, 500)
      invalidateCalendarQueries()
    },
  })
}

export function useUpdateCalendarEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCalendarEvent,
    mutationKey: ['calendar-event-update'],
    onSuccess(data, variables) {
      const params = getEventFilterDatesParams(
        {
          filter: {
            startDate: variables.parameters.startDateTime,
            endDate: variables.parameters.endDateTime,
          },
        },
        variables.parameters.startDateTime.split('T')[0]
      )

      queryClient.invalidateQueries({
        queryKey: queries.calendar.listCalendarEvents(params).queryKey,
      })

      queryClient.setQueryData(
        queries.calendar.listCalendarEventDetails(data.id).queryKey,
        () => data
      )
    },
  })
}

export function useCalenderInviteResponseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: calendarInviteRespond,
    mutationKey: ['calendar-invite-respond'],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: queries.calendar.listCalendarEventDetails(
          variables.calenderEventId
        ).queryKey,
      })
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey.includes('calendar-events'),
      })
    },
  })
}

export function useDeleteCalendarEventMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCalendarEvent,
    mutationKey: ['calendar-event-delete'],
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey.includes('calendar-events'),
      })
    },
  })
}

export function useCreateCalendarEventAndRefetchMutation() {
  return useMutation({
    mutationFn: createCalendarEvent,
    mutationKey: ['calendar-event-creation'],
  })
}
export function useGetCalendarEventByAttendeeEmail(
  params: CalendarEventsRequestType
) {
  return useQuery({
    queryKey: ['calendar-event-by-attendee-email'],
    queryFn: () => getCalendarEventByAttendeeEmail(params),
  })
}

export function useCalendarInsightsQuery() {
  return useQuery({
    ...queries.calendar.listCalendarInsights(),
  })
}

export function useEventDescriptionGenerator() {
  return useMutation({
    mutationFn: generateEventDescription,
  })
}

export const useSmartSuggestionsCalendarMutation = () => {
  return useMutation({
    mutationFn: generateSmartSuggestion,
  })
}
