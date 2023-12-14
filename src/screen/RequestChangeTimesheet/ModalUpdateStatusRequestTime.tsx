import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import ForwardOutlinedIcon from '@mui/icons-material/ForwardOutlined'
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'
import { styled } from '@mui/system'
import { GridCloseIcon } from '@mui/x-data-grid'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { Status } from 'components/Status/Status'
import { V1 } from 'constants/apiVersion'
import { Permissions } from 'constants/permissions'
// import { Permissions, STATUS_FORM, TYPE_FORM, V1 } from 'constants'
import { useAtomValue } from 'jotai'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { useAuth } from 'lib/hook/useAuth'
// import { systemSettingAtom } from 'lib/atom'
// import { useAuth } from 'lib/hooks'
import { request } from 'lib/request'
import {
  ModelHasApproversType,
  RequestChangeTimesheetFormType,
  STATUS_FORM,
  TYPE_FORM
} from 'lib/types/applicationForm'
import { WorkingDayData } from 'lib/types/timeSheet'
import { EmployeeType } from 'lib/types/user'
import { getLastDateinMonth } from 'lib/utils/datetime'
import {
  convertDatetimeTZ,
  convertDatetimeTZWithoutSecond,
  convertLocalDatetimeToTZ,
  formatDateTime,
  formatISODate,
  formatTime
} from 'lib/utils/format'
import { checkFormIsDisableEdit } from 'lib/utils/misc'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { BoxItem } from 'screen/OverTime/ModalUpdateStatusOvertime'
import { Approvers } from 'screen/application/Atoms/Approvers'
import { EmployeeSummaryInfov2 } from 'screen/leaveForm/EmployeeSummaryInfov2'
import { FooterApplication } from 'screen/leaveForm/FooterApplication'
import { Green, Red, Yellow, blue } from 'styles/colors'

type WorkingDayResponse = {
  data: WorkingDayData[]
}
type PropType = DialogProps & {
  open?: boolean
  idEdit?: number | null
  handleCloseModal: () => void
  onSuccessEdit: () => void
}

const ModalUpdateStatusRequestTime: React.VFC<PropType> = ({
  open,
  idEdit,
  handleCloseModal,
  onSuccessEdit
}) => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const { permissions, user } = useAuth()
  const { t } = useTranslation()
  const { control, handleSubmit, setValue, watch, getValues, setError, clearErrors, reset } =
    useForm<RequestChangeTimesheetFormType>({
      defaultValues: {
        check_in_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        check_out_time: formatDateTime(convertLocalDatetimeToTZ(new Date())),
        approver_id_1: undefined,
        approver_id_2: undefined,
        approval_deadline: formatISODate(getLastDateinMonth()),
        note: undefined,
        date: urlParams.get('date') || String(new Date(new Date().valueOf() - 1000 * 60 * 60 * 24))
      }
    })
  const [dataDetail, setDataDetail] = useState<RequestChangeTimesheetFormType>()
  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isAprroverApprove, setApproverApprove] = useState(false)
  const systemSetting: any = useAtomValue(systemSettingAtom)
  const isEdit = idEdit !== null && idEdit !== undefined
  const isManagerEdit = permissions?.includes(Permissions.overtimeManage) && idEdit ? true : false
  const isDisaleEdit =
    idEdit === null
      ? false
      : checkFormIsDisableEdit(selectedApprovers) || watch('status') === STATUS_FORM['CANCEL']

  useQuery<RequestChangeTimesheetFormType>(
    [`1.0/user/manager/form/${idEdit}?type=${TYPE_FORM['REQUEST_CHANGE_TIMESHEET']}`],
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
        setDataDetail(data)
        setValue('id', data.id)
        setSelectedApprovers(data.approvers)
        setValue('employee_id', data.employee_id)
        setValue('date', data.date)
        setValue(
          'check_in_time',
          formatDateTime(convertDatetimeTZ(data.check_in_time || '', systemSetting.time_zone))
        )
        setValue(
          'check_out_time',
          formatDateTime(convertDatetimeTZ(data.check_out_time || '', systemSetting.time_zone))
        )
        setValue('approver_id_1', data.approver_id_1)
        setValue('approver_id_2', data.approver_id_2)

        setValue('status', data.status)
        setValue(
          'approval_deadline',
          data.approval_deadline ? data.approval_deadline : formatISODate(getLastDateinMonth())
        )
        setValue('note', data.note)

        setLoading(false)
      },
      onError: (error: any) => {
        toast.error(error.message)
      },
      enabled: !idEdit ? false : true
    }
  )

  const [workingDays, setWorkingDays] = useState<WorkingDayData[]>()
  useQuery<WorkingDayResponse>([`1.0/user/working-day`], {
    onSuccess: (data) => {
      setWorkingDays(data.data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: !isManagerEdit && !isDisaleEdit ? true : false
  })

  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const [isCancel, setIsCancel] = useState<boolean>(false)

  const handleCancel = async () => {
    try {
      setIsCancel(true)
      const res = await request.patch(`${V1}/user/request-change-timesheet/cancel/${idEdit}`)
      if (res.status == 200) {
        toast(res.data.message)
        setIsCancel(false)
        onSuccessEdit()
        handleCloseModal()
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
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeType>()

  useQuery<EmployeeType>([`1.0/user/employee/${watch('employee_id')}/info`], {
    onSuccess: (data) => {
      setEmployeeInfo(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: !watch('employee_id') ? false : true
  })

  const handleAction = async (action: string) => {
    setIsCancel(true)
    if (isCancel) return
    if (!idEdit) return
    try {
      const res = await request.patch('1.0/user/manager/form/action/' + idEdit, {
        action,
        type: TYPE_FORM.REQUEST_CHANGE_TIMESHEET,
        employee_id: watch('employee_id')
      })

      if (res.status == 200) {
        toast(res.data.message)
        setIsCancel(false)
        onSuccessEdit()
        handleCloseModal()
      }
    } catch (error: any) {
      toast.error(error.message)
    }
    setIsCancel(false)
  }
  return (
    <Dialog open={open} sx={{ ...stylePopUp }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ ...styleTitleDialog }}>
            {t('application_management.detail_rqct')}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            sx={{ ...iconButton }}
            onClick={handleCloseModal}
          >
            <GridCloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {loading ? (
        <ModalSkeleton />
      ) : (
        <DialogContent sx={{ ...styleDialog }}>
          <Box>
            {isManagerEdit && isEdit !== null && isEdit !== undefined ? (
              <>
                <Grid container item xs={12}>
                  <Typography sx={{ ...styleTitle }}>{t('information.employee')}</Typography>
                </Grid>
                <EmployeeSummaryInfov2
                  fullName={employeeInfo?.personal_information?.full_name}
                  employeeId={watch('employee_id')}
                  avatar={employeeInfo?.personal_information?.thumbnail_url}
                  branchName={employeeInfo?.branch?.name}
                  departmentName={employeeInfo?.department?.name}
                  positionName={employeeInfo?.position?.name}
                />
              </>
            ) : null}
            <Box>
              <Grid
                display={'flex'}
                justifyContent={'space-evenly'}
                sx={{ mb: 4 }}
                textAlign={'center'}
              >
                <BoxTimeStyle status={dataDetail?.status as number}>
                  <Typography
                    variant="subtitle1"
                    sx={{ ...styleTime, color: getStatusColor(dataDetail?.status as number) }}
                    component="div"
                  >
                    {convertDatetimeTZWithoutSecond(
                      dataDetail?.check_in_time,
                      systemSetting.time_zone,
                      systemSetting.format_date
                    )}
                  </Typography>
                </BoxTimeStyle>
                <Box>
                  <ForwardOutlinedIcon
                    sx={{
                      ...styleIconArrow,
                      color: getStatusColor(dataDetail?.status as number)
                    }}
                  />
                </Box>
                <BoxTimeStyle status={dataDetail?.status as number}>
                  <Typography
                    variant="subtitle1"
                    sx={{ ...styleTime, color: getStatusColor(dataDetail?.status as number) }}
                    component="div"
                  >
                    {convertDatetimeTZWithoutSecond(
                      dataDetail?.check_out_time,
                      systemSetting.time_zone,
                      systemSetting.format_date
                    )}
                  </Typography>
                </BoxTimeStyle>
              </Grid>
              <BoxItem>
                <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                  {t('overview.time_keeping_real')}
                </Typography>
                <Box sx={{ ...styleBoxNote }}>
                  {dataDetail?.timesheets_logs.first || dataDetail?.timesheets_logs.last ? (
                    <>
                      <Typography sx={{ ...styleTimeReal }} variant="body1" component="div">
                        {dataDetail?.timesheets_logs.first &&
                          formatTime(
                            formatDateTime(
                              convertDatetimeTZ(
                                dataDetail?.timesheets_logs.first,
                                systemSetting.time_zone
                              )
                            )
                          )}
                      </Typography>
                      <Box sx={{ ...styleTimeReal }}>
                        <ArrowRightAltIcon />
                      </Box>
                      <Typography sx={{ ...styleTimeReal }} variant="body1" component="div">
                        {dataDetail?.timesheets_logs.last &&
                          formatTime(
                            formatDateTime(
                              convertDatetimeTZ(
                                dataDetail?.timesheets_logs.last,
                                systemSetting.time_zone
                              )
                            )
                          )}
                      </Typography>
                    </>
                  ) : (
                    <Typography sx={{ ...styleNote }} variant="body1" component="div">
                      {t('application_management.no_keeping')}
                    </Typography>
                  )}
                </Box>
              </BoxItem>
              <BoxItem>
                <Grid>
                  <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                    {t('application_form.status_form')}
                  </Typography>
                </Grid>
                <Grid>
                  <Status value={dataDetail?.status as number} />
                </Grid>
              </BoxItem>
              <BoxItem>
                <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                  {t('note')}
                </Typography>
                <Box sx={{ ...styleBoxNote }}>
                  <Typography sx={{ ...styleNote }} variant="body1" component="div">
                    {dataDetail?.note}
                  </Typography>
                </Box>
              </BoxItem>
              <Box sx={{ ...styleHeader }}>
                <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                  {t('approval_information')}
                </Typography>
              </Box>

              <Approvers data={dataDetail} />
            </Box>
          </Box>
        </DialogContent>
      )}

      <Box sx={{ padding: '0px 10px 30px 10px' }}>
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

export { ModalUpdateStatusRequestTime }

export const styleHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
}

const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}

export const styleBoxNote = {
  width: { xs: '60%', sm: '60%' },
  justifyContent: 'flex-end',
  display: 'flex',
  textAlign: 'justify'
}

export const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  color: '#111'
}

const styleTitle = {
  color: '#146BD2',
  fontSize: { xs: '13px', sm: '18px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px',
  mb: 2,
  pt: 1
}

export const styleNote = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  wordBreak: ' break-word',
  marginLeft: { xs: '-20px', sm: '58px ' }
}

export const styleTimeReal = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  wordBreak: ' break-word',
  marginLeft: '10px'
}

const styleIconArrow = {
  mt: 1,
  fontSize: { xs: 18, sm: 24 }
}
const iconButton = {
  marginLeft: 'auto'
}
const styleTime = {
  fontSize: { xs: '12px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px',
  color: '#20B369'
}
const BoxTimeStyle = styled(Box)<{
  status: number
}>(({ status, theme }) => {
  return {
    display: 'flex',
    width: '300px',
    border: `1px solid ${getStatusColor(status)}`,
    color: getStatusColor(status),
    padding: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    background: '#fff',
    borderRadius: '8px'
  }
})

export const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}

export const styleDialog = {
  '&.MuiDialogContent-root': {
    padding: { xs: '12px 16px', sm: '20px 24px 20px 24px' },
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}

const getStatusColor = (status: number) => {
  if (status === 0) return blue[600]
  if (status === 1) return Green[600]
  if (status === 2) return Red[400]
  if (status === 3) return Yellow[600]
}
