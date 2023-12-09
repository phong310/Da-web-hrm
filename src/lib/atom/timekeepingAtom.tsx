import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { HasTimekeepingInPastType } from 'lib/types/timekeeping'
import { formatNormalDate } from 'lib/utils/format'

export const timekeepingAtom = atom<HasTimekeepingInPastType | null>(null)

export const timekeepingReminderFirstInDateAtom = atomWithStorage(
  'timekeeping-reminder-first-in-date',
  {
    date: formatNormalDate(new Date()),
    is_first: true
  }
)
