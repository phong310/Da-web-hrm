// @ts-nocheck
import { Typography } from '@mui/material'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { OtherAllowanceData } from 'lib/utils/contants'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Row } from 'react-table'
import ModalFormOtherAllowance from './ModalFormOtherAllowance'

const OtherAllowance = () => {
  const { t } = useTranslation()
  const { deleteApi } = useApiResource<OtherAllowanceData>(`${V1}/admin/other-allowance`)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [checkSuccess, setCheckSuccess] = useState<boolean>(false)

  const columnAllowance = useMemo<Column<OtherAllowanceData | any>[]>(
    () => [
      {
        Header: t('order_number') as string,
        accessor: (original, index) => index + 1,
        display: true,
        Cell: ({ cell }) => {
          return <Typography>{cell.value}</Typography>
        }
      },
      {
        Header: t('other_allowances.name'),
        accessor: 'name',
        display: true
      }
    ],
    []
  )
  const onRowClick = ({ original }: Row<OtherAllowanceData>) => {
    setOpenModal(true)
    setIdEdit(original.id)
  }
  const onCreate = () => {
    setOpenModal(true)
  }
  const closeModalAllowance = () => {
    setOpenModal(false)
    setIdEdit(null)
  }
  const onActionEdit = (original: any) => {
    setOpenModal(true)
    setIdEdit(original?.row.original.id)
  }
  const onSuccess = () => {
    setCheckSuccess(!checkSuccess)
  }
  const quickSearchField = {
    Header: t('other_allowances.name'),
    accessor: 'name_like'
  }
  return (
    <>
      <ReactTableWithToolBar
        endpoint={`${V1}/admin/other-allowance`}
        columns={columnAllowance}
        onRowClick={onRowClick}
        deleteApi={deleteApi}
        onActionCreate={onCreate}
        edit={checkSuccess}
        titleDelete={t('allowances.note_delete')}
        defaultActionEdit
        onActionEdit={onActionEdit}
        sxCustom={{ padding: '0 !important' }}
        defaultActionDelete
        quickSearchField={quickSearchField}
        data={[]}
        title={t('allowances.list')}
      />
      <ModalFormOtherAllowance
        onSuccess={onSuccess}
        openModal={openModal}
        key={idEdit}
        idEdit={idEdit}
        closeModalDetail={closeModalAllowance}
      />
    </>
  )
}

export default OtherAllowance
