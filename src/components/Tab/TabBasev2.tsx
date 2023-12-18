// @ts-nocheck
import { Grid, Tab, Tabs } from '@mui/material'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TabPanel, a11yProps } from './TabPannel'

export interface TabProps {
  tabElement: TabElement[]
  title?: string
  tabIndex?: number
  rightElement?: React.ReactElement | JSX.Element
}

export interface TabElement {
  title: React.ReactElement | JSX.Element | string
  element: React.ReactElement
}

const TabBasev2 = (props: TabProps) => {
  const { tabElement, tabIndex, rightElement, title } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { watch, setValue } = useForm<{ tabIndex: number }>({
    defaultValues: {
      tabIndex: tabIndex ?? 0
    }
  })

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue('tabIndex', newValue)
    navigate('', { state: { tabIndex: newValue } })
  }
  return (
    <Pagev2 title={title}>
      <Grid
        container
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }}>
          <Tabs
            value={watch('tabIndex')}
            onChange={handleChange}
            sx={{ ...tabListStyle }}
            aria-label="icon label tabs example"
          >
            {tabElement.map((element, index) => {
              return (
                <Tab
                  sx={{ ...tabItemStyle }}
                  key={index}
                  icon={element.title}
                  {...a11yProps(index)}
                />
              )
            })}
          </Tabs>
        </Grid>

        {rightElement ? (
          { rightElement }
        ) : (
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            {/* <Button variant="outlined" sx={{ height: '40px', marginLeft: 2 }}>
            <LogoutIcon />
            <Typography sx={{ textTransform: 'none' }}>{t('export')}</Typography>
          </Button> */}
          </Grid>
        )}
      </Grid>
      {tabElement.map((element, index) => {
        return (
          <TabPanel key={index} value={watch('tabIndex')} index={index}>
            {React.cloneElement(element.element, { isDisableBreadcrumb: true })}
          </TabPanel>
        )
      })}
    </Pagev2>
  )
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
  fontSize: { xs: '14px !important', sm: '16px !important' },
  backgroundColor: '#f0f0f0',
  '&:hover': {
    backgroundColor: '#fff',
    borderBottom: '2px solid #146BD2'
  },

  '@media (min-width: 1024px) and (max-width: 1366px)': {
    minWidth: '150px'
  }
}

const tabListStyle = {
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
  '& .MuiTabs-scroller': {
    overflow: 'auto !important',
    '::-webkit-scrollbar': { width: 4, height: 8 },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: '#F0F0F0'
    }
  }
}

export { TabBasev2 }
