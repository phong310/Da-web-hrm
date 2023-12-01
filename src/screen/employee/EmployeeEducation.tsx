import { Box } from '@mui/material'
import React from 'react'
import { EmployeeTabs } from './EmployeeTabs'
import { ListEmployeeEducation } from './ListEmployeeEducation'
import { PageTable } from 'components/Layouts/Page/PageTable'

const EmployeeEducation: React.VFC = () => {
  return (
    <PageTable>
      <Box sx={{ paddingTop: '16px' }}>
        <EmployeeTabs />
        <ListEmployeeEducation />
      </Box>
    </PageTable>
  )
}

export { EmployeeEducation }
