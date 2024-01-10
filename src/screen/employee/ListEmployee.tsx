import { Typography } from '@mui/material'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import { CellValue, ColumnInterface, Row } from 'react-table'
import { BaseMaster } from 'lib/types/baseMaster'
import { EmployeeType } from 'lib/types/user'
import { ADMIN_URL, V1 } from 'constants/apiVersion'
import { Employee } from 'lib/types/employee'
import { STATUS_EMPLOYEE_OPTIONS } from 'lib/utils/contants'
import { StatusEmployee } from './Atom/StatusEmployee'
import { TimesheetEmployee } from 'screen/timesheet/components/TimesheetEmployee'

type BaseMasterResponse = {
  data: BaseMaster[]
}

const ListEmployee: React.VFC = () => {
  const [positionList, setPositionList] = useState<BaseMaster[]>([])
  const [departmentList, setDepartmentList] = useState<BaseMaster[]>([])
  const [branchList, setBranchList] = useState<BaseMaster[]>([])
  const navigate = useNavigate()
  const { t } = useTranslation()

  useQuery<BaseMasterResponse>([`${V1}/user/department?per_page=100`], {
    onSuccess: (data: any) => {
      setDepartmentList(data.data)
    }
  })

  useQuery<BaseMasterResponse>([`${V1}/user/position?per_page=100`], {
    onSuccess: (data) => {
      setPositionList(data.data)
    }
  })

  useQuery<BaseMasterResponse>([`${V1}/user/branch?per_page=100`], {
    onSuccess: (data) => {
      setBranchList(data.data)
    }
  })

  const onRowClick = ({ original }: Row<Employee>) => {
    navigate('/employees/edit/' + original.id)
  }

  const onCreate = () => {
    navigate('/employees/create')
  }

  const onActionEdit = (original: any) => {
    navigate('/employees/edit/' + original?.row.original.id)
  }

  const columns = useMemo<ColumnInterface<EmployeeType>[]>(
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
        Header: t('employee.full_name'),
        accessor: 'personal_information.full_name',
        display: true,
        Cell: ({ row }: { row: any }) => (
          <TimesheetEmployee
            employee_code={row.original.employee_code}
            avatar={
              row.original?.personal_information?.avatar?.indexOf('https') !== -1
                ? row.original?.personal_information?.avatar?.substring(
                    row.original?.personal_information?.avatar?.indexOf('https')
                  )
                : null
            }
            fullname={row.original.personal_information?.full_name}
            job={row.original?.position?.name}
          />
        )
      },
      {
        Header: t('information.email'),
        accessor: 'personal_information.email',
        display: true
      },
      {
        Header: t('employee.department'),
        accessor: 'department.name',
        display: true
      },
      {
        Header: t('employee.branch'),
        accessor: 'branch.name',
        display: true
      },
      {
        Header: t('status'),
        accessor: 'status',
        Cell: ({ row }: any) => <StatusEmployee value={row?.original?.status} />,
        display: true
      }
    ],
    []
  )

  const searchFieldsEmployees = [
    {
      Header: t('employee.full_name'),
      accessor: 'full_name',
      regex: 'none',
      type: 'text',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('application_form.status'),
      accessor: 'status',
      additionSearchProps: {
        options: STATUS_EMPLOYEE_OPTIONS
      },
      searchType: 'select',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('department'),
      accessor: 'department',
      additionSearchProps: {
        options: departmentList.map((d) => ({
          ...d,
          value: d.id,
          label: d.name
        }))
      },
      searchType: 'select',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('position'),
      accessor: 'position',
      additionSearchProps: {
        options: positionList.map((d) => ({
          ...d,
          value: d.id,
          label: d.name
        }))
      },
      searchType: 'select',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    },
    {
      Header: t('branch'),
      accessor: 'branch',
      additionSearchProps: {
        options: branchList.map((d) => ({
          ...d,
          value: d.id,
          label: d.name
        }))
      },
      searchType: 'select',
      regex: 'none',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    }
  ]
  return (
    <ReactTableWithToolBar
      endpoint={`${V1}/user/employee`}
      columns={columns}
      searchColumns={searchFieldsEmployees}
      onRowClick={onRowClick}
      onActionCreate={onCreate}
      onActionEdit={onActionEdit}
      // defaultActionDelete={true}
      // deleteApi={deleteApi}
      isShowSearchFast={false}
      exportUrl={`${ADMIN_URL}/employee/export`}
      importUrl={`${ADMIN_URL}/employee/import`}
      templateUrl={`${ADMIN_URL}/employee/template`}
      exportFileName="employees.xlsx"
      titleDeleteAppBar={t('title_modal.delete_employee')}
      title={t('employee.list')}
      titlePage={t('employee.list')}
      isDisableBreadcrumb={true}
      titleDelete={t('employee.delete_text_emp')}
      data={[]}
      quickSearchField={{ accessor: 'full_name' }}
    />
  )
}

export { ListEmployee }
