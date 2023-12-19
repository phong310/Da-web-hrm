import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CellValue, Column, Row } from 'react-table'
import { Typography } from '@mui/material'
import { useApiResource } from 'lib/hook/useApiResource'
import { KolData } from 'lib/types/applicationForm'
import { V1 } from 'constants/apiVersion'
import { KIND_OF_LEAVE_OPTIONS } from 'lib/utils/contants'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import ModalKindOfLeave from './ModalKindOfLeave'

type KindOfLeaveData = {
  name: string
  symbol: string
  type: number
}
const ListKindOfLeave = () => {
  const { t } = useTranslation()
  const { deleteApi } = useApiResource<KolData>(`${V1}/admin/kind-of-leave`)
  const columns = useMemo<Column<KindOfLeaveData>[]>(
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
        Header: t('kind-of-leave.name'),
        accessor: 'name',
        display: true
      },
      {
        Header: t('kind-of-leave.symbol'),
        accessor: 'symbol',
        display: true
      },
      {
        Header: t('kind-of-leave.type'),
        accessor: 'type',
        display: true,
        Cell: ({ value }: { value: number }) =>
          KIND_OF_LEAVE_OPTIONS.find((item) => item.value == value)?.label
      }
    ],
    []
  )

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [checkAddSuccess, setCheckAddSuccess] = useState<boolean>(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const checkAddSuccesstial = () => {
    setCheckAddSuccess(!checkAddSuccess)
  }

  const closeModalWorkingDay = () => {
    setOpenModal(false)
    setIdEdit(null)
  }
  const onAddClick = () => {
    setOpenModal(true)
  }

  const onActionEdit = (original: any) => {
    setOpenModal(true)
    setIdEdit(original?.row.original.id)
  }

  const onRowClick = ({ original }: Row<KolData>) => {
    setOpenModal(true)
    setIdEdit(original?.id)
  }
  const quickSearchField = {
    Header: t('kind-of-leave.name'),
    accessor: 'name_like'
  }
  return (
    <>
      <ReactTableWithToolBar
        defaultActionDelete={true}
        deleteApi={deleteApi}
        titleDelete={t('kind-of-leave.title_delete')}
        endpoint={`${V1}/admin/kind-of-leave`}
        columns={columns}
        defaultActionEdit
        title={t('kind-of-leave.name')}
        titlePage={t('kind-of-leave.name')}
        isShowSearchFast={true}
        data={[]}
        edit={checkAddSuccess}
        onActionEdit={onActionEdit}
        quickSearchField={quickSearchField}
        onActionCreate={onAddClick}
        onRowClick={onRowClick}
        // exportUrl={`${ADMIN_URL}/kind-of-leave/export`}
        // importUrl={`${ADMIN_URL}/kind-of-leave/import`}
        // templateUrl={`${ADMIN_URL}/kind-of-leave/template`}
        // exportFileName="kind-of-leave.xlsx"
      />
      <ModalKindOfLeave
        checkAddSuccess={checkAddSuccesstial}
        open={openModal}
        key={idEdit}
        idEdit={idEdit}
        closeModalDetail={closeModalWorkingDay}
      />
    </>
  )
}

export default ListKindOfLeave
