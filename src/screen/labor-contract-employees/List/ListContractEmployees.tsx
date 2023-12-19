import { Box, styled } from '@mui/material'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
// import { USER_URL } from 'constants'
// import { useAuth } from 'lib/hooks'
// import { BaseMaster, EmployeeType, LaborContractType } from 'lib/types'
// import { formatDate } from 'lib/utils'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Column, Row } from 'react-table'
import { StatusLaborContract } from '../Atom/StatusLaborContract'
import { BaseMaster } from 'lib/types/baseMaster'
import { EmployeeType } from 'lib/types/user'
import { useAuth } from 'lib/hook/useAuth'
import { LaborContractType } from 'lib/types/labor-contract'
import { formatDate } from 'lib/utils/format'
import { USER_URL } from 'constants/apiVersion'
import { ModalDetailLaborContract } from '../modal/ModalDetailLaborContract'
// import { ModalDetailLaborContract } from '../modal/ModalDetailLaborContract'

type LaborContractAdditional = {
  branch: BaseMaster
  position: BaseMaster
  labor_contract_type: BaseMaster
  employee: EmployeeType
}

export type ResponseType<T> = {
  data: T[]
}

const ListContractEmployees = () => {
  const { t } = useTranslation()
  const { systemSetting } = useAuth()

  const [openDetail, setOpenDetail] = useState<boolean>(false)
  const [dataDetail, setDataDetail] = useState<LaborContractType>()

  const columns = useMemo<Column<LaborContractType & LaborContractAdditional>[]>(
    () => [
      {
        Header: t('information.full_name'),
        accessor: 'employee',
        display: true,
        Cell: ({ row }) => {
          return (
            <ElipsisBox sx={{ minWidth: 'fit-content' }}>
              {row.original.employee.personal_information.full_name}
            </ElipsisBox>
          )
        }
      },
      {
        Header: t('labor_contract.code'),
        accessor: 'code',
        display: true,
        Cell: ({ value }) => {
          return <ElipsisBox sx={{ minWidth: 'fit-content' }}>{value}</ElipsisBox>
        }
      },
      {
        Header: t('labor_contract.type_labor_contract'),
        accessor: 'labor_contract_type_id',
        Cell: ({ row }) => <Box>{row.original.labor_contract_type?.name}</Box>,
        display: true
      },
      {
        Header: t('labor_contract.effective_date'),
        accessor: 'effective_date',
        Cell: ({ row }) => (
          <ElipsisBox>
            {formatDate(row.original.effective_date || '', systemSetting?.format_date)}
          </ElipsisBox>
        ),
        display: true
      },
      {
        Header: t('labor_contract.expire_date'),
        accessor: 'expire_date',
        Cell: ({ row }) => (
          <ElipsisBox>
            {row.original.expire_date
              ? formatDate(row.original.expire_date || '', systemSetting?.format_date)
              : ''}
          </ElipsisBox>
        ),
        display: true
      },
      {
        Header: t('application_form.status'),
        accessor: 'status',
        Cell: ({ value }) => <StatusLaborContract value={value} />,
        display: true
      }
    ],
    [systemSetting?.format_date, t]
  )

  const onRowClick = ({ original }: Row<LaborContractType>) => {
    setOpenDetail(true)
    setDataDetail(original)
  }

  const handleClose = () => {
    setOpenDetail(false)
  }

  return (
    <>
      <ReactTableWithToolBar
        endpoint={`${USER_URL}/labor-contract/user`}
        columns={columns}
        title={`${t('labor_contract.list_labor_contract')}`}
        isShowSearchFast={false}
        onRowClick={onRowClick}
        data={[]}
      />
      <ModalDetailLaborContract
        open={openDetail}
        handleClose={handleClose}
        dataDetail={dataDetail}
      />
    </>
  )
}

export { ListContractEmployees }

export const ElipsisBox = styled(Box)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: '80px',
  maxWidth: '100px'
})
