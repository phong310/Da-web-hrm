// @ts-nocheck
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { BaseMaster } from 'lib/types/baseMaster'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Column, Row } from 'react-table'
import { ElipsisBox } from 'screen/compensatoryLeave/CompensatoryLeaveApplication'
import ModalCreateDepartment from './ModalCreateDepartment'

type departmentType = {
  id: number
  name: string
}
const ListDepartment: React.FC = () => {
  const { t } = useTranslation()
  const { deleteApi } = useApiResource<BaseMaster>(`${V1}/admin/department`)

  const navigate = useNavigate()
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
  const columns = useMemo<Column<departmentType | any>[]>(
    () => [
      {
        Header: t('order_number') as string,
        accessor: (original, index) => index + 1,
        display: true,
        Cell: ({ cell }) => {
          return <ElipsisBox>{cell.value}</ElipsisBox>
        }
      },
      {
        Header: t('department_admin.name'),
        accessor: 'name',
        display: true
      }
    ],
    []
  )
  const quickSearchField = {
    Header: t('department_admin.name'),
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
        endpoint={`${V1}/admin/department`}
        columns={columns}
        quickSearchField={quickSearchField}
        defaultActionEdit
        onActionEdit={onActionEdit}
        defaultActionDelete
        titleDelete={t('department_admin.title_delete')}
        onRowClick={onRowClick}
        edit={success}
        deleteApi={deleteApi}
        onActionCreate={onCreate}
        data={[]}
        title={t('department_admin.list')}
        titlePage={t('department_admin.list')}
        // exportUrl={`${ADMIN_URL}/department/export`}
        // importUrl={`${ADMIN_URL}/department/import`}
        // templateUrl={`${ADMIN_URL}/department/template`}
        // exportFileName="departments.xlsx"
      />
      <ModalCreateDepartment
        openModal={openModalEdit}
        closeModalDetail={closeModalDetail}
        idEdit={idEdit}
        key={idEdit}
        onSuccess={onSuccess}
      />
    </>
  )
}

export default ListDepartment
