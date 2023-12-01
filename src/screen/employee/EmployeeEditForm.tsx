import { Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { RoundPaper } from 'components/Layouts/Page/RoundPaper'
import { EmployeeTabs } from './EmployeeTabs'
import { EmployeeForm } from './EmployeeForm'
export interface NavStyledInterface {
  active: boolean
}

const EmployeeEditForm: React.VFC = (props) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onNavigate = (path: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate(path)
  }
  const { t } = useTranslation()

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
