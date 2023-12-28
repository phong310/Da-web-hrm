import { Box } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { EmployeeTabs } from './EmployeeTabs'
import { EmployeeForm } from './EmployeeForm'
export interface NavStyledInterface {
  active: boolean
}
// @ts-ignore
const EmployeeEditForm: React.VFC = (props) => {

  // @ts-ignore
  const { pathname } = useLocation()

  return (
    <PageTable isDisableBreadcrumb={false}>
      <RoundPaper>
        <Box sx={{ padding: '16px' }}>
          <EmployeeTabs />
          <EmployeeForm />
        </Box>
      </RoundPaper>
    </PageTable>
  )
}

export { EmployeeEditForm }
