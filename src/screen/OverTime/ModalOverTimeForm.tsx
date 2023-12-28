import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Grid,
  Hidden,
  IconButton,
  Stack,
  styled,
  Toolbar,
  Typography
} from '@mui/material'
import { useAtomValue } from 'jotai'

import { request } from 'lib/request'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { useAuth } from 'lib/hook/useAuth'
import { useApiResource } from 'lib/hook/useApiResource'
import {
  HolidayType,
  ModelHasApproversType,
  OvertimeFormType,
  STATUS_FORM,
  TYPE_FORM
} from 'lib/types/applicationForm'
import {
  convertDatetimeTZ,
  convertDatetimeUTC,
  convertLocalDatetimeToTZ,
  formatDate,
  formatDateTime,
  formatISODate,
  formatNormalTime
} from 'lib/utils/format'
import {
  addOneDayWhenZeroHour,
  getDayIdInDate,
  getLastDateinMonth,
  isCompensatoryWorkingDay,
  isHoliday,
  isWorkingDay,
  subOneDayWhenZeroHour
} from 'lib/utils/datetime'
import { Select, SelectOption } from 'components/Form/Autocomplete/Select'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { checkFormIsDisableEdit, checkIsManager } from 'lib/utils/misc'
import { Permissions } from 'constants/permissions'
import { EmployeeType } from 'lib/types/user'
import { CompensatoryWorkingDayData, WorkingDayData } from 'lib/types/timeSheet'
import { V1 } from 'constants/apiVersion'
import { EmployeeSummaryInfo } from 'screen/leaveForm/EmployeeSummaryInfo'
import { ApprovalInformation } from 'screen/leaveForm/ApprovalInformation'
import { minutesToHours } from '../../lib/utils/datetime'
import { TimePicker } from 'components/Form/Input/TimePicker'
import { Input } from 'components/Form/Input/Input'
import { FooterApplication } from 'screen/leaveForm/FooterApplication'
import { addHours } from '../../lib/utils/datetime'
import { TYPE_SETTING_TYPES_OT } from 'lib/utils/contants'
import { SettingTypesOvertimeType } from 'lib/types/settingTypesOvertime'
import { handleCalculateTotalOvertime } from 'lib/utils/total_overtime'
import { DatePicker } from 'components/Form/Input/DatePicker'
type DataResponse<T> = {
  data: T[]
}

type PropType = DialogProps & {
  onSuccess: () => void
  closeModalEdit: () => void
  idEdit?: number | null
  open?: boolean
  dateParams?: string | null
}

const ModalOverTimeForm: React.VFC<PropType> = ({
  open,
  dateParams,
  idEdit,
  onSuccess,
  closeModalEdit
}) => {
  const queryString = window.location.search
  // @ts-ignore
  const urlParams = new URLSearchParams(queryString)
  const { permissions, user } = useAuth()
  // @ts-ignore
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location: any = useLocation()
  const { createOrUpdateApi } = useApiResource<OvertimeFormType>('1.0/user/overtime-form')
  const { control, handleSubmit, setValue, watch, reset, setError, clearErrors } =
    useForm<OvertimeFormType>({
      defaultValues: {
        start_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        end_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        date: dateParams || formatDateTime(convertLocalDatetimeToTZ(new Date())),
        reason: '',
        approval_deadline: formatDateTime(getLastDateinMonth()),
        note: '',
        approver_id_1: NaN,
        approver_id_2: NaN
      }
    })
  const [loading, setLoading] = useState<boolean>(true)

  const [approvers, setApprovers] = useState<SelectOption[]>([])
  const [isAprroverApprove, setApproverApprove] = useState(false)
  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])
  const [totalOvertime, setTotalOvertime] = useState<number>(120)

  const systemSetting: any = useAtomValue(systemSettingAtom)
  const isManager = checkIsManager(location.pathname)
  const isEdit = idEdit !== null && idEdit !== undefined
  const isManagerEdit =
    permissions?.includes(Permissions.overtimeManage) && isManager && idEdit ? true : false

  const isDisaleEdit =
    isEdit === false
      ? false
      : checkFormIsDisableEdit(selectedApprovers) || watch('status') === STATUS_FORM['CANCEL']
  useQuery<EmployeeType[]>([`1.0/user/manager/approvers?type=${TYPE_FORM.OVERTIME}`], {
    onSuccess: (data) => {
      setApprovers(() =>
        data.map((item) => ({
          label: item.full_name,
          value: item.id
        }))
      )
    },
    onError: (error: any) => {
      toast.error(error.message)
    }
  })

  useQuery<OvertimeFormType>(
    [
      isManager
        ? `1.0/user/manager/form/${idEdit}?type=${TYPE_FORM['OVERTIME']}`
        : `1.0/user/overtime-form/${idEdit}`
    ],
    {
      onSuccess: (data) => {
        const myId = user?.employee_id
        let index = 0
        if (myId === data.approver_id_1) {
          index = 0
        }
        if (myId === data.approver_id_2) {
          index = 1
        }
        if (data.approvers[index].status === STATUS_FORM.UNAPPROVED) {
          setApproverApprove(true)
        }
        setValue('id', data.id)
        setSelectedApprovers(data.approvers)
        setTotalOvertime(parseInt(data.total_time_work))

        setValue('employee_id', data.employee_id)
        setValue(
          'start_time',
          formatDateTime(convertDatetimeTZ(data.start_time || '', systemSetting.time_zone))
        )
        setValue(
          'end_time',
          formatDateTime(
            subOneDayWhenZeroHour(convertDatetimeTZ(data.end_time || '', systemSetting.time_zone))
          )
        )
        setValue(
          'date',
          formatDateTime(convertDatetimeTZ(data.start_time || '', systemSetting.time_zone))
        )
        setValue('approver_id_1', data.approver_id_1)
        setValue('approver_id_2', data.approver_id_2)
        setValue('reason', data.reason)
        setValue('note', data.note)
        setValue('status', data.status)

        if (isEdit && !isManagerEdit) {
          setLoading(false)
        }
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
      enabled: !idEdit ? false : true
    }
  )

  const [workingDays, setWorkingDays] = useState<WorkingDayData[]>()
  useQuery<DataResponse<WorkingDayData>>([`1.0/user/working-day`], {
    onSuccess: (data) => {
      setWorkingDays(data.data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: !isManagerEdit && !isDisaleEdit ? true : false
  })

  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const onSubmit: SubmitHandler<OvertimeFormType> = async (value) => {
    if (isSubmit) return
    setIsSubmit(true)

    try {
      const data = value
      data['date'] = formatISODate(value['date'])
      data['total_time_work'] = totalOvertime.toString()
      data['start_time'] = formatDateTime(
        convertDatetimeUTC(`${data['date']} ${formatNormalTime(value['start_time'])}`)
      )

      data['end_time'] = formatDateTime(
        convertDatetimeUTC(
          addOneDayWhenZeroHour(`${data['date']} ${formatNormalTime(value['end_time'])}`)
        )
      )

      const res = await createOrUpdateApi(data)
      if (res.status == 200) {
        toast(res.data.message)
        onSuccess()
      }
    } catch (error: any) {
      toast.error(error.errors)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as keyof OvertimeFormType, { message: value as string })
        }
      }
    }
    setIsSubmit(false)
  }
  const [isCancel, setIsCancel] = useState<boolean>(false)
  const handleCancel = async () => {
    try {
      setIsCancel(true)
      const res = await request.patch(`${V1}/user/overtime-form/cancel/${idEdit}`)
      if (res.status == 200) {
        toast(res.data.message)
        onSuccess()
        setIsCancel(false)
      }
    } catch (error: any) {
      toast.error(error.errors)
      if (error.errors) {
        for (const [key, value] of Object.entries(error.errors)) {
          setError(key as any, { message: value as any })
        }
      }
    }
  }

  // Reset input when redirect from edit or manager edit to create form
  useEffect(() => {
    reset()
  }, [isEdit, isManagerEdit, reset, setValue])

  // Manager
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeType>()

  useQuery<EmployeeType>([`1.0/user/employee/${watch('employee_id')}/info`], {
    onSuccess: (data) => {
      setEmployeeInfo(data)
      setLoading(false)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: watch('employee_id') && isManagerEdit ? true : false
  })

  // @ts-ignore
  const [isSubmitAction, setIsSubmitAction] = useState<boolean>(false)
  const handleAction = async (action: string) => {
    setIsCancel(true)
    if (isSubmitAction) return
    if (!idEdit) return
    try {
      const res = await request.patch('1.0/user/manager/form/action/' + idEdit, {
        action,
        type: TYPE_FORM.OVERTIME,
        employee_id: watch('employee_id')
      })

      if (res.status == 200) {
        toast(res.data.message)
        setIsCancel(false)
        onSuccess()
      }
    } catch (error: any) {
      toast.error(error.message)
    }
    setIsCancel(false)
  }

  useEffect(() => {
    let workingDay = workingDays?.find((wd) => wd.day_in_week_id == getDayIdInDate(watch('date')))

    if (!workingDay) {
      workingDay = workingDays?.find((wd) => wd.day_in_week_id == 1)
    }
    if (workingDay) {
      if (!isEdit && !isManagerEdit && !isDisaleEdit && !isManager) {
        setValue('start_time', `${formatDate(watch('date'), 'yyyy/MM/dd')} ${workingDay.end_time}`)
        setValue('end_time', addHours(2, new Date(watch('start_time'))))
      }
    }
  }, [watch('date'), workingDays, isEdit])

  useEffect(() => {
    if (open && !isEdit) {
      reset()
      clearErrors()
      setApproverApprove(false)
      if (isEdit === false) {
        let workingDay = workingDays?.find(
          (wd) => wd.day_in_week_id == getDayIdInDate(watch('date'))
        )

        if (!workingDay) {
          workingDay = workingDays?.find((wd) => wd.day_in_week_id == 1)
        }
        if (workingDay) {
          if (!isEdit && !isManagerEdit && !isDisaleEdit && !isManager) {
            setValue(
              'start_time',
              `${formatDate(watch('date'), 'yyyy/MM/dd')} ${workingDay.end_time}`
            )
            setValue('end_time', addHours(2, new Date(watch('start_time'))))
          }
        }
      }
      if (dateParams) {
        setValue('date', dateParams)
      }
    }
  }, [open, isEdit, dateParams])
  const [holidays, setHolidays] = useState<HolidayType[]>([])
  useQuery<DataResponse<HolidayType>>([`1.0/user/holiday`], {
    onSuccess: (data) => {
      setHolidays(data.data)
    }
  })

  const [settingTypesOvertime, setSettingTypesOvertime] = useState<SettingTypesOvertimeType[]>([])
  useQuery<DataResponse<SettingTypesOvertimeType>>([`1.0/user/setting-types-overtime`], {
    onSuccess: (data) => {
      setSettingTypesOvertime(data.data)
    }
  })

  const [compensatoryWDs, setCompensatoryWDs] = useState<CompensatoryWorkingDayData[]>([])
  useQuery<DataResponse<CompensatoryWorkingDayData>>([`1.0/user/compensatory-working-day`], {
    onSuccess: (data) => {
      setCompensatoryWDs(data.data)
    }
  })

  useEffect(() => {
    let settingTypeOvertime = null
    if (holidays && workingDays) {
      if (isHoliday(watch('date'), holidays)) {
        settingTypeOvertime = settingTypesOvertime?.find(
          (sto) => sto.type == TYPE_SETTING_TYPES_OT.HOLIDAY
        )
      } else if (
        !isWorkingDay(watch('date'), workingDays, holidays) &&
        !isCompensatoryWorkingDay(watch('date'), compensatoryWDs)
      ) {
        settingTypeOvertime = settingTypesOvertime?.find(
          (sto) => sto.type == TYPE_SETTING_TYPES_OT.WEEKEND
        )
      } else {
        settingTypeOvertime = settingTypesOvertime?.find(
          (sto) => sto.type == TYPE_SETTING_TYPES_OT.AFTER_OFFICE_HOURS
        )
      }

      if (settingTypeOvertime) {
        setTotalOvertime(
          handleCalculateTotalOvertime(
            watch('start_time'),
            watch('end_time'),
            watch('date'),
            settingTypeOvertime
          )
        )
      }
    }
  }, [watch('start_time'), watch('end_time'), watch('date'), holidays, workingDays])

  const grid_input = {
    sm: 6,
    xs: 12
  }
  const grid_inputfull = {
    xs: 12
  }
  return (
    <Dialog open={open} maxWidth="md" sx={{ ...styleDialog }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
            {isEdit ? t('application_management.edit_ot') : t('application_management.create_ot')}
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="close" onClick={closeModalEdit}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {loading && (isEdit || isManagerEdit) ? (
          <ModalSkeleton />
        ) : (
          <Box>
            <Box sx={{ ...styleBoxContainer }}>
              <Grid container spacing={3}>
                {isManagerEdit ? (
                  <>
                    <Grid container item xs={12}>
                      <Typography sx={{ ...fontInfo }}>{t('information.employee')}</Typography>
                    </Grid>
                    <EmployeeSummaryInfo
                      fullName={employeeInfo?.personal_information?.full_name}
                      employeeId={watch('employee_id')}
                      branchName={employeeInfo?.branch?.name}
                      departmentName={employeeInfo?.department?.name}
                      positionName={employeeInfo?.position?.name}
                    />
                  </>
                ) : null}
                {selectedApprovers.length && isEdit ? (
                  <>
                    <Grid container item {...grid_input}>
                      <Typography sx={{ ...styleTitle }}>{t('approval_information')}</Typography>
                    </Grid>
                    {selectedApprovers.map((approver, index) => (
                      <ApprovalInformation
                        key={index}
                        fullName={approver.full_name}
                        status={approver.status}
                        approvalAt={approver.approval_time}
                        rejectAt={approver.rejected_time}
                      />
                    ))}
                  </>
                ) : null}

                <Grid item {...grid_input}>
                  <DatePicker
                    label={t('date')}
                    name="date"
                    maxDate={new Date()}
                    control={control}
                    fullWidth
                    disabled={!!(isManagerEdit || isDisaleEdit)}
                    helperText={
                      <span style={{ fontSize: '14px' }}>
                        {t('total_time') + ': '}
                        <span style={{ fontWeight: 700 }}>
                          {minutesToHours(Number(totalOvertime)) || '0h'}
                        </span>
                      </span>
                    }
                  />
                </Grid>
                <Grid item {...grid_input}>
                  <Stack direction="row" alignItems="flex-start" sx={{ gap: 1 }}>
                    <TimePicker
                      label={t('start_time')}
                      name="start_time"
                      control={control}
                      fullWidth
                      disabled={!!(isManagerEdit || isDisaleEdit)}
                    />
                    <TimePicker
                      label={t('end_time')}
                      name="end_time"
                      control={control}
                      fullWidth
                      disabled={!!(isManagerEdit || isDisaleEdit)}
                    />
                  </Stack>
                </Grid>
                <Grid item {...grid_input}>
                  <Select
                    label={t('application_form.approver_1')}
                    placeholder={t('application_form.placeholder_approver')}
                    name="approver_id_1"
                    options={approvers.filter(
                      (approver) => approver.value !== watch('approver_id_2')
                    )}
                    control={control}
                    fullWidth
                    disabled={!!(isManagerEdit || isDisaleEdit)}
                    required
                  />
                </Grid>

                <Grid item {...grid_input}>
                  <Select
                    label={t('application_form.approver_2')}
                    placeholder={t('application_form.placeholder_approver')}
                    name="approver_id_2"
                    options={approvers.filter(
                      (approver) => approver.value !== watch('approver_id_1')
                    )}
                    control={control}
                    fullWidth
                    disabled={!!(isManagerEdit || isDisaleEdit)}
                  />
                </Grid>
                <Grid item {...grid_inputfull}>
                  <Input
                    label={t('application_form.reason')}
                    placeholder={t('application_form.placeholder_reason')}
                    name="reason"
                    control={control}
                    fullWidth
                    disabled={!!(isManagerEdit || isDisaleEdit)}
                    sx={{ ...styleHeightInput }}
                    maxRows={3}
                    required
                  />
                </Grid>

                <Grid item {...grid_inputfull}>
                  <Input
                    label={t('application_form.note')}
                    placeholder={t('application_form.placeholder_note')}
                    name="note"
                    control={control}
                    sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                    multiline
                    rows={4}
                    fullWidth
                    disabled={!!(isManagerEdit || isDisaleEdit)}
                  />
                </Grid>
                <Hidden smDown>
                  <Grid item sm={5} />
                </Hidden>
                <Grid item sx={{ ...boxNote }} {...grid_inputfull}>
                  <i style={{ ...styleNote }}>{t('application_form.note_create')}</i>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </DialogContent>
      <Box
        sx={{ padding: '0px 10px 30px 10px' }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <FooterApplication
          handleAction={handleAction}
          handleCancel={handleCancel}
          isCancel={isCancel}
          isManagerEdit={isManagerEdit}
          isEdit={isEdit as boolean}
          loading={loading}
          isSubmit={isSubmit}
          isAprroverApprove={isAprroverApprove}
          isDisaleEdit={isDisaleEdit}
          status={watch('status')}
        />
      </Box>
    </Dialog>
  )
}

export const ButtonResponsive = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    maxWidth: '120px'
  }
}))
const styleNote = {
  fontWeight: 400,
  fontSize: 16,
  color: '#878C95'
}
const fontInfo = {
  fontWeight: 'bold',
  fontSize: { xs: '16px', sm: '18px' }
}
const boxNote = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 2,
  justifyContent: 'flex-start'
}
const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '16px' }
}
const styleDialog = {
  '.MuiDialogContent-root': { padding: { xs: 1, sm: 2 } },
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}
const styleBoxContainer = {
  padding: { xs: '10px 12px', sm: '10px 30px' },
  position: 'relative',
  overflow: 'auto',
  // Remove the '&' before '::webkit-scrollbar' and '::webkit-scrollbar-thumb'
  '::-webkit-scrollbar': { width: 2, height: 8 },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: '#F0F0F0'
  }
}

export const styleHeightInput = {
  height: { xs: '38px', sm: '42px' },
  fontSize: { xs: '14px', sm: '16px' }
}

export const styleTitle = {
  fontWeight: 'bold',
  color: '#146BD2',
  fontSize: { xs: 14, sm: 16, md: 18 }
}

export { ModalOverTimeForm }
