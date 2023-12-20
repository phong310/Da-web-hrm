// @ts-nocheck
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Row } from 'react-table'
import { Box, Typography } from '@mui/material'
import { useApiResource } from 'lib/hook/useApiResource'
import { AllowanceData } from 'lib/types/baseMaster'
import { V1 } from 'constants/apiVersion'
import { STATUS_ALLOWANCE, STATUS_ALLOWANCE_OPTIONS } from 'lib/utils/contants'
import { numberWithCommas } from 'lib/utils/format-number'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { Green, Red } from 'styles/colors'
import ModalFormFixedAllowance from './ModalFormFixedAllowance'

const FixedAllowance = () => {
  const { t } = useTranslation()
  const { deleteApi } = useApiResource<AllowanceData>(`${V1}/admin/allowance`)
  const [idEdit, setIdEdit] = useState<number | null>()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [checkSuccess, setCheckSuccess] = useState<boolean>(false)

  const columnAllowance = useMemo<Column<AllowanceData | any>[]>(
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
        Header: t('allowances.name'),
        accessor: 'name',
        display: true
      },
      {
        Header: t('allowances.status'),
        accessor: 'status',
        display: true,
        Cell: ({ value }: { value: number }) => {
          const color = getStatusColor(value)

          const boxStyle = {
            display: 'flex',
            alignItems: 'center',
            minWidth: '170px',
            padding: '3px 8px',
            fontSize: '16px',
            borderRadius: '6px',
            justifyContent: 'center',
            textAlign: 'center',
            color: `${color}`,
            border: `1px solid ${color}` // Đặt màu viền dựa trên giá trị value
          }
          return (
            <Box sx={boxStyle}>
              <Typography>
                {STATUS_ALLOWANCE_OPTIONS.find((item) => item.value === value)?.label}
              </Typography>
            </Box>
          )
        }
      },
      {
        Header: t('allowances.amount_of_money'),
        accessor: 'amount_of_money',
        display: true,
        Cell: ({ value }: { value: number }) => numberWithCommas(value)
      }
    ],
    []
  )
  const onRowClick = ({ original }: Row<AllowanceData>) => {
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
    Header: t('allowances.name'),
    accessor: 'name_like'
  }
  return (
    <>
      <ReactTableWithToolBar
        endpoint={`${V1}/admin/allowance`}
        columns={columnAllowance}
        onRowClick={onRowClick}
        sxCustom={{ padding: '0 !important' }}
        deleteApi={deleteApi}
        onActionCreate={onCreate}
        onActionEdit={onActionEdit}
        edit={checkSuccess}
        quickSearchField={quickSearchField}
        titleDelete={t('allowances.note_delete')}
        defaultActionEdit
        defaultActionDelete
        data={[]}
        title={t('allowances.list')}
      />
      <ModalFormFixedAllowance
        onSuccess={onSuccess}
        openModal={openModal}
        key={idEdit}
        idEdit={idEdit}
        closeModalDetail={closeModalAllowance}
      />
    </>
  )
}
const getStatusColor = (value: number) => {
  return value === STATUS_ALLOWANCE['INACTIVE'] ? Red[400] : Green[600]
}
export default FixedAllowance
