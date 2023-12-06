import { Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'

const EmployeeTabv2 = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [value, setValue] = useState(0)

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  const tabs = [
    { label: t('information.user_info'), path: '/general/profile' },
    { label: t('information.bank_account'), path: '/general/profile/bank-account' },
    { label: t('information.identification'), path: '/general/profile/identification' },
    { label: t('companies.address'), path: '/general/profile/address' }
  ]

  const currentTab = tabs.findIndex((tab) => !!matchPath(tab.path, pathname))

  return (
    <>
      <Tabs
        sx={{ ...tabListStyle }}
        value={currentTab}
        onChange={handleChange}
        indicatorColor="primary"
      >
        {tabs.map((tab, index) => (
          <Tab
            sx={{ ...tabItemStyle }}
            key={index}
            label={tab.label}
            onClick={() => navigate(tab.path)}
          />
        ))}
      </Tabs>
    </>
  )
}

const tabListStyle = {
  mt: 2,
  color: '#878C95',
  borderRadius: '8px 8px 0 0',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '20px',
  textTransform: 'inherit',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  '@media (max-width: 600px)': {
    minWidth: 0
  },
  '@media (min-width: 768px) and (max-width: 1180px)': {
    minWidth: '150px'
  },
  '& .Mui-selected': {
    color: '#404DA8',
    backgroundColor: '#fff',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)'
  },
  '&.MuiTabs-flexContainer': {
    gap: '8px'
  }
}

const tabItemStyle = {
  minWidth: { xs: '118px', sm: '150px', md: '195px' },
  textAlign: 'center',
  textTransform: 'inherit',
  color: '#878C95',
  padding: { xs: '6px', sm: '12px 16px' },
  whiteSpace: 'nowrap',
  borderRadius: '8px 8px 0 0',
  marginRight: '4px',
  fontSize: '16px',
  backgroundColor: '#f0f0f0',
  '&:hover': {
    backgroundColor: '#fff',
    borderBottom: '2px solid #146BD2'
  },
  '&.MuiButtonBase-root .MuiTypography-root': {
    fontSize: { xs: '14px', sm: '16px' },
    fontWeight: 600
  },
  '@media (min-width: 1024px) and (max-width: 1366px)': {
    minWidth: '150px'
  }
}
export { EmployeeTabv2 }

