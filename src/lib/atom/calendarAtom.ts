import { atomWithStorage } from 'jotai/utils'
import { formatDateTime } from 'lib/utils/format'

export const monthCalendarAtom = atomWithStorage('monthCalendar', formatDateTime(new Date()))
