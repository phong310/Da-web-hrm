import { Box, Typography, styled } from '@mui/material'
import { SelectOption } from 'components/Form/Autocomplete/Select'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { USER_URL } from 'constants/apiVersion'
import { useAuth } from 'lib/hook/useAuth'
import { BaseMaster } from 'lib/types/baseMaster'
import { LaborContractType } from 'lib/types/labor-contract'
import { EmployeeType } from 'lib/types/user'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { CellValue, Column, Row } from 'react-table'
import { StatusLaborContract } from 'screen/labor-contract-employees/Atom/StatusLaborContract'
import { TimesheetEmployee } from 'screen/timesheet/components/TimesheetEmployee'

type LaborContractAdditional = {
  branch: BaseMaster
  position: BaseMaster
  labor_contract_type: BaseMaster
  employee: EmployeeType
}

const ListLaborContract = () => {
  const { t } = useTranslation()
  const { systemSetting } = useAuth()
  const [reasons, setReasons] = useState<SelectOption[]>()
  useQuery<LaborContractType[] | any>([`${USER_URL}/labor-contract-type`], {
    onSuccess: (data) => {
      setReasons(() =>
        data.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id
          }
        })
      )
    }
  })

  const navigate = useNavigate()

  const columns = useMemo<Column<LaborContractType & LaborContractAdditional>[]>(
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
        Header: t('information.full_name'),
        accessor: 'employee',
        display: true,
        Cell: ({ row }: { row: any }) => (
          <TimesheetEmployee
            employee_code={row?.original?.employee?.employee_code}
            avatar={row.original?.employee?.personal_information?.thumbnail_url}
            fullname={row.original?.employee?.personal_information?.full_name}
            job={row.original?.position?.name}
          />
        )
      },
      {
        Header: t('information.branch'),
        accessor: 'branch_id',
        Cell: ({ row }) => <ElipsisBox>{row.original?.branch?.name}</ElipsisBox>,
        display: true
      },
      {
        Header: t('labor_contract.code'),
        accessor: 'code',
        display: true,
        Cell: ({ value }) => {
          return <ElipsisBox>{value}</ElipsisBox>
        }
      },
      {
        Header: t('labor_contract.type_labor_contract'),
        accessor: 'labor_contract_type_id',
        Cell: ({ row }) => <Box>{row.original.labor_contract_type?.name}</Box>,
        display: true
      },
      {
        Header: t('labor_contract.number_of_effective_date'),
        accessor: 'expire_date',
        Cell: ({ row }) => {
          const expireDate: any = new Date(row.original.expire_date || '')
          const currentDate: any = new Date()
          const daysUntilExpiration = Math.ceil((expireDate - currentDate) / (1000 * 60 * 60 * 24))
          return <ElipsisBox sx={{ ml: { lg: 6, sm: 0 } }}>{daysUntilExpiration}</ElipsisBox>
        },
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

  const searchFields = [
    {
      Header: t('information.full_name'),
      accessor: 'full_name',
      searchType: 'text',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('labor_contract.type_labor_contract'),
      accessor: 'labor_contract_types',
      additionSearchProps: {
        options: reasons
      },
      searchType: 'select',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: '',
      accessor: 'is_expiring',
      searchType: 'switch',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    }
  ]

  const onRowClick = ({ original }: Row<LaborContractType>) => {
    navigate('/employees/labor-contract/list-contract/edit/' + original?.id)
  }

  const onActionEdit = (original: any) => {
    navigate('/employees/labor-contract/list-contract/edit/' + original?.row.original.id)
  }

  const onAddClick = () => {
    navigate('/employees/labor-contract/list-contract/create')
  }

  return (
    <ReactTableWithToolBar
      onActionEdit={onActionEdit}
      searchColumns={searchFields}
      endpoint={`${USER_URL}/labor-contract`}
      columns={columns}
      defaultActionEdit
      title={`${t('labor_contract.list_labor_contract')}`}
      titlePage={`${t('labor_contract.list_labor_contract')}`}
      isShowSearchFast={false}
      onActionCreate={onAddClick}
      onRowClick={onRowClick}
      data={[]}
    />
  )
}

export { ListLaborContract }

export const ElipsisBox = styled(Box)({
  whiteSpace: 'nowrap'
})
