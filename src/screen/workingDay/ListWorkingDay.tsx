// import ReactTableWithToolBar from 'components/ReactTable/v2/ReactTableWithToolBar/ReactTableWithToolBar'
// import { V1 } from 'constants'
// import { useApiResource } from 'lib/hooks'
// import { WorkingDayData } from 'lib/types'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CellValue, Row, Column } from 'react-table'
// import ModalFormWorkingDay from './ModalFormWorkingDay'
import { Typography } from '@mui/material'
import { useApiResource } from 'lib/hook/useApiResource'
import { WorkingDayData } from 'lib/types/timeSheet'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import ModalFormWorkingDay from './ModalFormWorkingDay'
import { V1 } from 'constants/apiVersion'

export type WorkingDay = {
  id: number
}

const ListWorkingDay = () => {
  const { deleteApi } = useApiResource<WorkingDayData>(`${V1}/admin/working-day`)

  const { t } = useTranslation()

  const columns = useMemo<Column<WorkingDayData>[]>(
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
        Header: t('working_day.name'),
        accessor: 'name',
        display: true
      },
      {
        Header: t('working_day.start_time'),
        accessor: 'start_time',
        display: true
      },
      {
        Header: t('working_day.end_time'),
        accessor: 'end_time',
        display: true
      },
      {
        Header: t('working_day.start_lunch_break'),
        accessor: 'start_lunch_break',
        display: true
      },
      {
        Header: t('working_day.end_lunch_break'),
        accessor: 'end_lunch_break',
        display: true
      },
      {
        Header: t('working_day.day_in_week_id'),
        accessor: 'day_in_week_name',
        display: true
      }
    ],
    []
  )
  const quickSearchField = {
    Header: t('working_day.name'),
    accessor: 'name_like'
  }

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

  const onRowClick = ({ original }: Row<WorkingDay>) => {
    setOpenModal(true)
    setIdEdit(original?.id)
  }

  return (
    <>
      <ReactTableWithToolBar
        defaultActionDelete={true}
        deleteApi={deleteApi}
        sxCustom={{ padding: '0 !important' }}
        titleDelete={t('working_day.title_delete')}
        endpoint={`${V1}/admin/working-day`}
        columns={columns}
        defaultActionEdit
        title={t('working_day.working_day')}
        isShowSearchFast={true}
        data={[]}
        edit={checkAddSuccess}
        onActionEdit={onActionEdit}
        quickSearchField={quickSearchField}
        onActionCreate={onAddClick}
        onRowClick={onRowClick}
      />
      <ModalFormWorkingDay
        checkAddSuccess={checkAddSuccesstial}
        open={openModal}
        key={idEdit}
        idEdit={idEdit}
        closeModalDetail={closeModalWorkingDay}
      />
    </>
  )
}

export default ListWorkingDay
