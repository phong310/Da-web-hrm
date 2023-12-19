import { Typography } from '@mui/material'
import { SelectOption } from 'components/Form/Autocomplete/Select'
import { DatePickerManager } from 'components/Form/Input/DatePickerManager'
import ReactTableWithTooBarManager, { TabTitle } from 'components/ReactTable/ManageReactTableWithToolbar/ReactTableWithTooBarManager'
import { Status } from 'components/Status/Status'
import { TabElement } from 'components/Tab/TabBase'
import { TabBaseManager } from 'components/Tab/TabBaseManager'
import { V1 } from 'constants/apiVersion'
import { useAtom, useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { monthCalendarAtom } from 'lib/atom/calendarAtom'
import { searchParamsAtom } from 'lib/atom/searchAtom'
import { KEY_SCREEN, KindOfLeaveType, LeaveFormType, STATUS_MANAGE_FORM_OPTIONS, TYPE_FORM } from 'lib/types/applicationForm'
import { KIND_OF_LEAVE_TYPES } from 'lib/utils/contants'
import { convertDatetimeTZWithoutSecond, formatDateTime, formatYearMonth } from 'lib/utils/format'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { CellValue, Column, Row } from 'react-table'
import { TimeSheetProps } from 'screen/timesheet/TimeSheet'
import { TimesheetEmployee } from 'screen/timesheet/components/TimesheetEmployee'
import { ElipsisBox } from '../CompensatoryLeaveApplication'
import { ModalUpdateStatusCompenSatory } from '../ModalUpdateStatusCompenSatory'


const ManagerCompensatoryLeaveApplication = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const [monthAtom, setMonthAtom] = useAtom(monthCalendarAtom)
  const [searchParams] = useAtom(searchParamsAtom)
  const location: any = useLocation()
  const [tabIndex, setTabIndex] = useState<number>(location?.state?.tabIndex ?? 0)
  const [checkEditSuccess, setCheckEditSuccess] = useState<boolean>(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const TabTitle: TabTitle[] = [
    {
      title: <Typography variant="subtitle1">{t('application_form.await_confirm')}</Typography>
    },
    {
      title: <Typography variant="subtitle1">{t('application_form.processed')}</Typography>
    }
  ]
  const handleChangeTab = (tabValue: number) => {
    setTabIndex(tabValue)
    navigate('', { state: { tabIndex: tabValue } })
  }

  const { control, watch } = useForm<TimeSheetProps>({
    defaultValues: {
      month: monthAtom ?? ''
    }
  })

  const [reasons, setReasons] = useState<SelectOption[]>()
  useQuery<{ data: KindOfLeaveType[] }>(
    [`${V1}/user/kind-of-leave`, { type_equal: KIND_OF_LEAVE_TYPES['COMPENSATORY_LEAVE'] }],
    {
      onSuccess: (data) => {
        setReasons(() =>
          data.data.map((kol: KindOfLeaveType) => {
            return {
              label: kol.name,
              value: kol.id
            }
          })
        )
      }
    }
  )

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
        Header: t('start_time'),
        accessor: 'start_time',
        Cell: ({ row }) => {
          return convertDatetimeTZWithoutSecond(
            row.original.start_time,
            systemSetting.time_zone,
            systemSetting.format_date
          )
        },
        display: true,
        is_tooltip: true
      },
      {
        Header: t('end_time'),
        accessor: 'end_time',
        Cell: ({ row }) => {
          return convertDatetimeTZWithoutSecond(
            row.original.end_time,
            systemSetting.time_zone,
            systemSetting.format_date
          )
        },
        display: true,
        is_tooltip: true
      },
      {
        Header: t('application_form.kind_of_leave'),
        accessor: 'kind_of_leave',
        Cell: ({ row }) => <ElipsisBox width="5vw">{row.original?.kind_of_leave?.name}</ElipsisBox>,
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
        Cell: ({ row }) =>
          `${convertDatetimeTZWithoutSecond(
            row.original.created_at,
            systemSetting.time_zone,
            systemSetting.format_date
          )}`,
        display: true,
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
      Header: t('start_time'),
      accessor: 'start_time',
      searchType: 'date-picker',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('end_time'),
      accessor: 'end_time',
      searchType: 'date-picker',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('application_form.kind_of_leave'),
      accessor: 'kind_of_leave',
      additionSearchProps: {
        options: reasons
      },
      searchType: 'select',
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
    // navigate('/applications/manager/compensatory-leaves/' + original.id)
    setOpenEdit(true)
    setIdEdit(original.id)
  }
  const tabElement: TabElement[] = [
    {
      title: <Typography variant="body1">{t('application_form.await_confirm')}</Typography>,
      element: (
        <ReactTableWithTooBarManager
          sxCustom={{
            paddingLeft: '0px !important',
            paddingRight: '0px !important',
            width: '100% important'
          }}
          edit={checkEditSuccess}
          tabIndex={location?.state?.tabIndex ?? 0}
          paperOptions={{ elevation: 0 }}
          quickSearchField={{ accessor: 'employee_name' }}
          searchColumns={searchFields}
          tabTitle={TabTitle}
          endpoint="1.0/user/manager/form"
          params={{
            ...searchParams,
            type: TYPE_FORM['COMPENSATORY_LEAVE'],
            key_screen: KEY_SCREEN['AWAITING_CONFIRM'],
            ...(monthAtom?.length > 0 && {
              month: formatYearMonth(
                new Date(monthAtom).getMonth() + 1,
                new Date(monthAtom).getFullYear()
              )
            })
          }}
          columns={columns}
          setTabChange={handleChangeTab}
          onRowClick={onRowClick}
          data={[]}
          title={`${t('application_management.compensatory_leave_management_breadcrumb')}`}
          leftHeader={
            <DatePickerManager
              name="month"
              fullWidth
              views={['year', 'month']}
              maxDate={new Date()}
              control={control}
              defaultValue={monthAtom ? formatDateTime(formatDateTime(monthAtom)) : ''}
              size="small"
            />
          }
        />
      )
    },
    {
      title: <Typography variant="body1">{t('application_form.processed')}</Typography>,
      element: (
        <ReactTableWithTooBarManager
          sxCustom={{
            paddingLeft: '0px !important',
            paddingRight: '0px !important',
            width: '100% important'
          }}
          paperOptions={{ elevation: 0 }}
          searchColumns={searchFiledsApproved}
          edit={checkEditSuccess}
          tabIndex={location?.state?.tabIndex ?? 0}
          quickSearchField={{ accessor: 'employee_name' }}
          setTabChange={handleChangeTab}
          endpoint="1.0/user/manager/form"
          tabTitle={TabTitle}
          params={{
            ...searchParams,
            type: TYPE_FORM['COMPENSATORY_LEAVE'],
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
          title={`${t('application_management.compensatory_leave_management_breadcrumb')}`}
          leftHeader={
            <DatePickerManager
              name="month"
              fullWidth
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
  const closeModal = () => {
    setOpenEdit(false)
  }

  const onSuccess = () => {
    setCheckEditSuccess(!checkEditSuccess)
    setOpenEdit(false)
    setIdEdit(null)
  }
  return (
    <>
      <TabBaseManager tabElement={tabElement} tabValue={tabIndex} />
      <ModalUpdateStatusCompenSatory
        closeModalEdit={closeModal}
        open={openEdit}
        idEdit={idEdit}
        key={idEdit}
        handleEditSuccess={onSuccess}
      />
    </>
  )
}

export { ManagerCompensatoryLeaveApplication }

