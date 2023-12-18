import { Typography } from '@mui/material'
import { DatePickerManager } from 'components/Form/Input/DatePickerManager'
import ReactTableWithTooBarManager, { TabTitle } from 'components/ReactTable/ManageReactTableWithToolbar/ReactTableWithTooBarManager'
import { Status } from 'components/Status/Status'
import { TabBase, TabElement } from 'components/Tab/TabBase'
import { useAtom, useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { monthCalendarAtom } from 'lib/atom/calendarAtom'
import { searchParamsAtom } from 'lib/atom/searchAtom'
import { KEY_SCREEN, LeaveFormType, STATUS_MANAGE_FORM_OPTIONS, TYPE_FORM } from 'lib/types/applicationForm'
import { convertDatetimeTZ, convertDatetimeTZWithoutSecond, convertFormatDate, formatDateTime, formatTime, formatYearMonth } from 'lib/utils/format'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { CellValue, Column, Row } from 'react-table'
import { ElipsisBox } from 'screen/compensatoryLeave/CompensatoryLeaveApplication'
import { TimeSheetProps } from 'screen/timesheet/TimeSheet'
import { TimesheetEmployee } from 'screen/timesheet/components/TimesheetEmployee'
import { ModalUpdateStatusRequestTime } from '../ModalUpdateStatusRequestTime'

const ManagerRequestChangeTimesheetApplication = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const systemSetting: any = useAtomValue(systemSettingAtom)

  const [monthAtom, setMonthAtom] = useAtom(monthCalendarAtom)
  const location: any = useLocation()
  const [searchParams] = useAtom(searchParamsAtom)
  const TabTitle: TabTitle[] = [
    {
      title: <Typography variant="subtitle1">{t('application_form.await_confirm')}</Typography>
    },
    {
      title: <Typography variant="subtitle1">{t('application_form.processed')}</Typography>
    }
  ]
  const [tabIndex, setTabIndex] = useState<number>(location?.state?.tabIndex ?? 0)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const handleChangeTab = (tabValue: number) => {
    setTabIndex(tabValue)
    navigate('', { state: { tabIndex: tabValue } })
  }

  const { control, watch } = useForm<TimeSheetProps>({
    defaultValues: {
      month: monthAtom ?? ''
    }
  })
  const columns = useMemo<Column<LeaveFormType>[]>(
    () => [
      {
        Header: t('order_number') as string,
        // @ts-ignore
        accessor: (original, index) => index + 1,
        display: true,
        Cell: ({ cell }: { cell: CellValue }) => {
          return <Typography>{cell.value}</Typography>
        }
      },
      {
        Header: t('information.name'),
        accessor: 'employee_name',
        display: true,
        Cell: ({ row }: { row: any }) => (
          <TimesheetEmployee
            employee_code={row.original.card_number}
            avatar={row.original?.thumbnail_url}
            fullname={row.original.employee_name}
            job={row.original?.job_position?.name}
          />
        )
      },
      {
        Header: t('application_form.date'),
        accessor: 'date',
        Cell: ({ row }) => `${convertFormatDate(row.original.date, systemSetting.format_date)}`,
        display: true,
        is_tooltip: true
      },
      {
        Header: t('application_form.hour'),
        accessor: 'start_time',
        Cell: ({ row }) => (
          <>
            {`${formatTime(
              convertDatetimeTZ(row.original.check_in_time || '', systemSetting?.time_zone)
            )} - ${formatTime(
              convertDatetimeTZ(row.original.check_out_time || '', systemSetting?.time_zone)
            )}`}
          </>
        ),
        display: true,
        is_tooltip: true
      },
      {
        Header: t('application_form.note'),
        accessor: 'note',
        Cell: ({ row }) => <ElipsisBox sx={{ width: '6vw' }}>{row.original.note}</ElipsisBox>,
        display: true,
        is_tooltip: true
      },
      // {
      //   Header: t('application_form.status'),
      //   accessor: 'status_model_has_approve',
      //   Cell: ({ value }) => <Status value={value} />,
      //   display: true
      // },
      {
        Header: t('application_form.status_form'),
        accessor: 'status',
        Cell: ({ value }) => <Status value={value} />,
        display: true
      },
      {
        Header: t('application_form.created_at'),
        accessor: 'created_at',
        display: true,
        Cell: ({ row }) =>
          convertDatetimeTZWithoutSecond(
            row.original.created_at,
            systemSetting.time_zone,
            systemSetting.format_date
          ),
        is_tooltip: true
      }
    ],
    []
  )

  const searchFields = [
    {
      Header: t('information.card_number'),
      accessor: 'card_number',
      searchType: 'text',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('date'),
      accessor: 'date',
      searchType: 'date-picker',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    }
  ]

  const searchFiledsApproved = [
    ...searchFields,
    {
      Header: t('application_form.status'),
      accessor: 'status',
      additionSearchProps: {
        options: STATUS_MANAGE_FORM_OPTIONS
      },
      searchType: 'select',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    }
    // {
    //   Header: t('application_form.status_approver'),
    //   accessor: 'status_model_has_approve',
    //   additionSearchProps: {
    //     options: STATUS_MANAGE_FORM_OPTIONS
    //   },
    //   searchType: 'select',
    //   regex: 'none',
    //   grid: { xs: 12, sm: 6, md: 6 },
    //   display: true
    // }
  ]

  useEffect(() => {
    setMonthAtom(watch('month') as string)
  }, [watch('month'), setMonthAtom])

  const onRowClick = ({ original }: Row<LeaveFormType>) => {
    setIdEdit(original.id)
    setOpenEdit(true)
  }
  const handleClose = () => {
    setOpenEdit(false)
  }
  const onSuccess = () => {
    setUpdateSuccess(!updateSuccess)
    setIdEdit(null)
  }
  const month: number = new Date(monthAtom).getMonth() + 1

  const tabElement: TabElement[] = [
    {
      title: <Typography variant="subtitle1">{t('application_form.await_confirm')}</Typography>,
      element: (
        <ReactTableWithTooBarManager
          sxCustom={{
            paddingLeft: '0px !important',
            paddingRight: '0px !important',
            width: '100% important'
          }}
          tabTitle={TabTitle}
          paperOptions={{ elevation: 0 }}
          searchColumns={searchFields}
          endpoint="1.0/user/manager/form"
          edit={updateSuccess}
          tabIndex={location?.state?.tabIndex ?? 0}
          setTabChange={handleChangeTab}
          quickSearchField={{ accessor: 'employee_name' }}
          params={{
            ...searchParams,
            type: TYPE_FORM.REQUEST_CHANGE_TIMESHEET,
            key_screen: KEY_SCREEN['AWAITING_CONFIRM'],
            ...(monthAtom && {
              month: formatYearMonth(
                new Date(monthAtom).getMonth() + 1,
                new Date(monthAtom).getFullYear()
              )
            })
          }}
          columns={columns}
          onRowClick={onRowClick}
          data={[]}
          title={`${t('application_management.request_change_timesheet_management_breadcrumb')}`}
          leftHeader={
            <DatePickerManager
              name="month"
              fullWidth
              views={['year', 'month']}
              maxDate={new Date()}
              control={control}
              size="small"
            />
          }
        />
      )
    },
    {
      title: <Typography variant="subtitle1">{t('application_form.processed')}</Typography>,
      element: (
        <ReactTableWithTooBarManager
          sxCustom={{
            paddingLeft: '0px !important',
            paddingRight: '0px !important',
            width: '100% important'
          }}
          tabTitle={TabTitle}
          edit={updateSuccess}
          tabIndex={location?.state?.tabIndex ?? 0}
          setTabChange={handleChangeTab}
          quickSearchField={{ accessor: 'employee_name' }}
          paperOptions={{ elevation: 0 }}
          searchColumns={searchFiledsApproved}
          endpoint="1.0/user/manager/form"
          params={{
            ...searchParams,
            type: TYPE_FORM.REQUEST_CHANGE_TIMESHEET,
            key_screen: KEY_SCREEN['PROCESSED'],
            ...(monthAtom && {
              month: formatYearMonth(
                new Date(monthAtom).getMonth() + 1,
                new Date(monthAtom).getFullYear()
              )
            })
          }}
          columns={columns}
          onRowClick={onRowClick}
          data={[]}
          title={`${t('application_management.request_change_timesheet_management_breadcrumb')}`}
          leftHeader={
            <DatePickerManager
              fullWidth
              name="month"
              views={['year', 'month']}
              control={control}
              defaultValue={monthAtom ? formatDateTime(formatDateTime(monthAtom)) : ''}
              size="small"
            />
          }
        />
      )
    }
  ]

  return (
    <>
      <TabBase tabElement={tabElement} tabValue={tabIndex} />
      <ModalUpdateStatusRequestTime
        open={openEdit}
        key={idEdit}
        idEdit={idEdit}
        handleCloseModal={handleClose}
        onSuccessEdit={onSuccess}
      />
    </>
  )
}

export { ManagerRequestChangeTimesheetApplication }

