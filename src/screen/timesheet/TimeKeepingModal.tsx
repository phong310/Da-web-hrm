import CloseIcon from '@mui/icons-material/Close'
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { styled } from '@mui/styles'
import { minutesToHours } from 'date-fns'
import { useAuth } from 'lib/hook/useAuth'
import { TYPE_FORM } from 'lib/types/applicationForm'
import { CompensatoryWorkingDayData, TimesheetCalendarType } from 'lib/types/timeSheet'
import { isCompensatoryWorkingDay, isWeekend } from 'lib/utils/datetime'
import { formatDate, formatISODate, formatNormalDateV2, formatTime, getAllDaysInMonth, minutesToDays } from 'lib/utils/format'
// import { TYPE_FORM } from 'constants'
// import {
//   CompensatoryWorkingDayData,
//   OvertimeSalaryCoefficientsType,
//   TimesheetCalendarType
// } from 'lib/types'
// import {
//   formatDate,
//   formatISODate,
//   formatNormalDateV2,
//   formatTime,
//   getAllDaysInMonth,
//   isCompensatoryWorkingDay,
//   isWeekend,
//   minutesToDays,
//   minutesToHours
// } from 'lib/utils'
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { LeaveFromTimeSheet } from './Atom/LeaveFromTimeSheet'
import { CompensatoryLeaveTimeSheet } from './Atom/CompensatoryLeaveTimeSheet'
import { OverTimeSheet } from './Atom/OverTimeSheet'
// import { CompensatoryLeaveTimeSheet } from '../Atoms/CompensatoryLeaveTimeSheet'
// import { LeaveFromTimeSheet } from '../Atoms/LeaveFromTimeSheet'
// import { OverTimeSheet } from '../Atoms/OverTimeSheet'
// import { useAuth } from 'lib/hooks'

type checkStartOrEndTimeNullType = {
  start: boolean
  end: boolean
}

type PropType = DialogProps & {
  title?: string
  handleOnClickForm?: (type_form: number) => void
  handleClose: MouseEventHandler<HTMLButtonElement> | undefined
  data: TimesheetCalendarType
  checkStartOrEndTimeNull?: checkStartOrEndTimeNullType
  isDisplayFormAction?: boolean
  calendar: string | Date
  totalAllTimeWork?: number | any
}
type DataResponse<T> = {
  data: T[]
}

const date_now = formatISODate(new Date())

export const TimekeepingModal: React.VFC<PropType> = ({
  open,
  handleClose,
  checkStartOrEndTimeNull,
  handleOnClickForm,
  isDisplayFormAction = true,
  data,
  calendar,
  totalAllTimeWork,
  ...props
}) => {
  const { t } = useTranslation()
  let isFuture = false

  const daysInMonth = getAllDaysInMonth(
    new Date(calendar).getMonth() + 1,
    new Date(calendar).getFullYear()
  )
  const [dayInMonth, setDayInMonth] = useState<string | Date>(new Date())
  const { systemSetting } = useAuth()
  const checkDayWeekend = (day: string | Date) => {
    return isWeekend(day)
  }

  useEffect(() => {
    daysInMonth.map((day) => {
      if (data.date === formatNormalDateV2(day)) {
        setDayInMonth(day)
      }
    })
  }, [data])

  const [compensatoryWDs, setCompensatoryWDs] = useState<CompensatoryWorkingDayData[]>([])
  useQuery<DataResponse<CompensatoryWorkingDayData>>([`1.0/user/compensatory-working-day`], {
    onSuccess: (data) => {
      setCompensatoryWDs(data.data)
    }
  })

  if (date_now <= formatISODate(data.date || new Date())) {
    isFuture = true
  }
  const DialogActionsEl = useMemo(() => {
    const grid_button = {
      sm: isFuture ? 4 : 6,
      xs: 6
    }
    return (
      <Grid container sx={{ ...styleGridContainer }} spacing={2}>
        <Grid item {...grid_button}>
          <Tooltip title={t('leave_form')} placement="bottom-end">
            <Button
              sx={styleButton}
              onClick={() => handleOnClickForm?.(TYPE_FORM['LEAVE'])}
              variant="outlined"
            >
              {t('leave_form')}
            </Button>
          </Tooltip>
        </Grid>
        <Grid item {...grid_button}>
          <Tooltip title={t('overtime')} placement="bottom-end">
            <Button
              sx={styleButton}
              onClick={() => handleOnClickForm?.(TYPE_FORM['OVERTIME'])}
              variant="outlined"
            >
              {t('overtime')}
            </Button>
          </Tooltip>
        </Grid>
        {!isFuture && (
          <Grid item {...grid_button}>
            <Tooltip title={t('request_change_timesheet')} placement="bottom-end">
              <Button
                sx={styleButton}
                onClick={() => handleOnClickForm?.(TYPE_FORM['REQUEST_CHANGE_TIMESHEET'])}
                variant="outlined"
              >
                {t('request_change_timesheet')}
              </Button>
            </Tooltip>
          </Grid>
        )}
        <Grid item {...grid_button}>
          <Tooltip title={t('timesheet.compensatory_leave')} placement="bottom-end">
            <Button
              sx={styleButton}
              onClick={() => handleOnClickForm?.(TYPE_FORM['COMPENSATORY_LEAVE'])}
              variant="outlined"
            >
              {t('timesheet.compensatory_leave')}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    )
  }, [isFuture, t, handleOnClickForm])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" {...props}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ...styleTitle }} component="div">
            {data?.employee_full_name
              ? `${data?.employee_full_name} - ${t('timekeeping')}`
              : t('timekeeping')}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{ ...iconButton }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent>
        <Box component="form" noValidate autoComplete="off" sx={{ ...styleBox }}>
          <Grid item container sx={{ ...styleGrid }}>
            <Typography sx={styleDate}>
              {formatDate(data && data.date, systemSetting?.format_date)}
            </Typography>
            <Grid item container sx={{ mb: 1 }}>
              {((!checkStartOrEndTimeNull?.start &&
                data.check_out_time &&
                formatTime(data.check_out_time) !== '07:00') ||
                (!checkStartOrEndTimeNull?.start &&
                  data.check_in_time &&
                  formatTime(data.check_in_time) !== '07:00')) && (
                <>
                  <Box sx={{ ...styleTitleDetail }}>
                    <Typography sx={{ ...styleLabel }}>{t('timekeeping')}</Typography>
                    <Typography sx={{ ...styleLabel }}>
                      {data?.total_time_work_without_time_off != 0
                        ? minutesToHours(data?.total_time_work_without_time_off)
                        : '0h'}
                    </Typography>
                  </Box>
                  <Grid item container xs={12} sx={{ ...styleTime, ...styleColorAM, mb: 2 }}>
                    <Grid item xs={12} sx={{ ...styleTime }}>
                      {!checkStartOrEndTimeNull?.start &&
                        data.check_in_time &&
                        formatTime(data.check_in_time) !== '07:00' && (
                          <Typography sx={{ ...styleTimeKeeping, ...textCenter }}>
                            {formatTime(data.check_in_time)} -{' '}
                          </Typography>
                        )}
                      {!checkStartOrEndTimeNull?.start &&
                        data.check_out_time &&
                        formatTime(data.check_out_time) !== '07:00' && (
                          <Typography sx={{ ...styleTimeKeeping, ...textCenter }}>
                            {formatTime(data.check_out_time)}
                          </Typography>
                        )}
                    </Grid>
                  </Grid>
                </>
              )}

              {!data.leave_form_has_timesheets &&
              !data.compensatory_leave_has_timesheet &&
              checkStartOrEndTimeNull?.start &&
              !data.overtime &&
              !isFuture ? (
                isCompensatoryWorkingDay(dayInMonth, compensatoryWDs) ||
                !checkDayWeekend(dayInMonth) ? (
                  <Grid item container xs={12} sx={{ ...styleTime, mb: '16px', ...styleDayOff }}>
                    <Grid item xs={12} sx={{ ...styleTime }}>
                      <TypeTimesheetTypography>X</TypeTimesheetTypography>
                      <Typography sx={{ ...styleNX, ...textCenter }} variant="h1" component="div">
                        {t('timesheet.type.no_timekeeping')}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item container xs={12} sx={{ ...styleTime, mb: '16px', ...styleDayOff }}>
                    <Grid item xs={12} sx={{ ...styleTime }}>
                      <TypeTimesheetTypography>N</TypeTimesheetTypography>
                      <Typography sx={{ ...styleNX, ...textCenter }} variant="h1" component="div">
                        {t('timesheet.type.weekend')}
                      </Typography>
                    </Grid>
                  </Grid>
                )
              ) : (
                ''
              )}

              <>
                <LeaveFromTimeSheet data={data} />
                <CompensatoryLeaveTimeSheet data={data} />
                <OverTimeSheet data={data} />
                <Grid item container sx={{ ...gridItemLateTime }}>
                  <Typography sx={{ ...styleText, ...textCenter }} variant="h6" component="div">
                    {t('timesheet.late_time')}
                  </Typography>
                  <Typography sx={{ ...styleTextHeading }} variant="h6" component="div">
                    {minutesToHours(Number(data.late_time)) || 0}
                  </Typography>
                </Grid>
                <Grid item container sx={{ ...gridItemTimeEarly }}>
                  <Typography sx={{ ...styleText, ...textCenter }} variant="h6" component="div">
                    {t('timesheet.time_early')}
                  </Typography>
                  <Typography sx={{ ...styleTextHeading }} variant="h6" component="div">
                    {minutesToDays(Number(data.time_early)) || 0}
                  </Typography>
                </Grid>
                <Grid item container sx={{ ...gridItemTimeWorking }}>
                  <Typography sx={{ ...styleText, ...textCenter }} variant="h6" component="div">
                    {t('timesheet.total_working_time')}
                  </Typography>
                  <Typography sx={{ ...styleTextHeading }} variant="h6" component="div">
                    {minutesToHours(totalAllTimeWork) || 0}
                  </Typography>
                </Grid>
              </>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {isDisplayFormAction ? <DialogActions>{DialogActionsEl}</DialogActions> : undefined}
    </Dialog>
  )
}

const TypeTimesheetTypography = styled(Typography)({
  fontWeight: 500,
  fontSize: 20,
  lineHeight: '18px',
  color: 'black'
})
const styleDate = {
  fontSize: { xs: '14px', sm: '16px' },
  fontWeight: 600,
  lineHeight: '28px',
  marginBottom: '10px',
  fontFamily: 'Lato'
}
const styleDayOff = {
  borderRadius: '8px',
  background: 'var(--primary-000, #f5f5f5)',
  color: 'grey'
}
const styleBox = {
  width: '100%'
}
const styleGridContainer = {
  px: { xs: '16px', sm: '24px' },
  py: '12px'
}
export const styleTitleDetail = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center'
}
const styleTextHeading = {
  fontSize: '16px',
  fontFamily: 'Lato',
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '28px'
}

const styleContainer = {
  justifyContent: 'space-between',
  mb: '12px'
}

export const styleTime = {
  display: 'flex',
  width: '100%',
  padding: '8px 0',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px'
}
const styleColorAM = {
  borderRadius: '8px',
  background: 'white',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px',
  color: 'black'
}
const styleText = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px'
}
const styleNX = {
  fontWeight: 400,
  fontSize: { xs: '13px', sm: '16px' },
  lineHeight: '20px'
}
const styleTimeKeeping = {
  fontWeight: 'bold',
  fontSize: { xs: '13px', sm: '16px' },
  lineHeight: '20px'
}

const textCenter = {
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'center'
}

const styleButton = {
  display: 'inline-block',
  width: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden !important',
  textOverflow: 'ellipsis',
  textTransform: 'none'
}

const styleTitle = {
  ml: 1,
  flex: 1,
  fontSize: { xs: '16px', sm: '18px' }
}

const iconButton = {
  marginLeft: 'auto'
}

const styleGrid = {
  p: '0 6px'
}

const gridItemTimeWorking = {
  justifyContent: 'space-between',
  p: { xs: '8px 6px', sm: '16px 6px' }
}

const gridItemLateTime = {
  justifyContent: 'space-between',
  p: { xs: '8px 6px', sm: '16px 6px' }
}

const gridItemTimeEarly = {
  justifyContent: 'space-between',
  p: { xs: '8px 6px', sm: '16px 6px' }
}

const styleLabel = {
  fontSize: { xs: '12px', sm: '14px' },
  fontWeight: 'bold',
  color: 'black'
}
