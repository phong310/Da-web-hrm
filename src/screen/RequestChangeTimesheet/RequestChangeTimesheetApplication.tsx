import { useAtom, useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CellValue, Column, Row } from 'react-table'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { searchParamsAtom } from 'lib/atom/searchAtom'
import { SelectOption } from 'components/Form/Autocomplete/Select'
import { TypographyFirstCol } from 'screen/leaveForm/LeaveApplication'
import { convertDatetimeTZ, convertDatetimeTZWithoutSecond, convertFormatDate, formatDateTime, formatTime } from 'lib/utils/format'
import { Status } from 'components/Status/Status'
import { FORM_STATUS, STATUS_FORM_OPTIONS } from 'lib/utils/contants'
import { RequestChangeTimesheetFormType } from 'lib/types/applicationForm'
import ReactTableWithSidebar from 'components/ReactTable/ReactTableWithSidebar/ReactTableWithSidebar'
import { ModalRequestChangeTimeSheet } from './ModalRequestChangeTimeSheet'
import ModalDetailRequestChangeTimesheetApplication from './ModalDetailRequestChangeTimesheetApplication'
const RequestChangeTimesheetApplication = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const [reasons, setReasons] = useState<SelectOption[]>()
  const [searchAtom] = useAtom(searchParamsAtom)
  const columns = useMemo<Column<any>[]>(
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
        Cell: ({ row }) => `${convertFormatDate(row.original.date, systemSetting.format_date)}`,
        display: true,
        is_tooltip: true
      },
      {
        Header: t('application_form.time'),
        accessor: 'start_time',
        Cell: ({ row }) => {
          const check_in_time = formatDateTime(
            convertDatetimeTZ(row.original.check_in_time || '', systemSetting.time_zone)
          )
          const check_out_time = formatDateTime(
            convertDatetimeTZ(row.original.check_out_time || '', systemSetting.time_zone)
          )

          return `${formatTime(check_in_time)} - ${formatTime(check_out_time)}`
        },
        display: true,
        is_tooltip: true
      },
      {
        Header: t('application_form.note'),
        accessor: 'note',
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
  const [idDetail, setIdDetail] = useState<number | null>()
  const [idEdit, setIdEdit] = useState<number | null>()
  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [checkEditInModalDetail, setCheckEditInModalDetail] = useState<boolean>(false)
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)

  const handleClose = () => {
    if (checkEditInModalDetail) {
      setOpenDetail(true)
      setOpenEdit(false)
      setIdDetail(idEdit)
      setIdEdit(null)
      setCheckEditInModalDetail(false)
    } else {
      setOpenDetail(false)
      setOpenEdit(false)
    }
  }

  const onRowClick = ({ original }: Row<RequestChangeTimesheetFormType>) => {
    // // navigate('/applications/leave-form/' + original.id)
    setIdDetail(original.id)
    setOpenDetail(true)
  }

  const onActionEdit = (original: any) => {
    if (original?.row.original.status === 0) {
      setIdEdit(original?.row.original.id)
      setOpenEdit(true)
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
    setIdEdit(null)
  }
  const handleEditInModalDetail = () => {
    setCheckEditInModalDetail(true)
    setOpenDetail(false)
    setOpenEdit(true)
    setIdEdit(idDetail)
    setIdDetail(null)
  }

  const onSuccess = () => {
    setUpdateSuccess(!updateSuccess)
    if (checkEditInModalDetail) {
      setOpenEdit(false)
      setIdDetail(idEdit)
      setIdEdit(null)
      setCheckEditInModalDetail(false)
      setOpenDetail(true)
    } else {
      setIdEdit(null)
      setOpenEdit(false)
    }
  }

  return (
    <>
      <ReactTableWithSidebar
        onActionEdit={onActionEdit}
        searchColumns={searchFields}
        endpoint={`1.0/user/request-change-timesheet`}
        params={{
          ...(searchAtom && searchAtom)
        }}
        edit={updateSuccess}
        columns={columns}
        defaultActionEdit
        title={`${t('application_form.request_change_timesheet_application')} `}
        isShowSearchFast={false}
        onActionCreate={onAddClick}
        onRowClick={onRowClick}
        data={[]}
      />
      <ModalDetailRequestChangeTimesheetApplication
        open={openDetail}
        idDetail={idDetail}
        handleEdit={handleEditInModalDetail}
        updateSuccess={updateSuccess}
        handleClose={handleClose}
      />
      <ModalRequestChangeTimeSheet
        open={openEdit}
        idEdit={idEdit}
        handleCloseModal={handleClose}
        onSuccessEdit={onSuccess}
      />
    </>
  )
}

export { RequestChangeTimesheetApplication }
