import { Box, Grid, styled, Typography, useMediaQuery, Theme } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

// import {
//   formatYearMonth,
//   getAllDaysInMonth,
//   minutesToDays,
//   PERMISSIONS_MANAGE_APPLICATION
// } from 'lib/utils'
import { format } from 'date-fns'
import { useQuery } from 'react-query'
import { useAtom, useAtomValue } from 'jotai'
// import { DatePicker } from 'components/v2/common/Input'
// import { monthCalendarAtom, systemSettingAtom } from 'lib/atom'
// import { useAuth } from 'lib/hooks'
// import { TimeSheetProps } from 'screen/timesheet'
import { useForm } from 'react-hook-form'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { monthCalendarAtom } from 'lib/atom/calendarAtom'
import { useAuth } from 'lib/hook/useAuth'
import { TimeSheetProps } from 'screen/timesheet/TimeSheet'
import { V1 } from 'constants/apiVersion'
import { formatYearMonth, getAllDaysInMonth } from 'lib/utils/format'
import { PERMISSIONS_MANAGE_APPLICATION } from 'lib/utils/contants'
import { minutesToDays } from 'lib/utils/datetime'
import { Page } from 'components/Layouts/Page/Page'
import Overview from 'components/dashborad/Overview'
import { Base, Orange, PrimaryColors, Yellow } from 'styles/colors'
import { DatePicker } from 'components/Form/Input/DatePicker'
import ReportDashboard from './ReportDashboard'
import { reportAllTotalAmountArr, reportAmountArr, reportTotalAmountArr } from 'lib/utils'
// import { V1 } from 'constants'
// import Overview from 'components/v2/dashboard/Overview'
// import ReportDashboard from 'components/v2/dashboard/ReportDashboard'
// import {
//   reportAllTotalAmountArr,
//   reportAmountArr,
//   reportTotalAmountArr,
//   reportTotalLaborContractArr
// } from 'lib/utils/v2'
// import { Base, Green, Orange, PrimaryColors, Yellow } from 'styles/v2'
// import Page from 'components/v2/common/Page'

const Dashboard: React.VFC = () => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const systemSetting = useAtomValue(systemSettingAtom)
  const [monthAtom, setMonthAtom] = useAtom(monthCalendarAtom)

  const [amount, setAmount] = useState<any>({})
  const [minutesRemains, setMinutesRemains] = useState<number>(0)
  const { user, permissions } = useAuth()

  const { control, watch } = useForm<TimeSheetProps>({
    defaultValues: {
      month: new Date()
    }
  })

  useQuery<{ annual_leave: number; leave_form: number }>(
    [`${V1}/user/day-off/remaining-days-off?employee_id=${user?.employee_id}`],
    {
      onSuccess: (data) => {
        setMinutesRemains(data.annual_leave - data.leave_form)
      }
    }
  )

  useQuery(
    [
      `${V1}/user/dashboard/calculate`,
      {
        month: formatYearMonth(
          new Date(watch('month')).getMonth() + 1,
          new Date(watch('month')).getFullYear()
        )
      }
    ],
    {
      onSuccess: (data) => {
        setAmount(data)
      }
    }
  )

  const daysInMonth = getAllDaysInMonth(
    new Date(watch('month')).getMonth() + 1,
    new Date(watch('month')).getFullYear()
  )

  const displayDatePrefix = {
    first: `${t('application_form.from')} `,
    second: `${' '} ${t('application_form.to').toLowerCase()}`
  }

  const displayDate = `${displayDatePrefix.first} ${format(
    new Date(daysInMonth[0]),
    systemSetting?.format_date || 'yyyy/MM/dd'
  )} ${displayDatePrefix.second} ${' '}
  ${format(
    new Date(daysInMonth[daysInMonth.length - 1]),
    systemSetting?.format_date || 'yyyy/MM/dd'
  )}`

  const hasManagePermission = () => {
    let hasManagePermissions = true
    PERMISSIONS_MANAGE_APPLICATION.map((value) => {
      if (!permissions?.includes(value)) {
        hasManagePermissions = false
      }
    })
    return hasManagePermissions
  }

  const displayMinutesRemains = minutesToDays(minutesRemains, true)

  useEffect(() => {
    setMonthAtom(watch('month') as string)
  }, [watch('month'), setMonthAtom])

  return (
    <Page title={t('dashboard.overview')}>
      <Overview systemSetting={systemSetting} remainingDayOff={displayMinutesRemains} />

      <Box>
        <Box sx={{ ...styleBoxConainer }}>
          <Typography color={PrimaryColors['600']} fontWeight={600} sx={{ ...styleTitle }}>
            {t('timesheet.statistic_title')}
          </Typography>
          <Box sx={{ ...styleBoxInner }}>
            {!isMobile && <TextRemainingStyle>{displayDate}</TextRemainingStyle>}
            <DatePicker
              name="month"
              views={['year', 'month']}
              maxDate={new Date()}
              control={control}
              defaultValue={monthAtom}
              size="small"
            />
          </Box>
        </Box>

        <Grid container spacing={{ xs: 0 }} sx={{ ...styleGrid }}>
          <ReportDashboard
            titleReport={t('timesheet.statistic')}
            titleList={reportAmountArr}
            data={amount}
            isTimeStatisticBox={true}
            month={formatYearMonth(
              new Date(watch('month')).getMonth() + 1,
              new Date(watch('month')).getFullYear()
            )}
            colorText={PrimaryColors['500']}
            background={PrimaryColors['000']}
          />
          {/* {hasManagePermission() ? (
            <ReportDashboard
              titleReport={t('labor_contract.contract_managerment')}
              titleList={reportTotalLaborContractArr}
              data={amount}
              isPermisstion={true}
              colorText={Orange['600']}
              background={Orange['000']}
            />
          ) : (
            ''
          )} */}
          <ReportDashboard
            titleReport={t('application_form.all_application')}
            titleList={reportTotalAmountArr}
            data={amount}
            month={formatYearMonth(
              new Date(watch('month')).getMonth() + 1,
              new Date(watch('month')).getFullYear()
            )}
            colorText={Yellow['600']}
            background={Yellow['000']}
          />
          {hasManagePermission() ? (
            <ReportDashboard
              titleReport={t('menu.management')}
              titleList={reportAllTotalAmountArr}
              data={amount}
              isPermisstion={true}
              month={formatYearMonth(
                new Date(watch('month')).getMonth() + 1,
                new Date(watch('month')).getFullYear()
              )}
              colorText={Orange['400']}
              background={Orange['000']}
            />
          ) : (
            ''
          )}
        </Grid>
      </Box>
    </Page>
  )
}

export { Dashboard }

export const ContentTextOfCard = styled(Typography)({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px'
})

const TextRemainingStyle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  lineHeight: '22px',
  color: Base.black,
  marginRight: 16,
  fontWeight: 500,
  [theme.breakpoints.down('sm')]: {
    marginBottom: 16
  }
}))

const styleTitle = {
  fontSize: '24px',
  fontFamily: 'Lato'
}

const styleBoxInner = {
  display: { xs: 'flex', md: 'flex' },
  justifyContent: 'space-between',
  alignItems: 'center'
}

const styleBoxConainer = {
  display: { xs: 'flex', md: 'flex' },
  justifyContent: 'space-between',
  alignItems: 'center',
  p: { xs: '16px 0', md: '24px 0px' },
  mt: { xs: 0, sm: 0, md: 1, lg: 0 }
}

const styleGrid = {}
