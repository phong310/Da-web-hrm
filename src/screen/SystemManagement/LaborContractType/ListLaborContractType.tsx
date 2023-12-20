// @ts-nocheck
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CellValue, Column, Row } from 'react-table'
import { numberWithCommas } from 'lib/utils/format-number'
import { Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { AllowanceData, LaborContractTypeData } from 'lib/types/baseMaster'
import { V1 } from 'constants/apiVersion'
import { useApiResource } from 'lib/hook/useApiResource'
import { Status } from 'components/Status/Status'
import { TabBase, TabElement } from 'components/Tab/TabBase'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import FixedAllowance from './TabAllowance/FixedAllowance'
import OtherAllowance from './TabAllowance/OtherAllowance'
import ModalFormLaborContractType from './ModalFormLaborContractType'
const ListLaborContractType: React.FC = () => {
  const { t } = useTranslation()
  const { deleteApi } = useApiResource<LaborContractTypeData>(`${V1}/admin/labor-contract-type`)
  const location: any = useLocation()
  const listFields = useMemo<Column<LaborContractTypeData | any>[]>(
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
        Header: t('labor_contract_types.name'),
        accessor: 'name',
        display: true
      },
      {
        Header: t('labor_contract_types.duration_of_contract'),
        accessor: 'duration_of_contract',
        display: true
      },
      {
        Header: t('labor_contract_types.allowance'),
        accessor: 'allowances',
        display: true,
        Cell: ({ value }: { value: AllowanceData[] }) => {
          if (value) {
            const slicedValue = value.slice(0, 2)
            const moreItems = value.length > 2

            return (
              <div>
                {slicedValue.map((item: AllowanceData, index) => (
                  <p key={index}>
                    {item.name} ({numberWithCommas(item.amount_of_money)})
                  </p>
                ))}
                {moreItems && <p>...</p>}
              </div>
            )
          } else {
            return null
          }
        }
      },
      {
        Header: t('labor_contract_types.apply_holiday'),
        accessor: 'status_apply_holiday',
        Cell: ({ value }) => <Status value={value as number} isStatusPaidLeave={true} />,
        display: true
      }
    ],
    []
  )
  const quickSearchField = {
    Header: t('labor_contract_types.name'),
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

  const onCreate = () => {
    setOpenModal(true)
  }

  const onActionEdit = (original: any) => {
    setOpenModal(true)
    setIdEdit(original?.row.original.id)
  }

  const onRowClick = ({ original }: Row<LaborContractTypeData>) => {
    setOpenModal(true)
    setIdEdit(original?.id)
  }
  const TabElement: TabElement[] = [
    {
      title: <Typography>{t('labor_contract_types.list')}</Typography>,
      element: (
        <ReactTableWithToolBar
          endpoint={`${V1}/admin/labor-contract-type`}
          columns={listFields}
          titleDelete={t('labor_contract_types.title_delete')}
          onRowClick={onRowClick}
          deleteApi={deleteApi}
          onActionCreate={onCreate}
          quickSearchField={quickSearchField}
          data={[]}
          sxCustom={{ padding: 0 }}
          edit={checkAddSuccess}
          onActionEdit={onActionEdit}
          title={t('labor_contract_types.list')}
          defaultActionDelete
        />
      )
    },
    {
      title: <Typography>{t('allowance_admin.fixed_allowance')}</Typography>,
      element: <FixedAllowance />
    },
    {
      title: <Typography>{t('allowance_admin.other_allowance')}</Typography>,
      element: <OtherAllowance />
    }
  ]
  return (
    <>
      <TabBase
        title={t('labor_contract_types.list')}
        tabElement={TabElement}
        tabIndex={location?.state?.tabIndex ?? 0}
      />
      <ModalFormLaborContractType
        checkAddSuccess={checkAddSuccesstial}
        open={openModal}
        key={idEdit}
        idEdit={idEdit}
        closeModalDetail={closeModalWorkingDay}
      />
    </>
  )
}

export default ListLaborContractType
