import { Box, styled, Typography } from '@mui/material'
import ReactTableWithToolBarv2 from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBarv2'
import { V1 } from 'constants/apiVersion'
import { TIMESHEET_TYPE, TIMESHEET_TYPE_TIME } from 'constants/timeSheetType'
import { HolidayType } from 'lib/types/applicationForm'
import { WorkingDayData } from 'lib/types/timeSheet'
import { isDayOff, isHoliday, isPast } from 'lib/utils/datetime'
import { formatDayV2, formatISODate, formatNormalDate, formatYearMonth, getAllDaysInMonth } from 'lib/utils/format'
import { floatDiffInMinutes } from 'lib/utils/number_leave_day'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Column } from 'react-table'
import { WorkingDayResponse } from 'screen/timesheet/Calender/TimeSheetCalendar'
import { ManagementTimesheetHeader } from 'screen/timesheet/ManagerTimeSheet/ManagementTimesheetHeader'
import { TimeSheetTimeline } from 'screen/timesheet/TimeSheetTimeline'
import { TimesheetEmployee } from 'screen/timesheet/components/TimesheetEmployee'
import { colorDayName, HolidayStyled } from 'screen/timesheet/timesheetLib'

type HolidayRespon = {
  data: HolidayType[]
}

const ManagementTimesheetLog =  () => {
  const [month, setMonth] = useState(new Date())
  const { t } = useTranslation()
  const params: Record<string, unknown> = {
    month: formatYearMonth(new Date(month).getMonth() + 1, new Date(month).getFullYear())
  }
  // @ts-ignore
  const navigate = useNavigate()

  const daysInMonth = getAllDaysInMonth(
    new Date(month).getMonth() + 1,
    new Date(month).getFullYear()
  )

  const [holidays, setHolidays] = useState<HolidayType[]>([])
  useQuery<HolidayRespon>([`1.0/user/holiday`], {
    onSuccess: (data) => {
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

  const dayColumns = daysInMonth.map((date) => {
    const dayName = formatDayV2(date)
    return {
      Header: (
        <Box
          sx={{
            ...BoxStyleDay
          }}
        >
          <Typography
            sx={{
              ...styleDayName
            }}
          >
            {dayName}
          </Typography>
          <Typography
            sx={{
              color: colorDayName(date, workingDays),
              fontWeight: 700,
              fontSize: {
                sm: '18px',
                xs: '14px'
              },
              lineHeight: '24px',
              position: 'relative'
            }}
          >
            {date.getDate()}
            {isHoliday(date, holidays) && <HolidayStyled>H</HolidayStyled>}
          </Typography>
        </Box>
      ),
      accessor: String(date),
      Cell: ({ row }: any) => {
        let event: any
        for (const key in row.original.timesheetLog) {
          if (formatISODate(date) === formatISODate(key)) {
            event = {
              ...row.original.timesheetLog[key],
              type_time: TIMESHEET_TYPE_TIME['WORKING_TIME'],
              type: TIMESHEET_TYPE['NORMAL']
            }
          }
        }
        return (
          <>
            {event ? (
              <TimeSheetTimeline event={event} />
            ) : !isDayOff(date, workingDays) ? (
              <TextTimeStyled>N</TextTimeStyled>
            ) : (
              isPast(date) && <TextTimeStyled>X</TextTimeStyled>
            )}
          </>
        )
      },
      style: {
        justifyContent: 'center'
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
        Cell: ({ row }) => (
          <TimesheetEmployee
            // @ts-ignore
            avatar={row.original?.avatar}
            // @ts-ignore
            fullname={row.original.fullname}
            // @ts-ignore
            job={row.original.job_position}
            // @ts-ignore
            employee_code={row.original?.employee_code}
          />
        ),
        style: {
          justifyContent: 'center'
        }
      },
      ...dayColumns
    ],
    [dayColumns, t]
  )

  return (
    <Box sx={{ ...styleTable }}>
      <ReactTableWithToolBarv2
        endpoint={`${V1}/user/timesheet-log/${params.month}`}
        columns={columns}
        // params={params}
        data={[]}
        title={`${t('menu.timesheet')} ${formatNormalDate(daysInMonth[0])} ${t(
          'application_form.to'
        )} ${formatNormalDate(daysInMonth[daysInMonth.length - 1])}`}
        headerOptions={<ManagementTimesheetHeader onChangeTime={setMonth} />}
        isTableCalendar={true}
        quickSearchField={{ accessor: 'employee_name' }}
      />
    </Box>
  )
}

const TextTimeStyled = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px'
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '18px'
  }
}))

const styleTable = {
  '& ::-webkit-scrollbar': { width: 2, height: 8 },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: '#f0f0f0'
  }
}

const BoxStyleDay = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}
const styleDayName = {
  minWidth: '40px',
  textAlign: 'center',
  fontSize: { xs: 14, sm: 16 }
}
export { ManagementTimesheetLog  }

