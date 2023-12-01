import { yupResolver } from '@hookform/resolvers/yup'
import {
    Box,
    CircularProgress,
    DialogContentText,
    Grid,
    Stack,
    styled,
    Typography
} from '@mui/material'
import ReactTableWithToolBar from 'components/ReactTable/ReactTableWithToolBar/ReactTableWithToolBar'
import { TFunction } from 'i18next'
import { useAtom, useAtomValue } from 'jotai'
import i18n from 'lib/lang/translations/i18n'
import React, { ReactElement, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { CellProps } from 'react-table'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { EmployeeTabs } from './EmployeeTabs'
import { Select, SelectOption } from 'components/Form/Autocomplete/Select'
import { Input } from 'components/Form/Input/Input'
import { ButtonCommon } from 'components/Form/Components/ButtonCommon'
import { PageTable } from 'components/Layouts/Page/PageTable'
import { useApiResource } from 'lib/hook/useApiResource'
import { V1 } from 'constants/apiVersion'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { convertDatetimeTZV2, convertFormatDate, formatISODate } from 'lib/utils/format'
import { DialogBaseWithToolBar } from 'components/Dialog/DialogBaseWithToolBar'
import { TimeOff } from 'lib/types/timeOff'
import { TimeSheetProps } from 'screen/timesheet/TimeSheet'
import { NUMBER_OF_DAY_TYPES } from 'lib/utils/contants'
import { blue } from 'styles/colors'
import { monthCalendarAtom } from 'lib/atom/calendarAtom'

type ReturnType = {
  day: ReactElement | null
  hour: ReactElement | null
  minute: ReactElement | null
}
const EmployeeNumberTimeOff: React.VFC = () => {
  const params = useParams()

  const { t } = useTranslation()
  const [monthAtom, setMonthAtom] = useAtom(monthCalendarAtom)
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [reRender, setReRender] = useState(0)
  const [minutesRemains, setMinutesRemains] = useState<number>(0)
  const { deleteApi } = useApiResource(`${V1}/admin/number-of-days-off`)
  const { createApi } = useApiResource<TimeOff>(`${V1}/user/number-of-days-off`)
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(false)
  const [numberOfDaysOption, setNumberOfDayOption] = useState<SelectOption[]>([
    {
      label: i18n.t('number_of_days.types.annual_leave'),
      value: 1
    },
    {
      label: i18n.t('number_of_days.types.leave_form'),
      value: 2
    }
  ])

  const validateLeaveForm = yup.object({
    number_of_days: yup
      .number()
      .typeError(t('validate.field_date_type_error'))
      .positive()
      .required(t('validate.field_required'))
      .min(0, t('validate.min__date_value') + '0'),
    number_of_hours: yup
      .number()
      .typeError(t('validate.field_date_type_error'))
      .positive()
      .required(t('validate.field_required'))
      .min(0, t('validate.min_hours_value') + '0')
      .max(23, t('validate.max_hours_value') + '24'),
    number_of_minutes: yup
      .number()
      .typeError(t('validate.field_date_type_error'))
      .positive()
      .required(t('validate.field_required'))
      .min(0, t('validate.min_minutes_value') + '0')
      .max(59, t('validate.max_minutes_value') + '60'),
    type: yup
      .number()
      .typeError(t('validate.field_date_type_error'))
      .required(t('validate.field_required'))
      .oneOf([1, 2], t('validate.require'))
  })
  const { control, setError, reset, watch, setValue, handleSubmit } = useForm<TimeOff>({
    defaultValues: {
      date: formatISODate(new Date()),
      //@ts-ignore
      employee_id: parseInt(params.id),
      number_of_minutes: 0,
      number_of_hours: 0,
      number_of_days: 0,
      type: 0
    },
    //@ts-ignore
    resolver: yupResolver(validateLeaveForm)
  })
  const { control: monthControl, watch: watchMonth } = useForm<TimeSheetProps>({
    defaultValues: {
      month: monthAtom ? formatISODate(monthAtom) : formatISODate(new Date())
    }
  })
  const { refetch } = useQuery<{ annual_leave: number; leave_form: number }>(
    [`${V1}/user/number-of-days-off/remaining-days-off?employee_id=${params.id}`],
    {
      onSuccess: (data) => {
        setMinutesRemains(data.annual_leave - data.leave_form)
      }
    }
  )

  const showMinutesRemains = (
    <Typography variant="h6" component="span" sx={{ fontSize: '24px', fontWeight: 'bold' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <TitleText>{t('employee.time_off_remains')} : </TitleText>
        </Box>
        <Stack direction="row" spacing={1}>
          {minutesToDays(minutesRemains, 'component', t)}
        </Stack>
      </Stack>
    </Typography>
  )

  const onCreate = () => {
    setOpenModal(true)
  }

  const handleClose = () => {
    setOpenModal(false)
    setReRender(reRender + 1)
    reset({}, { keepValues: true })
  }

  const forceReRender = (value: number) => {
    setReRender((prev) => prev + value)
  }

  const grid = { md: 4, xs: 4 }
  const gridSelect = { xs: 12, md: 8 }

  useEffect(() => {
    const number_of_minutes = watch('number_of_minutes')
    const number_of_hours = watch('number_of_hours')
    const number_of_days = watch('number_of_days')

    if (
      number_of_minutes === 1 ||
      number_of_minutes === 60 ||
      number_of_hours === 1 ||
      number_of_hours === 60 ||
      number_of_days === 1
    ) {
      setIsSubmitDisabled(true)
    } else {
      setIsSubmitDisabled(false)
    }
  }, [watch('number_of_minutes'), watch('number_of_hours'), watch('number_of_days')])

  const onSubmit: SubmitHandler<TimeOff> = async (value) => {
    const totalMinutes =
      watch('number_of_days') * 480 + watch('number_of_hours') * 60 + watch('number_of_minutes') * 1
    try {
      if (watch('number_of_days') + watch('number_of_hours') + watch('number_of_minutes') === 0) {
        toast.error(t('validate.vacation_time'))
        return
      }
      setIsSubmitDisabled(true)

      //@ts-ignore
      const res = await createApi({
        ...value,
        number_of_minutes: totalMinutes
      })

      if (res.status == 200) {
        //@ts-ignore
        const message = res.data.message
        toast.success(message)
        setLoading(!loading)
        setIsSubmitDisabled(false)
      }

      handleClose()
      setValue('number_of_minutes', 0)
      setValue('number_of_days', 0)
      setValue('number_of_hours', 0)
      setValue('type', 0)

      forceReRender(1)
    } catch (error:any) {
      setIsSubmitDisabled(false)
      toast.error(error.error)
      if (error.errors) {
        Object.keys(error.errors).forEach((key: any) => {
          const splitKey = key.split('.')
          setError(key, { message: t(`validate.${splitKey[splitKey.length - 1]}`) })
        })
      }
    }
  }

  const EmployeeTimeOffFields = {
    listFields: [
      {
        Header: t('employee.date'),
        accessor: 'date',
        Cell: ({ row }: any) => {
          return convertFormatDate(
            convertDatetimeTZV2(row.original.date, systemSetting.time_zone),
            systemSetting.format_date
          )
        },
        display: true
      },
      {
        Header: t('employee.number_of_leave_time'),
        accessor: 'number_of_minutes',
        Cell: ({ value }: CellProps<TimeOff>) => {
          return minutesToDays(value, 'string', undefined)
        },
        display: true
      },
      {
        Header: t('number_of_days.type'),
        accessor: 'type',
        Cell: ({ value }: CellProps<TimeOff>) => {
          //@ts-ignore
          return NUMBER_OF_DAY_TYPES[value]
        },
        display: true
      }
    ],
    searchFields: [
      {
        Header: t('employee.date'),
        accessor: 'date',
        type: 'text',
        grid: { xs: 12, sm: 6, md: 6 },
        display: true
      }
    ],
    quickSearchField: {
      Header: t('employee.date'),
      accessor: 'date',
      type: 'text',
      grid: { xs: 12, sm: 6, md: 6 },
      display: true
    }
  }

  useEffect(() => {
    setMonthAtom(watchMonth('month') as string)
  }, [watchMonth('month'), setMonthAtom])

  useEffect(() => {
    refetch()
  }, [reRender])

  const onCancel = () => {
    setOpenModal(false)
  }

  return (
    <PageTable>
      <Box sx={{ paddingTop: '16px' }}>
        <EmployeeTabs />
        <ReactTableWithToolBar
          isDisableBreadcrumb={true}
          isShowSearchFast={false}
          paperOptions={{ elevation: 0 }}
          endpoint={`${V1}/user/number-of-days-off/employee/${params.id}`}
          columns={EmployeeTimeOffFields.listFields}
          quickSearchField={EmployeeTimeOffFields.quickSearchField}
          defaultActionDelete
          onActionCreate={onCreate}
          title={showMinutesRemains}
          displayTitle={true}
          deleteApi={deleteApi}
          data={[]}
          loading={loading}
          forceReRender={forceReRender}
          reRender={reRender}
          titleDelete={t('employee.delete_text_time_off_remains')}
          sxCustom={{
            padding: 0,
            width: '100% important',
            marginTop: 0,
            marginBottom: 2
          }}
        />
        <DialogBaseWithToolBar
          open={openModal}
          title={t('employee.add_time_remains')}
          onClose={() => setOpenModal(false)}
          maxWidth="md"
        >
          <React.Fragment>
            <Grid container spacing={2} component="form" onSubmit={handleSubmit(onSubmit)} mt={2}>
              <Grid item {...gridSelect}>
                <Select
                  options={numberOfDaysOption}
                  fullWidth
                  label={t('number_of_days.type')}
                  name="type"
                  control={control}
                />
              </Grid>
              <Grid item container xs={12} spacing={2}>
                <Grid item {...grid}>
                  <Input
                    type="number"
                    fullWidth
                    label={t('day').toUpperCase()}
                    name="number_of_days"
                    control={control}
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    type="number"
                    fullWidth
                    label={t('hour').toUpperCase()}
                    name="number_of_hours"
                    control={control}
                  />
                </Grid>
                <Grid item {...grid}>
                  <Input
                    type="number"
                    fullWidth
                    label={t('minute').toUpperCase()}
                    name="number_of_minutes"
                    control={control}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <DialogContentText>
                  {t('note') + ': ' + t('employee.leave_time_note.working_day')}
                </DialogContentText>
              </Grid>

              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                gap={2}
                style={{ margin: '20px 0' }}
                xs={12}
              >
                <Grid xs={4} sm={3} md={2}>
                  <Box>
                    <ButtonCommon onClick={onCancel} variant="outlined" error={true}>
                      {t('cancel')}
                    </ButtonCommon>
                  </Box>
                </Grid>
                <Grid xs={4} sm={3} md={2}>
                  <Box>
                    <ButtonCommon
                      startIcon={
                        isSubmitDisabled ? <CircularProgress color="inherit" size="16px" /> : ''
                      }
                      type="submit"
                      variant="contained"
                      disabled={isSubmitDisabled}
                    >
                      {t('submit')}
                    </ButtonCommon>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        </DialogBaseWithToolBar>
      </Box>
    </PageTable>
  )
}

export function minutesToDays<ReturnType>(
  minutes: number,
  returnType: string,
  t: TFunction | undefined
) {
  let day = 0
  let hour = 0
  let minute = 0

  const absMinutes = Math.abs(minutes)

  day = Math.floor(absMinutes / 480)

  hour = Math.floor((absMinutes - day * 480) / 60)

  minute = absMinutes - day * 480 - hour * 60

  return returnType === 'string' ? (
    <Stack direction="row" spacing={0.5}>
      {minutes < 0 ? '- ' : ''}
      {day ? (
        <Typography variant="body2">
          {day}
          <SubTextTable> d </SubTextTable>
        </Typography>
      ) : null}
      {hour ? (
        <Typography variant="body2">
          {hour}
          <SubTextTable> h </SubTextTable>
        </Typography>
      ) : null}
      {minute ? (
        <Typography variant="body2">
          {minute}
          <SubTextTable> m </SubTextTable>
        </Typography>
      ) : null}
    </Stack>
  ) : (
    <Stack direction="row" spacing={1} color={blue[700]}>
      {minutes < 0 ? '- ' : ''}

      {day && t ? (
        <MinuteText variant="h6">
          {day}
          <SubText>{t('day')}</SubText>
        </MinuteText>
      ) : null}
      {hour && t ? (
        <MinuteText variant="h6">
          {hour}
          <SubText>{t('hour')}</SubText>
        </MinuteText>
      ) : null}
      {minute && t ? (
        <MinuteText variant="h6">
          {minute}
          <SubText>{t('minute')}</SubText>
        </MinuteText>
      ) : null}
    </Stack>
  )
}

const SubText = styled('span')({
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'lighter',
  fontStyle: 'italic',
  marginLeft: '2px'
})
const SubTextTable = styled('span')({
  textTransform: 'none',
  fontSize: '12px',
  fontWeight: 900,
  opacity: '0.6',
  alignSelf: 'center',
  position: 'relative',
  left: '-2px'
})

const TitleText = styled(Typography)({
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '24px',
  fontFamily: 'Lato'
})

const MinuteText = styled(Typography)({
  color: blue[700],
  fontSize: '24px',
  fontWeight: 'bold'
})

export { EmployeeNumberTimeOff }

