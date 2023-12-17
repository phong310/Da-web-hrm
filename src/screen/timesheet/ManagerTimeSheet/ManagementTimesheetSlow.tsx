import { Box, Stack, styled, Typography } from '@mui/material'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
// import { TIMESHEET_TYPE_TIME } from 'constants'
import { V1 } from 'constants/apiVersion'
import { TIMESHEET_TYPE_TIME } from 'constants/timeSheetType'
import { useAuth } from 'lib/hook/useAuth'
import { HolidayType } from 'lib/types/applicationForm'
import {
    LeaveFormHasTimesheetType,
    OvertimeSalaryCoefficientsType,
    TimesheetCalendarType,
    TimeSheetData
} from 'lib/types/timeSheet'
import { isPast, isWeekend, minutesToOnlyHours } from 'lib/utils/datetime'
import {
    convertDatetimeTZ,
    formatDate,
    formatDateTime,
    formatDay,
    formatISODate,
    formatNormalDate,
    formatYearMonth,
    getAllDaysInMonth
} from 'lib/utils/format'
import { useCallback, useMemo, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Cell, Column, Row } from 'react-table'
import { TimesheetEmployee } from '../components/TimesheetEmployee'
import { TimekeepingModal } from '../TimeKeepingModal'
import { colorDayName1 } from '../timesheetLib'
import { ManagementTimesheetHeader } from './ManagementTimesheetHeader'
import { ManagementTimesheetTimeLine } from './ManagementTimesheetTimeLine'
type HolidayRespon = {
  data: HolidayType[]
}

export interface IArrOTSalaryCoefficients {
  [key: string]: OvertimeSalaryCoefficientsType
}

const ManagementTimesheetSlow = () => {
  const [month, setMonth] = useState(new Date())
  const { t } = useTranslation()
  const params: Record<string, unknown> = {
    month: formatYearMonth(new Date(month).getMonth() + 1, new Date(month).getFullYear()),
    per_page: 10
  }

  const { user, systemSetting } = useAuth()
  const navigate = useNavigate()

  const daysInMonth = getAllDaysInMonth(
    new Date(month).getMonth() + 1,
    new Date(month).getFullYear()
  )

  const [openDialog, setOpenDialog] = useState(false)
  const [dataModel, setDataModel] = useState<TimesheetCalendarType>({} as any)

  const handleClose = () => {
    setOpenDialog(false)
  }
  const [holidays, setHolidays] = useState<HolidayType[]>([])
  useQuery<HolidayRespon>([`1.0/user/holiday`], {
    onSuccess: (data) => {
      setHolidays(data.data)
    }
  })

  const dayColumns = daysInMonth.map((date) => {
    const dayName = formatDay(date)
    return {
      Header: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography
            sx={{
              minWidth: '40px',
              textAlign: 'center',
              fontSize: { xs: 14, sm: 16 }
            }}
          >
            {dayName}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: {
                sm: '18px',
                xs: '14px'
              },
              lineHeight: '24px',
              color: colorDayName1(date),
              position: 'relative'
            }}
          >
            {date.getDate()}
            {/* {isHoliday(date, holidays) && <HolidayStyled>H</HolidayStyled>} */}
          </Typography>
        </Box>
      ),
      accessor: String(date),
      style: {
        justifyContent: 'center'
      },
      Cell: ({ row }: any) => {
        let result: any
        for (const key in row.original.timesheets) {
          if (formatISODate(date) === formatISODate(key)) {
            const timesheet: TimeSheetData = row.original.timesheets[key]
            result = [{ ...timesheet, type_time: TIMESHEET_TYPE_TIME['WORKING_TIME'] }]

            if (timesheet.overtime) {
              const arrOTSalaryCoefficients: IArrOTSalaryCoefficients = {}

              timesheet?.odvertime?.overtime_salary_coefficients?.forEach(
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
          <>
            {result ? (
              <Stack
                direction="row"
                gap={0.5}
                sx={{
                  maxHeight: '88px',
                  width: '100%',
                  '&:hover': {
                    cursor: 'pointer'
                  },
                  'button:hover': {
                    cursor: 'pointer'
                  }
                }}
              >
                {result.map((item: any, index: number) => (
                  <ManagementTimesheetTimeLine
                    key={index}
                    total_time={
                      item?.time_off ? Number(item.time_off) : Number(item.total_time_work)
                    }
                    event={item}
                    coefficientSalaryOT={item?.salary_coefficient}
                  />
                ))}
              </Stack>
            ) : isWeekend(date) ? (
              ''
            ) : (
              isPast(date) && <TextTimeStyled>x</TextTimeStyled>
            )}
          </>
        )
      },
      display: true
    }
  })

  const columns = useMemo<Column[]>(
    () => [
      {
        Header: t('menu.employee'),
        accessor: 'employee',
        disableGroupBy: true,
        fixed: 'left',
        Cell: ({ row }) => (
          <TimesheetEmployee
            avatar=""
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fullname={row.original.fullname}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            job={row.original.job_position}
          />
        )
      },
      ...dayColumns,
      {
        Header: t('timesheet.total_time_ot'),
        accessor: ' ',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Cell: ({ row }: any) => {
          const arrTotalTimeOT = Object.entries(row.original.total_time_ot).sort(
            ([a, value1]: [string, unknown], [b, value2]: [string, unknown]) =>
              Number(a) - Number(b)
          )

          return (
            <Stack direction="row" gap={0.5} sx={{ maxHeight: '88px', width: '100%' }}>
              {arrTotalTimeOT.map(([key, value], index) => (
                <ManagementTimesheetTimeLine
                  key={index}
                  total_time={Number(value)}
                  event={{ type_time: TIMESHEET_TYPE_TIME['OVERTIME'] } as TimeSheetData}
                  coefficientSalaryOT={key}
                />
              ))}
            </Stack>
          )
        },

        style: {
          justifyContent: 'center'
        },
        display: true
      },
      {
        Header: t('timesheet.total_late_time'),
        accessor: 'total_late_time',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Cell: ({ row }: any) => {
          return (
            <TextTimeStyled>{minutesToOnlyHours(row.original.total_late_time)}h</TextTimeStyled>
          )
        },
        style: {
          justifyContent: 'center'
        },
        display: true
      },
      {
        Header: t('timesheet.total_early_time'),
        accessor: 'total_early_time',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Cell: ({ row }: any) => {
          return (
            <TextTimeStyled>{minutesToOnlyHours(row.original.total_early_time)}h</TextTimeStyled>
          )
        },
        style: {
          justifyContent: 'center'
        },
        display: true
      },
      {
        Header: t('timesheet.total_working_time'),
        accessor: 'total_working_time',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Cell: ({ row }: any) => {
          return (
            <TextTimeStyled>{minutesToOnlyHours(row.original.total_time_work)}h</TextTimeStyled>
          )
        },
        style: {
          justifyContent: 'center'
        },
        display: true
      }
    ],
    [dayColumns, t]
  )

  const onRowClick = ({ original }: Row<TimeSheetData>) => {
    navigate('/time-keeping/timesheet/edit/' + original.id)
  }

  const onCellClick = useCallback((cell: Cell<TimeSheetData>) => {
    // setOpenDialog(true)
    // get all key of timesheet ['date','date']
    const timesheetArr = cell.row.original.timesheets
    const dateArrOfTimesheet = Object.keys(timesheetArr)

    // git date of selected cell
    const dateOfCell = formatDate(cell.column.id, 'yyyy-MM-dd')

    // find index of timesheet array
    const timesheetId = dateArrOfTimesheet.indexOf(dateOfCell)

    // get data
    const data = Object.values(timesheetArr)[timesheetId] as TimeSheetData

    if (data) {
      const itemData = {
        check_in_time: formatDateTime(
          convertDatetimeTZ(data?.start_time || data?.date, systemSetting?.time_zone)
        ),
        check_out_time: formatDateTime(
          convertDatetimeTZ(data?.end_time || data?.date, systemSetting?.time_zone)
        ),
        total_time_work: data?.total_time_work,
        late_time: data.late_time,
        time_early: data.time_early,
        date: formatISODate(data?.date),
        timesheet_id: Number(data?.id) ? Number(data?.id) : undefined,
        overtime: data.overtime,
        leave_form_has_timesheets: data.leave_form_has_timesheets,
        compensatory_leave_has_timesheet: data.compensatory_leave_has_timesheet,
        employee_full_name: cell.row.original.fullname
      }
      setDataModel(itemData as TimesheetCalendarType)
      setOpenDialog(true)
    }
  }, [])

  return (
    <>
      <Stack
        direction="row"
        sx={{
          '& ::-webkit-scrollbar': { width: 2, height: 8 },
          '& ::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 4
          }
        }}
      >
        <Stack
          sx={{
            flex: 1,
            width: 'calc(100vw - 300px)'
          }}
        >
          <ReactTableWithToolBar
            onCellClick={onCellClick}
            endpoint={`${V1}/user/timesheets/${params.month}`}
            columns={columns}
            params={params}
            data={[]}
            // selection
            title={`${t('menu.timesheet')} ${formatNormalDate(daysInMonth[0])} ${t(
              'application_form.to'
            )} ${formatNormalDate(daysInMonth[daysInMonth.length - 1])}`}
            headerOptions={
              <ManagementTimesheetHeader onChangeTime={setMonth} hasColorNote={true} />
            }
            isTableCalendar={true}
            quickSearchField={{ accessor: 'employee_name' }}
          />
        </Stack>
      </Stack>
      <TimekeepingModal
        isDisplayFormAction={false}
        data={dataModel}
        open={openDialog}
        handleClose={handleClose}
        calendar={''}
      />
    </>
  )
}

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

export { ManagementTimesheetSlow }

