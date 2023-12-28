import { Box, Tab, Tabs } from '@mui/material'
// import { TabBase } from 'components/Tab'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
export interface NavStyledInterface {
  active: boolean
}

// const ButtonStyled = styled(
//   ({ active, ...other }: NavStyledInterface & Omit<ButtonProps, keyof NavStyledInterface>) => (
//     <Button {...other} />
//   )
// )(({ theme, active }) => ({
//   padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
//   '&:hover': {
//     borderColor: 'none',
//     boxShadow: 'none',
//     borderBottom: '3px solid #404DA8',
//     color: '#404DA8'
//   },
//   borderColor: 'none',
//   boxShadow: 'none',
//   color: active ? '#404DA8' : theme.palette.grey[600],
//   fontSize: theme.spacing(1.75),
//   fontWeight: 600,
//   lineHeight: theme.spacing(3.5),
//   textTransform: 'capitalize',
//   borderRadius: 'unset',
//   borderBottom: active ? '3px solid #404DA8' : '3px solid transparent'
// }))

const EmployeeTabs: React.VFC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const { t } = useTranslation()
  // @ts-ignore
  const { pathname } = useLocation()
  const location = useLocation()

  const tabItems = [
    {
      path: '/employees/edit/' + params.id,
      label: t('general')
    },
    {
      path: '/employees/edit/' + params.id + '/bank-account',
      label: t('bank_account.name')
    },
    {
      path: '/employees/edit/' + params.id + '/identification-card',
      label: t('identity_paper.name')
    },
    {
      path: '/employees/edit/' + params.id + '/address',
      label: t('address.name')
    },
    {
      path: '/employees/edit/' + params.id + '/education',
      label: t('education.name')
    },
    {
      path: '/employees/edit/' + params.id + '/account-information',
      label: t('account_information.name')
    },
    {
      path: '/employees/edit/' + params.id + '/working-time-off',
      label: t('employee.working_time_off')
    },
    {
      path: '/employees/edit/' + params.id + '/relatives',
      label: t('employee.relatives')
    }
  ]
  const onNavigate = (path: string, tabIndex: number) => () => {
    navigate(path, { state: { tabIndex: tabIndex } })
  }

  // @ts-ignore
  const tabIndex = location.state?.tabIndex
  // @ts-ignore
  const [value, setValue] = React.useState(tabIndex || 0)
  return (
    <>
      <Box sx={{ width: { xs: '100%', sm: 'unset' }, bgcolor: 'background.paper' }}>
        <Tabs
          value={value}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
          sx={{
            '& .Mui-disabled': {
              opacity: '0.3 !important'
            }
          }}
        >
          {tabItems.map((item: any, index: number) => (
            <Tab
              key={index}
              onClick={onNavigate(item.path, index)}
              label={item.label}
              sx={{ fontSize: '16px' }}
            />
          ))}
        </Tabs>
      </Box>
    </>
  )
}

export { EmployeeTabs }
