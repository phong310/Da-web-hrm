import { Grid } from '@mui/material'
import { DatePicker } from 'components/Form/Input/DatePicker'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import { CustomPagination } from 'components/Pagination/CustomPagination'
import { EmptyTable } from 'components/ReactTable/EmptyTable'
import { V1 } from 'constants/apiVersion'
import { t } from 'i18next'
import { useAtom } from 'jotai'
import { monthCalendarAtom } from 'lib/atom/calendarAtom'
import { usePaginationQuery } from 'lib/hook/usePaginationQuery'
import { MONTH_NAME } from 'lib/utils/contants'
import { formatYearMonth } from 'lib/utils/format'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { LeaveAppBlockInformation, LeaveAppBlockInformationProps } from 'screen/application/LeaveAppBlockInformation'
import { TimeSheetProps } from 'screen/timesheet/TimeSheet'

const ListEmployeeLeaveApplication = () => {
  const [monthAtom, setMonthAtom] = useAtom(monthCalendarAtom)

  const { control, watch } = useForm<TimeSheetProps>({
    defaultValues: {
      month: monthAtom
    }
  })
  const month: number = new Date(monthAtom).getMonth() + 1

  const {
    paginationData: { data: listLeaveAppIn4, pageCount: pageCount },
    handleChangeParams,
    handleAddParams,
    isLoading: isLoadingListApp
  } = usePaginationQuery<{ data: LeaveAppBlockInformationProps[] }>(
    `${V1}/user/leave-form/information`,
    {
      per_page: 20,
      month: formatYearMonth(
        new Date(watch('month')).getMonth() + 1,
        new Date(watch('month')).getFullYear()
      )
    }
  )
  const _handleChangeParams = (value: number) => {
    if (listLeaveAppIn4.length) {
      handleChangeParams({
        page: value,
        month: formatYearMonth(
          new Date(watch('month')).getMonth() + 1,
          new Date(watch('month')).getFullYear()
        )
      })
    }
  }

  useEffect(() => {
    setMonthAtom(watch('month') as string)
    handleAddParams({
      month: formatYearMonth(
        new Date(watch('month')).getMonth() + 1,
        new Date(watch('month')).getFullYear()
      )
    })
  }, [watch('month'), setMonthAtom])

  return (
    <Pagev2
      titleNew={`${t('menu.employee_application')} ${t(MONTH_NAME[month])}`}
      leftHeader={
        <DatePicker
          name="month"
          fullWidth
          views={['year', 'month']}
          maxDate={new Date()}
          control={control}
          defaultValue={monthAtom}
          size="small"
        />
      }
    >
      {/* <h1>No Data</h1> */}
      {!listLeaveAppIn4.length ? (
        <EmptyTable />
      ) : (
        <>
          <Grid container spacing={{ xs: 0, md: 2 }}>
            {listLeaveAppIn4.map((item: any, index) => (
              <Grid item xs={12} xl={6} key={index}>
                <LeaveAppBlockInformation
                  full_name={item.full_name}
                  thumbnail_url={item.thumbnail_url}
                  start_time={item.start_time}
                  end_time={item.end_time}
                  kind_of_leave={item.kind_of_leave}
                  in_day={item.in_day}
                  created_at={item.created_at}
                />
              </Grid>
            ))}
          </Grid>
          <CustomPagination pageCount={pageCount} onChange={_handleChangeParams} />
        </>
      )}
    </Pagev2>
  )
}

export { ListEmployeeLeaveApplication }

