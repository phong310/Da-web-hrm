import { Grid } from '@mui/material'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TabPanel } from './TabPannel'

export interface TabProps {
  tabElement: TabElement[]
  checkTabIndex?: (index: number) => void
  rightElement?: React.ReactElement | JSX.Element
  tabValue: number
}

export interface TabElement {
  title?: React.ReactElement | JSX.Element | string
  element: React.ReactElement
}

const TabBase = (props: TabProps) => {
  const { tabElement, tabValue, rightElement } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <Pagev2>
      <Grid
        container
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
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
          ></Grid>
        )}
      </Grid>
      {tabElement.map((element, index) => {
        return (
          <TabPanel key={index} value={tabValue} index={index}>
            {React.cloneElement(element.element, { isDisableBreadcrumb: true })}
          </TabPanel>
        )
      })}
    </Pagev2>
  )
}
const styleTabs = {
  padding: '8px 12px 8px 12px',
  fontSize: '14px',
  minWidth: '118px',
  textAlign: 'center',
  fontWeight: '600',
  lineHeight: '20px',
  whiteSpace: 'nowrap',
  borderRadius: '8px 8px 0 0',
  '& .Mui-selected': {
    backgroundColor: 'white',
    borderRadius: '5px',
    color: 'blue',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
    borderBottom: '2px solid #146BD2'
  },
  '& .MuiTabs-indicator': {
    backgroundColor: 'transparent'
  }
}
const styleTabItems = {
  padding: '7px 12px',
  maxWidth: 'none'
}
export { TabBase }

