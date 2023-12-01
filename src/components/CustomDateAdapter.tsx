import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// import { useAuth } from 'lib/hooks'
import i18n from 'lib/lang/translations/i18n'
export default function CustomDateAdapter(options: any) {
  const adapter = new AdapterDateFns(options)
  const constructDayObject = (day: string) => ({ charAt: () => day })
  const languageLS = localStorage.getItem('language')
  return {
    ...adapter,

    getWeekdays() {
      const customWeekdaysOther = [
        i18n.t('working_day.week_days_calender_symbol.sunday'),
        i18n.t('working_day.week_days_calender_symbol.monday'),
        i18n.t('working_day.week_days_calender_symbol.tuesday'),
        i18n.t('working_day.week_days_calender_symbol.wednesday'),
        i18n.t('working_day.week_days_calender_symbol.thursday'),
        i18n.t('working_day.week_days_calender_symbol.friday'),
        i18n.t('working_day.week_days_calender_symbol.saturday')
      ]

      const customWeekdaysVi = [
        i18n.t('working_day.week_days_calender_symbol.monday'),
        i18n.t('working_day.week_days_calender_symbol.tuesday'),
        i18n.t('working_day.week_days_calender_symbol.wednesday'),
        i18n.t('working_day.week_days_calender_symbol.thursday'),
        i18n.t('working_day.week_days_calender_symbol.friday'),
        i18n.t('working_day.week_days_calender_symbol.saturday'),
        i18n.t('working_day.week_days_calender_symbol.sunday')
      ]

      const customWeekdays = languageLS === 'vi' ? customWeekdaysVi : customWeekdaysOther

      return customWeekdays.map((day: string) => constructDayObject(day))
    }
  }
}
