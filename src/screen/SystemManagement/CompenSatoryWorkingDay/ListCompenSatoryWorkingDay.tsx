// @ts-nocheck
import { Typography } from '@mui/material'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { TabBase, TabElement } from 'components/Tab/TabBase'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { CompensatoryWorkingDayType } from 'lib/types/applicationForm'
import { COMPENSATORY_WD_TYPE } from 'lib/utils/contants'
import { formatDate } from 'lib/utils/format'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { CellValue, Column, Row } from 'react-table'
import { TypographyFirstCol } from 'screen/leaveForm/LeaveApplication'
import ListWorkingDay from 'screen/workingDay/ListWorkingDay'
import ModalCompenSatoryWorkingDay from './ModalCompenSatoryWorkingDay'
export type WorkingDay = {
  id: number
}

const ListCompenSatoryWorkingDay = () => {
  const { t } = useTranslation()
  const { deleteApi } = useApiResource<CompensatoryWorkingDayType>(
    `1.0/admin/compensatory-working-day`
  )
  const location: any = useLocation()
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [success, setSuccess] = useState<boolean>(false)
  const columnsSingle = useMemo<Column<CompensatoryWorkingDayType>[]>(
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
        Header: t('compensatory_working_day.name'),
        accessor: 'name',
        display: true
      },
      {
        Header: t('compensatory_working_day.start_date'),
        accessor: 'start_date',
        Cell: ({ row }) => {
          return (
            <TypographyFirstCol>
              {formatDate(row.original.start_date as string, 'dd/MM/yyyy')}
            </TypographyFirstCol>
          )
        },
        display: true
      },
      {
        Header: t('compensatory_working_day.end_date'),
        accessor: 'end_date',
        Cell: ({ row }) => {
          return (
            <TypographyFirstCol>
              {formatDate(row.original.end_date as string, 'dd/MM/yyyy')}
            </TypographyFirstCol>
          )
        },
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
      }
    ],
    []
  )
  const quickSearchField = {
    Header: t('compensatory_working_days.name'),
    accessor: 'name_like'
  }
  const onRowClick = ({ original }: Row<CompensatoryWorkingDayType>) => {
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
  const closeModalCompenSatoryWorkingDay = () => {
    setOpenModalEdit(false)
    setIdEdit(null)
  }
  const onSuccess = () => {
    setSuccess(!success)
    setOpenModalEdit(false)
    setIdEdit(null)
  }
  const tabElement: TabElement[] = [
    {
      title: <Typography>{t('working_day.working_day')}</Typography>,
      element: <ListWorkingDay />
    },
    {
      title: <Typography>{t('System_Management.compensatory_working_day')}</Typography>,
      element: (
        <ReactTableWithToolBar
          endpoint={`${V1}/admin/compensatory-working-day`}
          columns={columnsSingle}
          quickSearchField={quickSearchField}
          onRowClick={onRowClick}
          onActionEdit={onActionEdit}
          deleteApi={deleteApi}
          sxCustom={{ padding: '0 !impor' }}
          titleDelete={t('holiday.note_delete')}
          defaultActionEdit
          edit={success}
          params={{
            type: COMPENSATORY_WD_TYPE['SINGLE_USE']
          }}
          defaultActionDelete
          onActionCreate={onCreate}
          data={[]}
          title={t('System_Management.compensatory_working_day')}
        />
      )
    }
  ]

  return (
    <>
      <TabBase
        title={t('working_day_system.working_day')}
        tabElement={tabElement}
        tabIndex={location?.state?.tabIndex ?? 0}
      ></TabBase>
      <ModalCompenSatoryWorkingDay
        key={idEdit}
        onSuccess={onSuccess}
        openModal={openModalEdit}
        idEdit={idEdit}
        closeModalDetail={closeModalCompenSatoryWorkingDay}
      />
    </>
  )
}

export default ListCompenSatoryWorkingDay
