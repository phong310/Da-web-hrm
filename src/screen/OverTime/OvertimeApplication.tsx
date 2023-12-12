// import { STATUS_FORM_OPTIONS } from 'constants'
// import { useAtom, useAtomValue } from 'jotai'
// import { searchParamsAtom, systemSettingAtom } from 'lib/atom'
// import { LeaveFormType, OvertimeFormType } from 'lib/types'
// import {
//   FORM_STATUS,
//   convertDatetimeTZ,
//   convertDatetimeTZWithoutSecond,
//   convertFormatDate,
//   formatDateTime,
//   formatTime
// } from 'lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CellValue, Column, Row } from 'react-table'
// import { ModalOverTimeForm } from 'screen/application/v2/ModalOverTimeForm'
// import { Status } from 'screen/application/v2/Status'
// import { TypographyFirstCol } from '../ManagerOvertimeApplication'
// import { ModalDetailOverTimeApplication } from './ModalDetailOverTimeApplication'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { useAtom, useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { searchParamsAtom } from 'lib/atom/searchAtom'
import { LeaveFormType, OvertimeFormType } from 'lib/types/applicationForm'
import { TypographyFirstCol } from 'screen/leaveForm/LeaveApplication'
import { convertDatetimeTZ, convertDatetimeTZWithoutSecond, convertFormatDate, formatDateTime, formatTime } from 'lib/utils/format'
import { Status } from 'components/Status/Status'
import { FORM_STATUS, STATUS_FORM_OPTIONS } from 'lib/utils/contants'
import ReactTableWithSidebar from 'components/ReactTable/ReactTableWithSidebar/ReactTableWithSidebar'
import { ModalDetailOverTimeApplication } from './ModalDetailOverTimeApplication'
import { ModalOverTimeForm } from './ModalOverTimeForm'
type ApplicationType = {
  id: number
  start_time: string
  note: string
}

const OvertimeApplication = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const [searchParams] = useSearchParams()
  const [searchAtom] = useAtom(searchParamsAtom)
  const columns = useMemo<Column<OvertimeFormType>[]>(
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
        Header: t('application_form.date'),
        accessor: 'date',
        Cell: ({ row }) =>
          `${convertFormatDate(row.original.end_time, systemSetting.format_date)} `,
        display: true,
        is_tooltip: true
      },
      {
        Header: t('application_form.time'),
        accessor: 'start_time',
        Cell: ({ row }) => {
          const start_time = formatDateTime(
            convertDatetimeTZ(row.original.start_time || '', systemSetting.time_zone)
          )
          const end_time = formatDateTime(
            convertDatetimeTZ(row.original.end_time || '', systemSetting.time_zone)
          )

          return `${formatTime(start_time)} - ${formatTime(end_time)}`
        },
        display: true,
        is_tooltip: true
      },
      {
        Header: t('application_form.reason'),
        accessor: 'reason',
        display: true,
        Cell: ({ value }) => <>{value}</>,
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
        Header: t('application_form.created_at'),
        accessor: 'created_at',
        Cell: ({ row }) =>
          convertDatetimeTZWithoutSecond(
            row.original.created_at,
            systemSetting.time_zone,
            systemSetting.format_date
          ),
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
      type: 'text',
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
    }
  ]

  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [idDetail, setIdDetail] = useState<number | null>()
  const [checkEditSuccess, setCheckEditSuccess] = useState<boolean>(false)
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)

  const onRowClick = ({ original }: Row<LeaveFormType>) => {
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
  const [checkEditInModalDetail, setcheckEditInModalDetail] = useState(false)

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
        endpoint={`1.0/user/overtime-form`}
        params={{
          ...(searchAtom && searchAtom)
        }}
        isShowSearchFast={false}
        onActionCreate={onAddClick}
        edit={checkEditSuccess}
        columns={columns}
        defaultActionEdit
        onRowClick={onRowClick}
        data={[]}
        title={`${t('application_form.overtime_application')} `}
      />
      <ModalDetailOverTimeApplication
        open={openDetail}
        handleEditInModalDetai={handleEditInModalDetai}
        idDetail={idDetail}
        closeModalDetail={closeModal}
      />
      <ModalOverTimeForm
        closeModalEdit={closeModal}
        open={openEdit}
        dateParams={urlParams.get('date')}
        idEdit={idEdit}
        onSuccess={onSuccess}
      />
    </>
  )
}

export { OvertimeApplication }
