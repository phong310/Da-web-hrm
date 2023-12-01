import { useAtom } from 'jotai'
import { monthCalendarAtom } from 'lib/atom'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { TimeSheetCalendar } from './Calendar/TimeSheetCalendar'
import { DatePicker } from 'components/Form/Input/DatePicker'
export interface TimeSheetProps {
  month: string | Date
}

const TimeSheet: React.VFC = () => {
  const { t } = useTranslation()
  const [monthAtom, setMonthAtom] = useAtom(monthCalendarAtom)
  const [searchParams] = useSearchParams()

  const { control, watch } = useForm<TimeSheetProps>({
    defaultValues: {
      month: searchParams.get('month') ?? new Date()
    }
  })

  const month: string | Date | undefined = watch('month')

  useEffect(() => {
    if (month) {
      setMonthAtom(month as string)
    }
  }, [month, setMonthAtom])

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
      month={month}
    />
  )
}

export { TimeSheet }
