// @ts-nocheck
import { Box, Stack, Typography, styled } from '@mui/material'
import { useAuth } from 'lib/hook/useAuth'
import { HolidayType } from 'lib/types/applicationForm'
import { CompensatoryWorkingDayData, LeaveFormHasTimesheetType, OvertimeSalaryCoefficientsType, TimeSheetData, TimesheetCalendarType, WorkingDayData } from 'lib/types/timeSheet'
import { convertDatetimeTZV2, formatDateTime, formatDayV2, formatISODate, formatNormalDate, formatYearMonth, getAllDaysInMonth } from 'lib/utils/format'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { WorkingDayResponse } from '../Calender/TimeSheetCalendar'
import { floatDiffInMinutes } from 'lib/utils/number_leave_day'
import { HolidayStyled, bgColorMonth, colorDayName } from '../timesheetLib'
import { isCompensatoryWorkingDay, isDayOff, isHoliday, isPast, minutesToOnlyHours } from 'lib/utils/datetime'
import { TIMESHEET_TYPE_TIME } from 'constants/timeSheetType'
import { TimesheetEmployee } from '../components/TimesheetEmployee'
import { TimekeepingModal } from '../TimeKeepingModal'
import { blueV2, grey } from 'styles/colors'
import { ManagementTimesheetTimeLine } from './ManagementTimesheetTimeLine'
import { IArrOTSalaryCoefficients } from './ManagementTimesheetSlow'
import { ReactVirtualizedTableWithToolBar } from 'components/HighPerfomanceTable/ReactVirtualizedTableWithToolBar'
import { V1 } from 'constants/apiVersion'
import { ColumnProps, TableCellProps } from 'react-virtualized'
import { ManagementTimesheetHeader } from './ManagementTimesheetHeader'
type HolidayRespon = {
  data: HolidayType[]
}

type checkStartOrEndTimeNullType = {
  start: boolean
  end: boolean
}
type DataResponse<T> = {
  data: T[]
}
type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'initial'

export const ManagementTimesheet = () => {
  const [holidays, setHolidays] = useState<HolidayType[]>([])
  const [month, setMonth] = useState(new Date())
  const { systemSetting } = useAuth()
  const [openDialog, setOpenDialog] = useState(false)
  const [dataModel, setDataModel] = useState<TimesheetCalendarType>({} as any)
  const { t } = useTranslation()
  const daysInMonth = getAllDaysInMonth(
    new Date(month).getMonth() + 1,
    new Date(month).getFullYear()
  )
  const params: Record<string, unknown> = {
    month: formatYearMonth(new Date(month).getMonth() + 1, new Date(month).getFullYear())
    // per_page: 10
  }

  useQuery<HolidayRespon>([`1.0/user/holiday`], {
    onSuccess: (data: any) => {
      setHolidays(data.data)
    }
  })
  const [workingDays, setWorkingDays] = useState<WorkingDayData[]>()
  useQuery<WorkingDayResponse>([`1.0/user/working-day`], {
    onSuccess: (data) => {
      setWorkingDays(
        data.data.map((item) => {
          let total_time_work = floatDiffInMinutes(item.start_time, item.end_time)

          if (item.start_lunch_break && item.end_lunch_break) {
            total_time_work -= floatDiffInMinutes(item.start_lunch_break, item.end_lunch_break)
          }

          return { ...item, total_time_work }
        })
      )
    }
  })

  const [compensatoryWDs, setCompensatoryWDs] = useState<CompensatoryWorkingDayData[]>([])
  useQuery<DataResponse<CompensatoryWorkingDayData>>([`1.0/user/compensatory-working-day`], {
    onSuccess: (data) => {
      setCompensatoryWDs(data.data)
    }
  })
  //   Click vào 1 cột
  const onCellClick = (cellData: any) => {
    if (cellData) {
      const data = {
        check_in_time: formatDateTime(
          convertDatetimeTZV2(cellData?.start_time || cellData?.date, systemSetting?.time_zone)
        ),
        check_out_time: formatDateTime(
          convertDatetimeTZV2(cellData?.end_time || cellData?.date, systemSetting?.time_zone)
        ),
        total_time_work: cellData?.total_time_work ? cellData?.total_time_work : 0,
        late_time: cellData?.late_time ? cellData.late_time : 0,
        time_early: cellData?.time_early ? cellData.time_early : 0,
        date: formatISODate(cellData?.date),
        timesheet_id: Number(cellData?.id) ? Number(cellData?.id) : undefined,
        overtime: cellData.overtime,
        leave_form_has_timesheets: cellData.leave_form_has_timesheets,
        compensatory_leave_has_timesheet: cellData.compensatory_leave_has_timesheet,
        employee_full_name: cellData.employee_full_name,
        employee_fullname: cellData.employee_fullname,
        total_time_work_without_time_off: cellData?.total_time_work_without_time_off
      }
      const checkStartOrEndTime = {
        start: cellData?.start_time ? false : true,
        end: cellData?.end_time ? false : true
      }
      setDataModel(data as TimesheetCalendarType)
      setCheckStartOrEndTimeNull(checkStartOrEndTime)

      setOpenDialog(true)
    }
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const daysColumns = daysInMonth.map((date, index) => {
    const dayName = formatDayV2(date)

    return {
      label: (
        <Box
          sx={{
            ...styleBoxDay,
            backgroundColor: bgColorMonth(date, workingDays)
          }}
        >
          <Typography sx={{ ...styleDayName, color: colorDayName(date, workingDays) }}>
            {dayName}
          </Typography>
          <Typography
            sx={{
              ...styleMonth
            }}
          >
            {date.getDate()}
            {isHoliday(date, holidays) && <HolidayStyled>H</HolidayStyled>}
            {isCompensatoryWorkingDay(date, compensatoryWDs) && <HolidayStyled>B</HolidayStyled>}
          </Typography>
        </Box>
      ),
      dataKey: 'timesheet-day',
      width: 100,
      //   Bỏ màu sắc
      flexGrow: 0,
      flexShrink: 0,
      headerStyle: { ...styleHeader },
      style: {
        margin: 0,
        height: '100%',
        flexBasis: 'auto !important'
      },
      cellRenderer: ({ rowData }: TableCellProps) => {
        let result: any
        for (const key in rowData.timesheets) {
          if (formatISODate(date) === formatISODate(key)) {
            const timesheet: TimeSheetData = rowData.timesheets[key]
            result = [{ ...timesheet, type_time: TIMESHEET_TYPE_TIME['WORKING_TIME'] }]

            if (timesheet.overtime) {
              const arrOTSalaryCoefficients: IArrOTSalaryCoefficients = {}

              timesheet?.overtime?.overtime_salary_coefficients?.forEach(
                (item: OvertimeSalaryCoefficientsType) => {
                  if (arrOTSalaryCoefficients[item.salary_coefficient]) {
                    arrOTSalaryCoefficients[item.salary_coefficient]['total_time_work'] +=
                      item.total_time_work
                  } else {
                    arrOTSalaryCoefficients[item.salary_coefficient] = {
                      total_time_work: item.total_time_work,
                      type_time: TIMESHEET_TYPE_TIME['OVERTIME'],
                      salary_coefficient: item.salary_coefficient
                    } as OvertimeSalaryCoefficientsType
                  }
                }
              )
              result.push(...Object.values(arrOTSalaryCoefficients))
            }

            if (timesheet.leave_form_has_timesheets) {
              timesheet.leave_form_has_timesheets.forEach(
                (leave_form_has_timesheet: LeaveFormHasTimesheetType) => {
                  result.push({
                    ...leave_form_has_timesheet,
                    type_time: TIMESHEET_TYPE_TIME['WORKING_TIME']
                  })
                }
              )
            }

            if (timesheet.compensatory_leave_has_timesheet) {
              result.push({
                ...timesheet.compensatory_leave_has_timesheet,
                type_time: TIMESHEET_TYPE_TIME['WORKING_TIME']
              })
            }
          }
        }

        return (
          <div
            style={{
              ...styleBoxTimeLine
            }}
            onClick={() =>
              onCellClick({
                ...(result && result[0] ? result[0] : { date }), // Add a conditional check here
                employee_full_name: rowData.fullname
              })
            }
            aria-hidden
          >
            {result && result.length > 0 ? (
              <Stack
                direction="row"
                gap={0.5}
                sx={{
                  maxWidth: '98px',
                  display: 'flex',
                  padding: 0
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, paddingX: 1, cursor: 'pointer' }}>
                  {result.map((item: any, index: number) => (
                    <ManagementTimesheetTimeLine
                      key={index}
                      total_time={Number(item.total_time_work)}
                      total_time_work_without_time_off={item?.total_time_work_without_time_off}
                      event={item}
                      coefficientSalaryOT={item?.salary_coefficient}
                    />
                  ))}
                </Box>
              </Stack>
            ) : !isDayOff(date, workingDays) ? (
              <StatusDay>N</StatusDay>
            ) : (
              isPast(date) && <StatusDay>X</StatusDay>
            )}
          </div>
        )
      }
    }
  })

  const totalColumns = ['total_time_work', 'total_early_time', 'total_late_time'].map(
    (date, index) => {
      return {
        label: t(`timesheet.${date}`),
        dataKey: ' ',
        width: 180,
        flexGrow: 0,
        flexShrink: 0,
        headerStyle: {
          ...headerStyleTotal // Thêm thuộc tính textTransform ở đây
        },
        // headerStyle: { backgroundColor: index % 2 ? grey['400'] : grey['200'] },
        style: {
          ...styleTotalColumns
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cellRenderer: ({ rowData }: any) => {
          return <TextTimeStyled>{minutesToOnlyHours(rowData[date as string])}h</TextTimeStyled>
        }
      }
    }
  )
  const [checkStartOrEndTimeNull, setCheckStartOrEndTimeNull] =
    useState<checkStartOrEndTimeNullType>({
      start: false,
      end: false
    })

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        label: t('menu.employee'),
        width: 250,
        dataKey: 'fullname',
        headerStyle: { ...styleHeader },
        cellRenderer: ({ rowData }) => {
          return (
            <TimesheetEmployee
              employee_code={rowData?.employee_code}
              avatar={rowData.avatar}
              fullname={rowData.fullname}
              job={rowData.job_position}
            />
          )
        },
        style: { ...styleColumnName }
      },

      ...totalColumns,
      {
        label: t('timesheet.total_time_ot'),
        dataKey: 'timesheet-ot',
        width: 180,
        flexGrow: 0,
        flexShrink: 0,
        style: {
          ...styleColumntOt
        },
        headerStyle: { ...styleHeader },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cellRenderer: ({ rowData }) => {
          const arrTotalTimeOT = Object.entries(rowData.total_time_ot).sort(
            ([a, value1]: [string, unknown], [b, value2]: [string, unknown]) =>
              Number(a) - Number(b)
          )

          return (
            <Stack direction="row" gap={0.5} sx={{ ...styleTextOT }}>
              {arrTotalTimeOT.map(([key, value], index) => (
                <ManagementTimesheetTimeLine
                  key={index}
                  total_time={Number(value)}
                  event={{ type_time: TIMESHEET_TYPE_TIME['OVERTIME'] } as TimeSheetData}
                  coefficientSalaryOT={key}
                  checktotalOTTable={true}
                />
              ))}
            </Stack>
          )
        }
      },
      ...daysColumns
    ],
    [daysColumns, t]
  )

  return (
    <Box>
      <ReactVirtualizedTableWithToolBar
        endpoint={`${V1}/user/timesheets/${params.month}`}
        onRowClick={() => {}}
        headerHeight={70}
        rowHeight={70}
        width={daysInMonth.length * 100 + 180 * 4 + 250}
        columns={columns}
        params={params}
        title={`${t('menu.timesheet')} ${formatNormalDate(daysInMonth[0])} ${t(
          'application_form.to'
        )} ${formatNormalDate(daysInMonth[daysInMonth.length - 1])}`}
        headerOptions={<ManagementTimesheetHeader onChangeTime={setMonth} hasColorNote={true} />}
        quickSearchField={{ accessor: 'employee_name' }}
        headerStyle={{
          ...headerStyleReactTool
        }}
        serachField={[]}
        data={undefined}
      />
      <TimekeepingModal
        isDisplayFormAction={false}
        data={dataModel}
        open={openDialog}
        handleClose={handleClose}
        checkStartOrEndTimeNull={checkStartOrEndTimeNull}
        calendar={month}
      />
    </Box>
  )
}

const StatusDay = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  zIndex: 100,
  [theme.breakpoints.down('md')]: {
    fontSize: 14
  }
}))

export const TextTimeStyled = styled(Typography)(({ theme }) => ({
  marginTop: 'auto',
  marginBottom: 'auto',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px'
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '14px'
  }
}))

const styleTextOT = {
  display: 'flex',
  textAlign: 'center',
  width: '100%',
  justifyContent: 'center'
}
const headerStyleReactTool = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  margin: 0,
  justifyContent: 'center'
}
const headerStyleTotal = {
  backgroundColor: blueV2[20],
  height: '70px',
  margin: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textTransform: 'initial' as TextTransform
}
// Để kiểu của overflowX là 'string | undefined'
const styleColumntOt = {
  flex: '0 0 180px',
  margin: 0,
  border: `1px ${grey['200']} solid`,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  flexBasis: 'auto !important',
  overflowX: 'auto' as 'auto' // hoặc overflowX: 'auto' hoặc overflowX: 'hidden'
}

const styleColumnName = {
  margin: 0,
  padding: 8,
  borderBottom: `1px ${grey['200']} solid`,
  height: '100%',
  borderRight: `1px ${grey['200']} solid`
}

const styleTotalColumns = {
  margin: 0,
  flex: '0 0 180px',
  border: `1px ${grey['200']} solid`,
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexBasis: 'auto !important'
}
const styleBoxTimeLine = {
  flex: '0 0 180px',
  margin: 0,
  border: `1px ${grey['200']} solid`,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  justifyContent: 'center',
  overflowX: 'scroll' as 'scroll'
}
const styleDayName = {
  minWidth: '40px',
  textAlign: 'center',
  fontSize: { xs: 14, sm: 18 },
  fontWeight: 700,
  color: 'var(--base-black, #111)',
  lineHeight: '28px'
}

const styleHeader = {
  backgroundColor: blueV2[20],
  height: '70px',
  margin: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textTransform: 'initial' as TextTransform
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
const styleBoxDay = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '2px 10px',
  alignItems: 'center',
  cursor: 'pointer',
  borderRadius: '8px'
}
