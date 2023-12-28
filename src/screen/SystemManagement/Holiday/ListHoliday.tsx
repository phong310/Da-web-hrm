import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CellValue, Column, Row } from 'react-table'
import { Typography } from '@mui/material'
import { useApiResource } from 'lib/hook/useApiResource'
import { useAuth } from 'lib/hook/useAuth'
import { TypographyFirstCol } from 'screen/leaveForm/LeaveApplication'
import { formatDate } from 'lib/utils/format'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { V1 } from 'constants/apiVersion'
import { HOLIDAY_TYPE } from 'lib/utils/contants'
import ModalHolidayForm from './ModalHolidayForm'
import { HolidayType } from 'lib/types/applicationForm'

const ListHoliday = () => {
  const { t } = useTranslation()
  const { deleteApi } = useApiResource<HolidayType>(`1.0/admin/holiday`)
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [success, setSuccess] = useState<boolean>(false)
  const { systemSetting } = useAuth()

  const columnsSingle = useMemo<Column<HolidayType>[]>(
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
        Header: t('holiday.name'),
        accessor: 'name',
        display: true,
        Cell: ({ cell }) => <Typography sx={{ ...styleCell }}>{cell.value}</Typography>
      },
      {
        Header: t('holiday.start_date'),
        accessor: 'start_date',
        Cell: ({ row }) => {
          return (
            <TypographyFirstCol>
              {formatDate(row.original.start_date || '', systemSetting?.format_date)}
            </TypographyFirstCol>
          )
        },
        display: true
      },
      {
        Header: t('holiday.end_date'),
        accessor: 'end_date',
        Cell: ({ row }) => {
          return (
            <TypographyFirstCol>
              {formatDate(row.original.end_date || '', systemSetting?.format_date)}
            </TypographyFirstCol>
          )
        },
        display: true
      }
    ],
    []
  )
  const quickSearchField = {
    Header: t('holiday.name'),
    accessor: 'name_like'
  }
  const onRowClick = ({ original }: Row<HolidayType>) => {
    setOpenModalEdit(true)
    setIdEdit(original.id)
  }
  const onCreate = () => {
    setOpenModalEdit(true)
  }
  const onActionEdit = (original: any) => {
    setOpenModalEdit(true)
    setIdEdit(original?.row.original.id)
  }
  const closeModalHolidayForm = () => {
    setOpenModalEdit(false)
    setIdEdit(null)
  }
  const onSuccess = () => {
    setSuccess(!success)
    setOpenModalEdit(false)
    setIdEdit(null)
  }

  return (
    <>
      <ReactTableWithToolBar
        endpoint={`${V1}/admin/holiday`}
        columns={columnsSingle}
        quickSearchField={quickSearchField}
        onRowClick={onRowClick}
        onActionEdit={onActionEdit}
        deleteApi={deleteApi}
        titleDelete={t('holiday.note_delete')}
        defaultActionEdit
        params={{
          type: HOLIDAY_TYPE['SINGLE_USE']
        }}
        edit={success}
        defaultActionDelete
        onActionCreate={onCreate}
        data={[]}
        titlePage={t('System_Management.list_holiday')}
        title={t('System_Management.list_holiday')}
      />
      <ModalHolidayForm
        key={idEdit}
        onSuccess={onSuccess}
        openModal={openModalEdit}
        idEdit={idEdit}
        closeModalDetail={closeModalHolidayForm}
      />
    </>
  )
}

const styleCell = {
  width: 'fit-content',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '240px'
}

export default ListHoliday
