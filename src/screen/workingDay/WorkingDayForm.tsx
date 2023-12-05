import { Checkbox, FormControlLabel, Grid, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { TimePicker } from 'components/Form/Input/TimePicker'
import { DaysInWeekData } from 'lib/types/timeSheet'
import React, { useEffect, useState } from 'react'
import {
  Control,
  FieldError,
  UseFormSetValue,
  UseFormClearErrors,
  UseFormWatch
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { CompanySettingData } from 'screen/Company/CompanySetting'
type DaysInWeekResponse = {
  data: DaysInWeekData[]
}

export type ErrorCompanySettingData = Record<
  keyof Partial<CompanySettingData>,
  FieldError | undefined
>

type DayInWeekLabel = {
  value: number | string
  label: string
  isChecked?: boolean
}
type WorkingDayFormProps = {
  control: Control<CompanySettingData, object>
  setValue: UseFormSetValue<CompanySettingData>
  watch: UseFormWatch<CompanySettingData>
  clearErrors: UseFormClearErrors<CompanySettingData>
  errors: any
}

const WorkingDayForm: React.VFC<WorkingDayFormProps> = ({
  control,
  setValue,
  errors,
  clearErrors,
  watch
}) => {
  const { t } = useTranslation()

  const [dayInWeekLabels, setDayInWeekLabels] = useState<DayInWeekLabel[]>([])

  const handleCheck = (id: number | string) => {
    const newDayInWeek = dayInWeekLabels.map((day, index) =>
      index === id
        ? {
            ...day,
            isChecked: !day.isChecked
          }
        : day
    )
    setDayInWeekLabels(newDayInWeek)

    const listDayInWeekId = newDayInWeek
      .filter((day) => day.isChecked)
      .map((day) => day.value as string)
    const listDayInWeekName = newDayInWeek.filter((day) => day.isChecked).map((day) => day.label)
    clearErrors('day_in_week_id')
    clearErrors('name')
    setValue('day_in_week_id', listDayInWeekId)
    setValue('name', listDayInWeekName)
  }

  const [dayInWeek, setDayInWeek] = useState<DaysInWeekData[]>([])
  useQuery<DaysInWeekResponse>([`1.0/user/days-in-week`], {
    onSuccess: (data) => {
      setDayInWeek(data.data)
    }
  })

  useEffect(() => {
    if (dayInWeek) {
      const dayInWeekDefault: DayInWeekLabel[] = dayInWeek
        .map((diw: DaysInWeekData) => {
          return {
            value: diw.id,
            label: t(`working_day.day_in_week_name.${diw.name.toLowerCase()}`),
            isChecked: (watch('day_in_week_id') as number[])?.includes(diw.id)
          }
        })
        .reverse()

      setDayInWeekLabels(dayInWeekDefault)
    }
  }, [watch('day_in_week_id'), dayInWeek])

  return (
    <>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={3} mt={2} mb={2}>
          <Grid item xs={12}>
            <Typography variant="h6">{t('working_day.create_page')}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <div
                    style={{
                      height: '8px',
                      width: '8px',
                      border: `solid 2px ${errors?.day_in_week_id ? '#d32f2f' : '#616161'}`,
                      borderRadius: '50%',
                      backgroundColor: errors?.day_in_week_id ? '#d32f2f' : '#757575'
                    }}
                  ></div>
                  <Typography
                    sx={{ fontSize: '16px', color: errors?.day_in_week_id ? '#d32f2f' : 'unset' }}
                    variant="caption"
                  >
                    {t('working_day.working_day_of_date')}*
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                {dayInWeekLabels.map((day, index) => (
                  <FormControlLabel
                    key={index}
                    label={
                      <Typography sx={{ fontSize: '13px' }} variant="caption">
                        {day.label}
                      </Typography>
                    }
                    control={
                      <Checkbox checked={day.isChecked} onChange={(e) => handleCheck(index)} />
                    }
                  />
                ))}
              </Grid>
              {errors?.day_in_week_id && (
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: '0.75rem',
                    lineHeight: 1.66,
                    marginLeft: '8px',
                    color: '#d32f2f'
                  }}
                >
                  {t(errors?.['day_in_week_id']?.message)}
                </span>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <div
                    style={{
                      height: '8px',
                      width: '8px',
                      border: 'solid 2px #616161',
                      borderRadius: '50%',
                      backgroundColor: '#757575'
                    }}
                  ></div>
                  <Typography sx={{ fontSize: '16px' }} variant="caption">
                    {t('working_day.working_time')}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={3} xs={6}>
                <TimePicker
                  fullWidth
                  required
                  label={t('working_day.start_time')}
                  name={'start_time' as never}
                  control={control}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <TimePicker
                  fullWidth
                  required
                  label={t('working_day.end_time')}
                  name={'end_time' as never}
                  control={control}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <TimePicker
                  fullWidth
                  label={t('working_day.start_lunch_break')}
                  name={'start_lunch_break' as never}
                  control={control}
                />
              </Grid>
              <Grid item md={3} xs={6}>
                <TimePicker
                  fullWidth
                  label={t('working_day.end_lunch_break')}
                  name={'end_lunch_break' as never}
                  control={control}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export { WorkingDayForm }
