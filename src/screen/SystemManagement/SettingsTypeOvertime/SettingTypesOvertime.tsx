
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import { TabBase } from 'components/Tab/TabBase'
import { SettingTypesOvertimeForm } from './SettingTypesOvertimeForm'
import { SETTING_TYPES_OVERTIME } from 'lib/utils/contants'

const SettingTypesOvertime: React.VFC = () => {
  const { t } = useTranslation()

  const tabElements = [
    {
      title: t('setting_types_overtime.ot_after_office_hours'),
      element: <SettingTypesOvertimeForm type={SETTING_TYPES_OVERTIME['AFTER_OFFICE_HOUR']} />
    },
    {
      title: t('setting_types_overtime.ot_weekend'),
      element: <SettingTypesOvertimeForm type={SETTING_TYPES_OVERTIME['WEEKEND']} />
    },
    {
      title: t('setting_types_overtime.ot_holiday'),
      element: <SettingTypesOvertimeForm type={SETTING_TYPES_OVERTIME['HOLIDAY']} />
    }
  ]

  return (
    <>
      <Typography
        sx={{
          ...styleTyporaphyTitle
        }}
      >
        {t('System_Management.set_overtime_type')}
      </Typography>
      <TabBase tabElement={tabElements} />
    </>
  )
}
const styleTyporaphyTitle = {
  fontSize: { xs: '18px', md: '20px', lg: '24px' },
  mb: 1,
  fontWeight: 800,
  margin: { xs: '16px 0 0 16px', sm: '32px 0 0 32px' },
  textTransform: 'uppercase',
  fontFamily: 'Lato',
  color: '#146BD2',
  lineHeight: '36px'
}
export { SettingTypesOvertime }
