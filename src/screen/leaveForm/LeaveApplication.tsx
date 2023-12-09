import { Typography, styled } from '@mui/material'
import { SelectOption } from 'components/Form/Autocomplete/Select'
import ReactTableWithSidebar from 'components/ReactTable/ReactTableWithSidebar/ReactTableWithSidebar'
import { Status } from 'components/Status/Status'
import { V1 } from 'constants/apiVersion'
// import { SelectOption } from 'components/Form'
// import ReactTableWithSidebar from 'components/ReactTable/v2/ReactTableWithSidebar/ReactTableWithSidebar'
// import { STATUS_FORM_OPTIONS, V1 } from 'constants'
import { useAtom, useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { searchParamsAtom } from 'lib/atom/searchAtom'
import { KindOfLeaveType, LeaveFormType } from 'lib/types/applicationForm'
import {
  FORM_STATUS,
  IS_PAID_LEAVE_OPTIONS,
  KIND_OF_LEAVE_TYPES,
  STATUS_FORM_OPTIONS
} from 'lib/utils/contants'
import { convertDatetimeTZWithoutSecond } from 'lib/utils/format'
// import { searchParamsAtom, systemSettingAtom } from 'lib/atom'
// import { KindOfLeaveType, LeaveFormType } from 'lib/types'
// import {
//     FORM_STATUS,
//     IS_PAID_LEAVE_OPTIONS,
//     KIND_OF_LEAVE_TYPES,
//     convertDatetimeTZWithoutSecond
// } from 'lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { CellValue, Column, Row } from 'react-table'
import { toast } from 'react-toastify'
// import { ModalLeaveForm } from 'screen/application/v2/ModalLeaveForm'
// import { TypographyFirstCol } from '../../OverTime/ManagerOvertimeApplication'
// import { Status } from '../../v2/Status'
// import { ItemType, ModalDetailLeaveApplication } from './ModalDetailLeaveApplication'

export const TypographyFirstCol = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px'
  }
}))

const LeaveApplication = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const systemSetting: any = useAtomValue(systemSettingAtom)
  const [reasons, setReasons] = useState<SelectOption[]>()
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  useQuery<{ data: KindOfLeaveType[] }>(
    [`${V1}/user/kind-of-leave`, { type_equal: KIND_OF_LEAVE_TYPES['NORMAL_LEAVE'] }],
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

  type ItemType = {
    approver_1: string
    approver_2: string
    created_at: Date
    end_time: Date
    id: number
    is_salary: number
    kind_of_leave: {
      name: string
    }
    start_time: Date
    status: number
  }

  const columns = useMemo<Column<LeaveFormType>[]>(
    () => [
      {
        Header: t('order_number') as string,
        accessor: (original, index) => index + 1,
        display: true,
        Cell: ({ cell }: { cell: CellValue }) => {
          return <Typography>{cell.value}</Typography>
        }
      },
      {
        Header: t('application_form.approver'),
        accessor: 'approver_1',
        display: true,
        Cell: ({ row }) => {
          return <TypographyFirstCol>{row.original.approver_1}</TypographyFirstCol>
        },
        is_tooltip: true
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
        Cell: ({ row }) => {
          return <>{row.original.kind_of_leave?.name}</>
        },
        display: true,
        is_tooltip: true,
        is_long_text: true
      },
      {
        Header: t('application_form.status'),
        accessor: 'status',
        Cell: ({ value }) => <Status value={value} />,
        display: true,
        is_tooltip: false
      },
      {
        Header: t('application_form.is_paid_leave'),
        accessor: 'is_salary',
        Cell: ({ value }) => <Status value={value as number} isStatusPaidLeave={true} />,
        display: true,
        is_tooltip: false
      },
      {
        Header: t('application_form.created_at'),
        accessor: 'created_at',
        Cell: ({ row }) =>
          `${convertDatetimeTZWithoutSecond(
            row.original.created_at,
            systemSetting.time_zone,
            systemSetting.format_date
          )} `,
        display: true,
        is_tooltip: true
      }
    ],
    []
  )

  const searchFields = [
    {
      Header: t('approver'),
      accessor: 'approver',
      searchType: 'text',
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
      Header: t('table.month'),
      accessor: 'month',
      searchType: 'month-picker',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('application_form.status'),
      accessor: 'status',
      additionSearchProps: {
        options: STATUS_FORM_OPTIONS
      },
      searchType: 'select',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('application_form.is_paid_leave'),
      accessor: 'is_salary',
      additionSearchProps: {
        options: IS_PAID_LEAVE_OPTIONS
      },
      searchType: 'select',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    }
  ]

  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [idDetail, setIdDetail] = useState<number | null>()
  const [checkEditSuccess, setCheckEditSuccess] = useState<boolean>(false)
  const [checkEditInModalDetail, setcheckEditInModalDetail] = useState(false)
  const [searchAtom] = useAtom(searchParamsAtom)

  const onRowClick = ({ original }: Row<ItemType>) => {
    // navigate(`/applications/leave-form/${original.id}`)
    setIdDetail(original.id)
    setOpenDetail(true)
  }

  const onActionEdit = (original: any) => {
    if (original?.row.original.status === 0) {
      setOpenEdit(true)
      setcheckEditInModalDetail(false)
      setIdEdit(original?.row.original.id)
    } else if (original?.row.original.status === FORM_STATUS.APPROVED) {
      toast.error(t('toast.approve_application'))
    } else if (original?.row.original.status === FORM_STATUS.CANCEL) {
      toast.error(t('toast.cancel_application'))
    } else if (original?.row.original.status === FORM_STATUS.REJECTED) {
      toast.error(t('toast.refuse_application'))
    }
  }

  const onAddClick = () => {
    // navigate('/applications/leave-form/new')
    setOpenEdit(true)
  }

  const onSuccess = () => {
    setCheckEditSuccess(!checkEditSuccess)
    if (checkEditInModalDetail) {
      setOpenEdit(false)
      setIdDetail(idEdit)
      setIdEdit(null)
      setcheckEditInModalDetail(false)
      setOpenDetail(true)
    } else {
      setIdEdit(null)
      setOpenEdit(false)
    }
  }
  const closeModal = () => {
    if (checkEditInModalDetail) {
      setOpenEdit(false)
      setOpenDetail(true)
      setIdDetail(idEdit)
      setIdEdit(null)
      setcheckEditInModalDetail(false)
    } else {
      setOpenEdit(false)
      setOpenDetail(false)
      setIdDetail(null)
      setIdEdit(null)
    }
  }
  const handleEditInModalDetai = () => {
    setOpenEdit(true)
    setIdEdit(idDetail)
    setOpenDetail(false)
    setIdDetail(null)
    setcheckEditInModalDetail(true)
  }

  useEffect(() => {
    if (urlParams.get('date')) {
      setOpenEdit(true)
    }
  }, [urlParams.get('date')])

  return (
    <>
      <ReactTableWithSidebar
        onActionEdit={onActionEdit}
        searchColumns={searchFields}
        endpoint={`1.0/user/leave-form`}
        params={{
          ...(searchAtom && searchAtom)
        }}
        edit={checkEditSuccess}
        columns={columns}
        defaultActionEdit
        title={`${t('application_form.leave_application')}`}
        isShowSearchFast={false}
        onActionCreate={onAddClick}
        onRowClick={onRowClick}
        data={[]}
      />
      {/* <ModalDetailLeaveApplication
        open={openDetail}
        handleEditInModalDetai={handleEditInModalDetai}
        idDetail={idDetail}
        closeModalDetail={closeModal}
      />

      <ModalLeaveForm
        closeModalEdit={closeModal}
        open={openEdit}
        idEdit={idEdit}
        onSuccess={onSuccess}
      /> */}
    </>
  )
}

export const styleKindOfLeave = {
  fontSize: '16px'
}

export { LeaveApplication }
