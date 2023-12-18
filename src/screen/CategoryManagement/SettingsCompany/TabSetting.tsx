// @ts-nocheck
import { TabElement } from 'components/Tab/TabBase'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { CompanyInfo } from './CompanyInfo'
import { CompanySetting } from '.'
import { TabBasev2 } from 'components/Tab/TabBasev2'
export const TabSetting = () => {
  const { t } = useTranslation()
  const location: any = useLocation()
  const tabElements: TabElement[] = [
    {
      title: t('companies.steps.information'),
      element: <CompanyInfo />
    },
    {
      title: t('companies.steps.settings'),
      element: <CompanySetting />
    }
  ]
  return (
    <>
      <TabBasev2 tabElement={tabElements} tabIndex={location?.state?.tabIndex ?? 0} />
    </>
  )
}

