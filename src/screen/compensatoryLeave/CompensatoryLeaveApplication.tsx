import { Box, Typography, styled } from '@mui/material'
import { SelectOption } from 'components/Form/Autocomplete/Select'
import ReactTableWithSidebar from 'components/ReactTable/ReactTableWithSidebar/ReactTableWithSidebar'
import { Status } from 'components/Status/Status'
import { V1 } from 'constants/apiVersion'
import { useAtom, useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { searchParamsAtom } from 'lib/atom/searchAtom'
import { KindOfLeaveType, LeaveFormType } from 'lib/types/applicationForm'
import { FORM_STATUS, KIND_OF_LEAVE_TYPES, STATUS_FORM_OPTIONS } from 'lib/utils/contants'
import { convertDatetimeTZWithoutSecond } from 'lib/utils/format'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CellValue, Column, Row } from 'react-table'
import { toast } from 'react-toastify'
import { TypographyFirstCol } from 'screen/leaveForm/LeaveApplication'
import { ModalCompensatoryForm } from './ModalCompensatoryForm'
import { ModalDetailCompensatoryApplication } from './ModalDetailCompensatoryApplication'
const CompensatoryLeaveApplication = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const [searchAtom] = useAtom(searchParamsAtom)
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
        Cell: ({ row }) => <>{row.original?.kind_of_leave?.name || ''}</>,
        display: true,
        is_tooltip: true,
        is_long_text: true
      },
      {
        Header: t('application_form.status'),
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
    }
  ]

  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [idDetail, setIdDetail] = useState<number | null>()
  const [checkEditSuccess, setCheckEditSuccess] = useState<boolean>(false)
  const [checkEditInModalDetail, setcheckEditInModalDetail] = useState(false)
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
    setIdEdit(null)
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
      // setIdEdit(null)
    }
  }
  const handleEditInModalDetai = () => {
    setOpenEdit(true)
    setIdEdit(idDetail)
    setIdDetail(null)
    setOpenDetail(false)
    setcheckEditInModalDetail(true)
  }

  return (
    <>
      <ReactTableWithSidebar
        onActionEdit={onActionEdit}
        searchColumns={searchFields}
        endpoint={`1.0/user/compensatory-leave`}
        params={{
          ...(searchAtom && searchAtom)
        }}
        columns={columns}
        edit={checkEditSuccess}
        defaultActionEdit
        title={`${t('application_form.compensatory_leave_application')}`}
        isShowSearchFast={false}
        onActionCreate={onAddClick}
        onRowClick={onRowClick}
        data={[]}
      />
      <ModalDetailCompensatoryApplication
        open={openDetail}
        handleEditInModalDetai={handleEditInModalDetai}
        // item={itemDetail}
        idDetail={idDetail}
        closeModalDetail={closeModal}
      />
      <ModalCompensatoryForm
        closeModalEdit={closeModal}
        checkInEdit={checkEditInModalDetail}
        open={openEdit}
        idEdit={idEdit}
        handleEditSuccess={onSuccess}
      />
    </>
  )
}

export { CompensatoryLeaveApplication }

export const ElipsisBox = styled(Box)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})
