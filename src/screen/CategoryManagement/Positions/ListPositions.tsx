import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { ADMIN_URL, V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { BaseMaster } from 'lib/types/baseMaster'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Row } from 'react-table'
import { ElipsisBox } from 'screen/compensatoryLeave/CompensatoryLeaveApplication'
import ModalCreatePosition from './ModalCreatePosition'

type positionType = {
  id: number
  name: string
}
const ListPositions: React.FC = () => {
  const { t } = useTranslation()
  const { deleteApi } = useApiResource<BaseMaster>(`${V1}/admin/position`)
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [success, setSuccess] = useState<boolean>(false)
  const onCreate = () => {
    setOpenModalEdit(true)
  }

  const onRowClick = ({ original }: Row<BaseMaster>) => {
    setOpenModalEdit(true)
    setIdEdit(original.id)
  }
  const columns = useMemo<Column<positionType | any>[]>(
    () => [
      {
        Header: t('order_number') as string,
        // @ts-ignore
        accessor: (original, index) => index + 1,
        display: true,
        Cell: ({ cell }) => {
          return <ElipsisBox>{cell.value}</ElipsisBox>
        }
      },
      {
        Header: t('position_admin.name'),
        accessor: 'name',
        display: true
      }
    ],
    []
  )
  const quickSearchField = {
    Header: t('position_admin.name'),
    accessor: 'name_like'
  }

  const onActionEdit = (original: any) => {
    setOpenModalEdit(true)
    setIdEdit(original?.row.original.id)
  }
  const closeModalDetail = () => {
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
        endpoint={`${V1}/admin/position`}
        columns={columns}
        quickSearchField={quickSearchField}
        defaultActionEdit
        onActionEdit={onActionEdit}
        defaultActionDelete
        titleDelete={t('position_admin.title_delete')}
        onRowClick={onRowClick}
        edit={success}
        deleteApi={deleteApi}
        onActionCreate={onCreate}
        data={[]}
        title={t('position_admin.list')}
        titlePage={t('position_admin.list')}
        exportUrl={`${ADMIN_URL}/position/export`}
        importUrl={`${ADMIN_URL}/position/import`}
        templateUrl={`${ADMIN_URL}/position/template`}
        exportFileName="positions.xlsx"
      />
      <ModalCreatePosition
        openModal={openModalEdit}
        closeModalDetail={closeModalDetail}
        idEdit={idEdit}
        key={idEdit}
        onSuccess={onSuccess}
      />
    </>
  )
}

export default ListPositions
