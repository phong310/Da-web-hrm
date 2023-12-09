import { HasTimekeepingInPastType } from 'lib/types/timekeeping'
import { request } from '../request'

export const checkHasTimekeepingYesterday = () =>
    request.get<HasTimekeepingInPastType>('1.0/user/timekeeping/check-has-timekeeping')
