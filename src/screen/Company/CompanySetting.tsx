//@ts-nocheck
import { Box, Button } from '@mui/material'
import { DAY_IN_WEEK } from 'lib/utils/contants'
import React, { useState } from 'react'
import { FieldError, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
// import { ErrorCompanySettingData, WorkingDayForm } from 'screen/wordingDay/WorkingDayForm'
import {  STEP } from './CompanyForm'
import { SettingDisplayFormat } from './SettingDisplayFormat'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAtom } from 'jotai'
import { setLocalStorageCleanup } from './file'
import { positionAndTitle } from 'lib/atom/positionAndTitles'
import { branchAndDepartment } from 'lib/atom/branchAndDepartmentAtom'
import { companyAtom } from 'lib/atom/CompanyInfoAtom'
import { CompanyData } from 'lib/types/companyGroup'
import { PARSE_FORMAT_DATE, PARSE_LOCALE, PARSE_TIME_ZONE, SystemSetting } from 'lib/types/system_setting'
import { WorkingDayData } from 'lib/types/timeSheet'
import { formatDateTime, getOnlyTimeFromDate } from 'lib/utils/format'
import { WorkingDayForm } from 'screen/workingDay/WorkingDayForm'


interface ISettingAndWorkingDayResponse {
  system_setting: SystemSetting
  working_day: WorkingDayData
}

type ErrorCompanySettingData = Record<
  keyof Partial<CompanySettingData>,
  FieldError | undefined
>

type CompanySettingProps = {
  companyId?: number
  handleComplete: (s: number) => void
  statusStep: string
}

export type CompanySettingData = {
  company_id: number | undefined
  //
  name: string[] | string
  type: string | number
  start_time: string | Date
  end_time: string | Date
  end_lunch_break: string | Date
  start_lunch_break: string | Date
  day_in_week_id: number | string | string[] | number[]
  day_in_week_name?: string
  //
  format_date: string
  time_zone: string
  locale: string
}

const CompanySetting: React.VFC<CompanySettingProps> = ({
  companyId,
  handleComplete,
  statusStep
}) => {
  const { t } = useTranslation()
  const validateSettingCompany = yup.object({
    format_date: yup.string().required(t('validate.required.format_date')),
    time_zone: yup.string().required(t('validate.required.time_zone')),
    locale: yup.string().required(t('validate.required.locale')),
    start_time: yup.date().required(t('validate.required.start_time')),
    day_in_week_id: yup.array().min(1, t('validate.required.day_in_week_id')),
    end_time: yup
      .date()
      .required(t('validate.required.end_time'))
      .min(yup.ref('start_time'), t('validate.end_time_after_start_time')),
    start_lunch_break: yup
      .date()
      .required('Start lunch break is required')
      .min(yup.ref('start_lunch_break'), t('validate.end_lunch_after_start_lunch'))
      .test('is-in-time-range', t('validate.lunch_time_in_range_work'), function (value) {
        const startLunchBreak = this.parent.start_lunch_break
        const startTime = this.parent.start_time

        return startLunchBreak >= startTime
      }),
    end_lunch_break: yup
      .date()
      .required('End lunch break is required')
      .min(yup.ref('start_lunch_break'), t('validate.end_lunch_after_start_lunch'))
      .test('is-in-time-range', t('validate.lunch_time_in_range_work'), function (value) {
        const endLunchBreak = this.parent.end_lunch_break
        const endTime = this.parent.end_time

        return endLunchBreak <= endTime
      })
  })
  const DEFAULT_INDEX = 0
  const storedData = localStorage.getItem('system-setting')

  let data: CompanySettingData | null = null

  if (storedData !== null) {
    data = JSON.parse(storedData)
  }
  const setInitTime = (time: string | Date) => formatDateTime(new Date('2020-01-01 ' + time))
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CompanySettingData>({
    defaultValues: {
      company_id: companyId,
      // first
      format_date: PARSE_FORMAT_DATE[DEFAULT_INDEX].value,
      time_zone: PARSE_TIME_ZONE[DEFAULT_INDEX].value,
      locale: PARSE_LOCALE[DEFAULT_INDEX].value,

      // second
      name: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      type: 1,
      start_time: data ? setInitTime(data.start_time) : setInitTime('09:00'),
      end_time: data ? setInitTime(data.end_time) : setInitTime('18:00'),
      start_lunch_break: data ? setInitTime(data.start_lunch_break) : setInitTime('12:00'),
      end_lunch_break: data ? setInitTime(data.end_lunch_break) : setInitTime('13:00'),
      day_in_week_id: data
        ? data.day_in_week_id
        : [
            DAY_IN_WEEK['MONDAY'],
            DAY_IN_WEEK['TUESDAY'],
            DAY_IN_WEEK['WEDNESDAY'],
            DAY_IN_WEEK['THURSDAY'],
            DAY_IN_WEEK['FRIDAY']
          ]
    },
    resolver: yupResolver(validateSettingCompany)
  })

  const [branchAndDepartmentAtom] = useAtom(branchAndDepartment)
  const [company_Atom] = useAtom<CompanyData>(companyAtom)
  const [positionAndTitleAtom] = useAtom(positionAndTitle)
  const onNextStep: SubmitHandler<CompanySettingData> = async (value) => {
    if (company_Atom?.is_create == 0) {
      toast.error(t('companies.please_complete_step_1'))
      return
    }
    if (
      branchAndDepartmentAtom?.branchs.length == 0 ||
      branchAndDepartmentAtom?.departments.length == 0
    ) {
      toast.error(t('companies.please_complete_step_2'))
      return
    }
    if (positionAndTitleAtom?.positions.length == 0 || positionAndTitleAtom?.titles.length == 0) {
      toast.error(t('companies.please_complete_step_3'))
      return
    }
    try {
      value.start_time = getOnlyTimeFromDate(value.start_time)
      value.end_time = getOnlyTimeFromDate(value.end_time)
      value.start_lunch_break = getOnlyTimeFromDate(value.start_lunch_break)
      value.end_lunch_break = getOnlyTimeFromDate(value.end_lunch_break)
      localStorage.setItem('system-setting', JSON.stringify(value))
      handleComplete(STEP[4])
      setLocalStorageCleanup('system-setting')
    } catch (error) {
      toast.error(error.error)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onNextStep)}
      width={{ xs: '100%' }}
      minHeight="100vh"
    >
      <SettingDisplayFormat control={control} />
      <WorkingDayForm
        control={control}
        setValue={setValue}
        clearErrors={clearErrors}
        watch={watch}
        errors={errors as ErrorCompanySettingData}
      />
      <Button type="submit" variant="contained">
        {t('companies.steps.next')}
      </Button>
    </Box>
  )
}

export { CompanySetting }
