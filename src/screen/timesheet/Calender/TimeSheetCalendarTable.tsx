import { Box, Grid, Stack, styled, Typography } from '@mui/material'
import lodash from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { TIMESHEET_TYPE_TIME } from 'constants/timeSheetType'
import { HolidayType } from 'lib/types/applicationForm'
import { CompensatoryWorkingDayData, LeaveFormHasTimesheetType, OvertimeSalaryCoefficientsType, TimeSheetData, WorkingDayData } from 'lib/types/timeSheet'
import { FORM_STATUS } from 'lib/utils/contants'
import { isCompensatoryWorkingDay, isDayOff, isHoliday, minutesToHours } from 'lib/utils/datetime'
import { formatDayV2, formatISODate, formatNormalDate, getAllDaysInWeeks } from 'lib/utils/format'
import { checkDayOfMonth } from 'lib/utils/timesheet'
import { blueV2 } from 'styles/colors'
import { bgColorDay, bgColorMonth, colorDayName, HolidayStyled, rowIndex } from '../timesheetLib'
import { TimeSheetTimeline } from '../TimeSheetTimeline'


const defaultEvent: TimeSheetData = {
  id: 0,
  employee_id: 0,
  start_time: '',
  end_time: '',
  date: '',
  company_id: 0,
  deleted_at: '',
  total_time_work: 0,
  late_time: 0,
  time_early: 0,
  type: NaN,
  overtime: null,
  leave_form_has_timesheets: null,
  time_off: 0,
  leave_form: null,
  type_time: NaN,
  compensatory_leave: null,
  compensatory_leave_has_timesheet: null,
  total_time_work_without_time_off: 0
}

interface Event {
  [key: string]: TimeSheetData[]
}

interface TimeSheetCalendar {
  events: Event
  startDate: string | Date
  endDate: string | Date
  workingDays: WorkingDayData[] | undefined
  month: string | Date
  type: string
  onSelectEvent: (event: TimeSheetData) => void
}

type DataResponse<T> = {
  data: T[]
}
const date_now = formatISODate(new Date())

const TimeSheetCalendarTable = ({
  events,
  onSelectEvent,
  startDate,
  workingDays,
  type,
  month,
  endDate
}: TimeSheetCalendar) => {
  const daysInMonth = getAllDaysInWeeks(startDate, endDate)
  const { t } = useTranslation()

  const [holidays, setHolidays] = useState<HolidayType[]>([])
  useQuery<DataResponse<HolidayType>>([`1.0/user/holiday`], {
    onSuccess: (data) => {
      setHolidays(data.data)
    }
  })

  const [compensatoryWDs, setCompensatoryWDs] = useState<CompensatoryWorkingDayData[]>([])
  useQuery<DataResponse<CompensatoryWorkingDayData>>([`1.0/user/compensatory-working-day`], {
    onSuccess: (data) => {
      setCompensatoryWDs(data.data)
    }
  })

  return (
    <Stack
      direction="row"
      sx={{
        ...styleCalendar
      }}
    >
      <Grid item sx={type == 'month' ? styleTableMonth : styleTableTitle}>
        {rowIndex(t).map((item, index) => {
          return (
            <ItemTilteTable key={index} index={index}>
              <Typography sx={{ ...styleText }}>{item.label}</Typography>
            </ItemTilteTable>
          )
        })}
      </Grid>
      <Stack
        direction="row"
        sx={{
          ...styleContentTable
        }}
      >
        {daysInMonth.map((day, index) => {
          let event: TimeSheetData = defaultEvent
          let overtime = defaultEvent
          let isFuture = false
          let isNotOnDay = false
          for (const date in events) {
            if (formatNormalDate(date) === formatNormalDate(day)) {
              events[date].map((timesheet: TimeSheetData) => {
                if (timesheet.type) {
                  event = { ...timesheet, type_time: TIMESHEET_TYPE_TIME['WORKING_TIME'] }
                } else {
                  event = defaultEvent
                }

                if (timesheet.overtime && timesheet.overtime.status === FORM_STATUS['APPROVED']) {
                  overtime = { ...timesheet.overtime, type_time: TIMESHEET_TYPE_TIME['OVERTIME'] }
                } else {
                  overtime = defaultEvent
                }
              })
            }
          }
          const dayName = formatDayV2(day)

          let WorkingTimeElement: any = null

          if (checkDayOfMonth(month, day)) {
            if (date_now <= formatISODate(day)) {
              isFuture = true
              isNotOnDay = false
            }
            if (event.type) {
              switch (true) {
                case !!event.start_time || !!event.end_time: // Nếu TS có start_time hoặc end_time
                  if (event.leave_form_has_timesheets || event.compensatory_leave_has_timesheet) {
                    // Nếu TS có start_time hoặc end_time và có (leave_form_has_timesheets hoặc compensatory_leave_has_timesheet)
                    let newEvent: any = [event]
                    // console.log(event.leave_form_has_timesheets)
                    if (event.leave_form_has_timesheets) {
                      event.leave_form_has_timesheets.forEach(
                        (leave_form_has_timesheet: LeaveFormHasTimesheetType) => {
                          newEvent.push({
                            ...leave_form_has_timesheet,
                            type_time: TIMESHEET_TYPE_TIME['WORKING_TIME']
                          })
                        }
                      )
                    }

                    if (event.compensatory_leave_has_timesheet) {
                      newEvent.push({
                        ...event.compensatory_leave_has_timesheet,
                        type_time: TIMESHEET_TYPE_TIME['WORKING_TIME']
                      })
                    }

                    newEvent = lodash.sortBy(newEvent, ['start_time', 'end_time'])

                    WorkingTimeElement = (
                      <Item
                        sx={{
                          backgroundColor: bgColorDay(isFuture, isNotOnDay),
                          gap: 0.5,
                          overflow: newEvent.length > 2 ? 'auto' : 'unset',
                          justifyContent: newEvent.length > 2 ? 'flex-start' : 'center'
                        }}
                      >
                        {newEvent.map((item: TimeSheetData) => (
                          <TimeSheetTimeline key={item.id} event={item} />
                        ))}
                      </Item>
                    )
                  } else {
                    // Nếu TS có start_time hoặc end_time và ko có leave_form_has_timesheets và ko có compensatory_leave_has_timesheet
                    WorkingTimeElement = (
                      <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }}>
                        <TimeSheetTimeline event={event} />
                      </Item>
                    )
                  }
                  break
                case !!event.leave_form_has_timesheets || !!event.compensatory_leave_has_timesheet:
                  // Nếu TS không có start_time hoặc end_time nhưng có leave_form_has_timesheets hoặc có compensatory_leave_has_timesheet
                  // eslint-disable-next-line no-case-declarations
                  let newEvent = []

                  if (event.leave_form_has_timesheets) {
                    event.leave_form_has_timesheets.forEach(
                      (leave_form_has_timesheet: LeaveFormHasTimesheetType) => {
                        newEvent.push({
                          ...leave_form_has_timesheet,
                          type_time: TIMESHEET_TYPE_TIME['WORKING_TIME']
                        })
                      }
                    )
                  }

                  if (event.compensatory_leave_has_timesheet) {
                    newEvent.push({
                      ...event.compensatory_leave_has_timesheet,
                      type_time: TIMESHEET_TYPE_TIME['WORKING_TIME']
                    })
                  }

                  newEvent = lodash.sortBy(newEvent, ['start_time', 'end_time'])

                  WorkingTimeElement = (
                    <Item
                      sx={{
                        backgroundColor: bgColorDay(isFuture, isNotOnDay),
                        gap: 0.5,
                        overflow: newEvent.length > 2 ? 'auto' : 'unset',
                        justifyContent: newEvent.length > 2 ? 'flex-start' : 'center'
                      }}
                    >
                      {newEvent.map((item: TimeSheetData) => (
                        <TimeSheetTimeline key={item.id} event={item} />
                      ))}
                    </Item>
                  )
                  break
                default:
                  // Nếu TS không có start_time hoặc end_time và ko có leave_form_has_timesheets và ko có compensatory_leave_has_timesheet
                  WorkingTimeElement = (
                    <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }}>
                      {!isFuture ? (
                        isCompensatoryWorkingDay(day, compensatoryWDs) ||
                        isDayOff(day, workingDays) ? (
                          <StatusDay>X</StatusDay>
                        ) : (
                          <StatusDay>N</StatusDay>
                        )
                      ) : (
                        ''
                      )}
                    </Item>
                  )
              }
            } else {
              // Nếu TS không có start_time hoặc end_time và ko có leave_form_has_timesheets và ko có compensatory_leave_has_timesheet
              WorkingTimeElement = (
                <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }}>
                  {!isFuture ? (
                    isCompensatoryWorkingDay(day, compensatoryWDs) || isDayOff(day, workingDays) ? (
                      <StatusDay>X</StatusDay>
                    ) : (
                      <StatusDay>N</StatusDay>
                    )
                  ) : (
                    ''
                  )}
                </Item>
              )
            }
          } else {
            isFuture = true
            isNotOnDay = true
            WorkingTimeElement = (
              <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }}></Item>
            )
          }

          return (
            <Grid item key={index} sx={type === 'month' ? styleTableMonth : styleTableWeek}>
              <ItemDay sx={{ ...styleText }}>
                <Box sx={{ ...styleBoxDay, backgroundColor: bgColorMonth(day, workingDays) }}>
                  <Typography sx={{ ...styleDayName, color: colorDayName(day, workingDays) }}>
                    {dayName}
                  </Typography>
                  <Typography sx={{ ...styleMonth }}>
                    {checkDayOfMonth(month, day) && day.getDate()}
                    {checkDayOfMonth(month, day) && holidays && isHoliday(day, holidays) && (
                      <HolidayStyled>H</HolidayStyled>
                    )}
                    {isCompensatoryWorkingDay(day, compensatoryWDs) && (
                      <HolidayStyled>B</HolidayStyled>
                    )}
                  </Typography>
                </Box>
              </ItemDay>
              <Grid
                container
                sx={{ cursor: 'pointer', width: '100%' }}
                onClick={
                  event.type
                    ? () => onSelectEvent(event)
                    : () =>
                        onSelectEvent({
                          ...defaultEvent,
                          start_time: '',
                          end_time: '',
                          date: day
                        })
                }
              >
                {WorkingTimeElement}

                {overtime.type_time &&
                overtime.overtime_salary_coefficients &&
                overtime.overtime_salary_coefficients.length > 0 ? (
                  <Item
                    sx={{
                      backgroundColor: bgColorDay(isFuture, isNotOnDay),
                      gap: 0.5,
                      overflow: overtime.overtime_salary_coefficients.length > 2 ? 'auto' : 'unset',
                      justifyContent:
                        overtime.overtime_salary_coefficients.length > 2 ? 'flex-start' : 'center'
                    }}
                  >
                    {overtime.overtime_salary_coefficients.map((item: TimeSheetData) => (
                      <TimeSheetTimeline
                        key={item.id}
                        event={{ ...item, type_time: TIMESHEET_TYPE_TIME['OVERTIME'] }}
                      />
                    ))}
                  </Item>
                ) : (
                  <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }}></Item>
                )}
                {event.type ? (
                  <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }}>
                    <Typography
                      sx={{
                        ...styleText,
                        justifyContent: 'center',
                        display: 'flex',
                        width: '100%'
                      }}
                    >
                      {minutesToHours(event.late_time)}
                    </Typography>
                  </Item>
                ) : (
                  <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }} />
                )}

                {event.type ? (
                  <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }}>
                    <Typography
                      sx={{
                        ...styleText,
                        justifyContent: 'center',
                        display: 'flex',
                        width: '100%'
                      }}
                    >
                      {minutesToHours(event.time_early)}
                    </Typography>
                  </Item>
                ) : (
                  <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }} />
                )}

                {event.type || overtime.type_time ? (
                  <Item
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      backgroundColor: bgColorDay(isFuture, isNotOnDay)
                    }}
                  >
                    <Typography
                      sx={{
                        ...styleText,
                        justifyContent: 'center',
                        display: 'flex',
                        width: '100%'
                      }}
                    >
                      {minutesToHours(
                        Number(event.total_time_work) +
                          Number(
                            overtime?.overtime_salary_coefficients
                              ? overtime.overtime_salary_coefficients.reduce(
                                  (total: number, item: OvertimeSalaryCoefficientsType) =>
                                    total + item.total_time_work,
                                  0
                                )
                              : 0
                          )
                      )}
                    </Typography>
                  </Item>
                ) : (
                  <Item sx={{ backgroundColor: bgColorDay(isFuture, isNotOnDay) }}></Item>
                )}
              </Grid>
            </Grid>
          )
        })}
      </Stack>
    </Stack>
  )
}

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  zIndex: 100,
  width: '100%',
  height: 72,
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 'unset',
  border: '0.2px solid #fafafa',
  [theme.breakpoints.down('md')]: {
    minWidth: '110px',
    fontSize: 12,
    padding: theme.spacing(0.5)
  }
}))
const ItemTilteTable = styled(Box)<{
  index: number
}>(({ index, theme }) => {
  return {
    ...theme.typography.body2,
    padding: theme.spacing(2),
    width: '100%',
    height: 72,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'unset',
    alignItems: 'flex-start',
    paddingLeft: '20px',
    border: index === 0 ? 'none' : '0.2px solid #fafafa',
    [theme.breakpoints.down('md')]: {
      minWidth: '110px',
      fontSize: 12,
      padding: theme.spacing(0.5)
    }
  }
})
const ItemDay = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  height: 72,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  backgroundColor: blueV2[20],
  [theme.breakpoints.down('sm')]: {
    minWidth: '110px',
    fontSize: 12,
    padding: theme.spacing(0.5)
  }
}))
const styleContentTable = {
  flex: 1,
  overflowX: 'scroll',
  backgroundColor: 'white',
  width: '100%'
}

const StatusDay = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  zIndex: 100,
  [theme.breakpoints.down('md')]: {
    fontSize: 16
  }
}))

const styleCalendar = {
  '& ::-webkit-scrollbar': { width: 2, height: 8 },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#f0f0f0'
  },
  width: '100%',
  overflow: 'overlay'
}

const styleBoxDay = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '2px 10px',
  alignItems: 'center',
  borderRadius: '8px'
}

const responsiveText = {
  fontSize: {
    sm: '14px',
    xs: '12px'
  }
}

const styleTableMonth = {
  maxWidth: 200,
  minWidth: {
    xs: 120,
    sm: 150
  },
  backgroundColor: 'white'
}
const styleTableWeek = {
  width: '14.2857%',
  minWidth: { xs: '120px', sm: '150px' },
  backgroundColor: 'white'
}
const styleTableTitle = {
  width: '16%',
  minWidth: { xs: '120px', sm: '160px' },
  maxWidth: 200,
  backgroundColor: 'white'
}

const styleText = {
  fontWeight: 500,
  lineHeight: '20px',
  ...responsiveText
}

const styleDayName = {
  fontWeight: 700,
  fontSize: { xs: 14, sm: 18 }
}

const styleMonth = {
  position: 'relative',
  fontWeight: 400,
  fontSize: {
    sm: '16px',
    xs: '14px'
  },
  lineHeight: '24px',
  color: 'var(--greyscale-700, #5E646D)'
}

export { TimeSheetCalendarTable }

