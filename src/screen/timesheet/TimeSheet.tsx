// @ts-nocheck
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns'
import { TimeSheetCalendar } from './Calender/TimeSheetCalendar'
import { monthCalendarAtom } from 'lib/atom/calendarAtom'
import { TYPE_TIME } from 'lib/utils/contants'
import { WeekOfNumber, getDateOfWeek, getMonthInNow } from 'lib/utils/timesheet'
import { formatNormalDateV2, formatYearMonth } from 'lib/utils/format'
import { DatePicker } from 'components/Form/Input/DatePicker'
export interface TimeSheetProps {
  month: string | Date
}
const TimeSheet: React.VFC = () => {
  const { t } = useTranslation()
  const [monthAtom, setMonthAtom] = useAtom(monthCalendarAtom)
  const [searchParams] = useSearchParams()
  const [startDate, setStartDate] = useState<Date | string>('')
  const [endDate, setEndDate] = useState<Date | string>('')
  const [type, setType] = useState(TYPE_TIME.WEEK)
  const [week, setWeek] = useState<number>(1)
  const date = new Date()
  const { control, watch } = useForm<TimeSheetProps>({
    defaultValues: {
      month: searchParams.get('month') ?? new Date()
    }
  })

  const month: string | Date | undefined = watch('month')

  const handleWeekTimeSheet = () => {
    setType(TYPE_TIME.WEEK)
    if (
      getMonthInNow().formattedDate ===
      formatYearMonth(new Date(month).getMonth() + 1, new Date(month).getFullYear())
    ) {
      setStartDate(formatNormalDateV2(startOfWeek(new Date(), { weekStartsOn: 1 })))
      setEndDate(formatNormalDateV2(endOfWeek(new Date(), { weekStartsOn: 1 })))
      setWeek(WeekOfNumber().weekOfMonth)
    } else {
      setWeek(1)
      setStartDate(getDateOfWeek(month, 1).startDate)
      setEndDate(getDateOfWeek(month, 1).endDate)
    }
  }
  const handleMonthTimeSheet = () => {
    setType(TYPE_TIME.MONTH)
    setStartDate(formatNormalDateV2(startOfMonth(new Date(month))))
    setEndDate(formatNormalDateV2(endOfMonth(new Date(month))))
  }
  const nextWeek = () => {
    const nextWeekNumber = week + 1
    setWeek(nextWeekNumber)
    setStartDate(getDateOfWeek(month, nextWeekNumber).startDate)
    setEndDate(getDateOfWeek(month, nextWeekNumber).endDate)
  }

  const backWeek = () => {
    const previousWeekNumber = week - 1
    setWeek(previousWeekNumber)
    setStartDate(getDateOfWeek(month, previousWeekNumber).startDate)
    setEndDate(getDateOfWeek(month, previousWeekNumber).endDate)
  }
  useEffect(() => {
    if (month) {
      const currentDate = new Date()
      const selectedDate = new Date(month)
      const isCurrentMonth =
        getMonthInNow().formattedDate ===
        formatYearMonth(selectedDate.getMonth() + 1, selectedDate.getFullYear())

      if (type === TYPE_TIME.WEEK) {
        if (isCurrentMonth) {
          setStartDate(formatNormalDateV2(startOfWeek(currentDate, { weekStartsOn: 1 })))
          setEndDate(formatNormalDateV2(endOfWeek(currentDate, { weekStartsOn: 1 })))
          setWeek(WeekOfNumber().weekOfMonth)
        } else {
          setWeek(1)
          const { startDate, endDate } = getDateOfWeek(month, 1)
          setStartDate(startDate)
          setEndDate(endDate)
        }
      } else {
        const startOfMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        const endOfMonthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        setStartDate(formatNormalDateV2(startOfMonthDate))
        setEndDate(formatNormalDateV2(endOfMonthDate))
      }
    }
  }, [month, type])

  return (
    <TimeSheetCalendar
      calendar={
        <DatePicker
          fullWidth
          name="month"
          views={['year', 'month']}
          maxDate={new Date()}
          control={control}
          size="small"
          sx={{ backgroundColor: 'white', borderRadius: '10px' }}
        />
      }
      onMonthTimeSheet={handleMonthTimeSheet}
      onWeekTimeSheet={handleWeekTimeSheet}
      startDate={startDate}
      endDate={endDate}
      handleNextWeek={nextWeek}
      handleBackWeek={backWeek}
      typeSheet={type}
      month={month}
    />
  )
}

export { TimeSheet }

