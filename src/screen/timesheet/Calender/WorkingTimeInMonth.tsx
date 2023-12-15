import { Box, Grid, Typography, styled } from '@mui/material'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { CompensatoryWorkingDayData, WorkingDayData } from 'lib/types/timeSheet'
import { getDayIdInDate, isCompensatoryWorkingDay, minutesToOnlyHours } from 'lib/utils/datetime'
import { getAllDaysInMonth } from 'lib/utils/format'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type timeOffType = {
  paid_leave: number
  unpaid_leave: number
}

interface WorkingTimeInMonthProps {
  month: string | Date
  workingDays: WorkingDayData[] | undefined
  totalActualWorkingDays: number
  numOfWorkingDays: number
  totalOvertime: number
  totalTimeOff: timeOffType
  compensatoryWDs: CompensatoryWorkingDayData[] | undefined
}

const WorkingTimeInMonth = ({
  month,
  workingDays,
  totalActualWorkingDays,
  numOfWorkingDays,
  totalOvertime,
  compensatoryWDs,
  totalTimeOff
}: WorkingTimeInMonthProps) => {
  const { t } = useTranslation()

  // Number of working days/hours in a month
  const totalInMonth = useMemo(() => {
    const d = new Date(month)
    const year = d.getFullYear()
    const _month = d.getMonth() + 1

    const daysInMonth = getAllDaysInMonth(_month, year)

    let totalDayWorking = 0

    const totalHours = daysInMonth.reduce((total, day) => {
      const workingDay: any = workingDays?.find(
        (wd: any) => wd.day_in_week_id == getDayIdInDate(day)
      )
      if (workingDay) {
        totalDayWorking += 1
        return total + Number(workingDay?.total_time_work || 0)
      }

      if (compensatoryWDs) {
        const compensatoryWD: any = isCompensatoryWorkingDay(day, compensatoryWDs)
        if (compensatoryWD) {
          totalDayWorking += 1
          return total + Number(compensatoryWD?.total_time_work || 0)
        }
      }

      return total
    }, 0)

    return {
      hours: totalHours,
      days: totalDayWorking
    }
  }, [month, workingDays, compensatoryWDs])
  return (
    <Grid item xs={12} md={12}>
      <RoundPaper
        sx={{
          ...styleRoundPaper
        }}
      >
        <Box sx={{ ...styleBoxOT }}>
          <Box sx={{ ...styleBoxTitle }}></Box>
          <Typography variant="h6" sx={{ ...styleStatisticTitle }}>
            {t('timesheet.working_time_in_month.title')}
          </Typography>
        </Box>
        <Grid container spacing="20px">
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <Box sx={{ ...styleBoxItem }}>
              <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>
                {t('timesheet.working_time_in_month.total')}
              </Typography>
              <Typography sx={{ ...styleTextTitle }}>{`${
                totalInMonth.days === 0 ? totalInMonth.days : totalInMonth.days + 'd'
              } / ${
                minutesToOnlyHours(totalInMonth.hours) === 0
                  ? minutesToOnlyHours(totalInMonth.hours)
                  : minutesToOnlyHours(totalInMonth.hours) + 'h'
              }`}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <Box sx={{ ...styleBoxItem }}>
              <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>
                {t('timesheet.working_time_in_month.actual')}
              </Typography>
              <Typography sx={{ ...styleTextTitle }}>{`${
                totalActualWorkingDays === 0 ? totalActualWorkingDays : totalActualWorkingDays + 'd'
              } / ${
                minutesToOnlyHours(numOfWorkingDays) === 0
                  ? minutesToOnlyHours(numOfWorkingDays)
                  : minutesToOnlyHours(numOfWorkingDays) + 'h'
              }`}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <Box sx={{ ...styleBoxItem }}>
              <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>
                {t('timesheet.working_time_in_month.paid')}
              </Typography>
              <Typography sx={{ ...styleTextTitle }}>
                {minutesToOnlyHours(totalTimeOff.paid_leave) === 0
                  ? minutesToOnlyHours(totalTimeOff.paid_leave)
                  : minutesToOnlyHours(totalTimeOff.paid_leave) + 'h'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={3}>
            <Box sx={{ ...styleBoxItem }}>
              <Typography sx={{ fontSize: { xs: '12px', md: '16px' } }}>
                {t('timesheet.working_time_in_month.unpaid')}
              </Typography>
              <Typography sx={{ ...styleTextTitle }}>
                {minutesToOnlyHours(totalTimeOff.unpaid_leave) === 0
                  ? minutesToOnlyHours(totalTimeOff.unpaid_leave)
                  : minutesToOnlyHours(totalTimeOff.unpaid_leave) + 'h'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </RoundPaper>
    </Grid>
  )
}

export { WorkingTimeInMonth }

const styleBoxOT = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '20px'
}

const styleStatisticTitle = {
  fontSize: { xs: '16px', md: '20px' },
  fontWeight: '700',
  lineHeight: '28px',
  letterSpacing: '0.05em'
}

const styleTextTitle = {
  fontSize: { sx: '20px', md: '30px' },
  fontWeight: '700'
}

const styleRoundPaper = {
  borderRadius: '16px',
  overflow: 'hidden',
  marginTop: 2,
  padding: '20px 20px',
  minHeight: '254px'
}

const styleBoxTitle = {
  width: '6px',
  height: '30px',
  bgcolor: '#308CFB',
  borderRadius: '5px'
}

const styleBoxItem = {
  width: '100%',
  display: 'inline-flex',
  borderRadius: '10px',
  flexDirection: 'column',
  backgroundColor: '#F1F8FF',
  justifyContent: 'center',
  textAlign: 'center',
  alignItems: 'center',
  gap: '10px',
  height: '153px',
  padding: { xs: '32px 16px', md: '43px 13px' }
}
