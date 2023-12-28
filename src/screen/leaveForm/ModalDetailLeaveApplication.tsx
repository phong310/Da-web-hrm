import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/system'
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  Tooltip
} from '@mui/material'
import { V1 } from 'constants/apiVersion'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import EditIcon from '@mui/icons-material/Edit'
import { KindOfLeaveType, LeaveFormType, LeaveFormTypeV2 } from 'lib/types/applicationForm'
import { KIND_OF_LEAVE_TYPES, STATUSCHECK } from 'lib/utils/contants'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { Status } from 'components/Status/Status'
import { minutesToDays } from 'lib/utils/format'
import { Approvers } from 'screen/application/Atoms/Approvers'
import ItemTimeDetail from 'screen/application/Atoms/ItemTimeDetail'
import { useEffect, useState } from 'react'

export type ItemType = {
  approver_1: string
  approver_2: string
  created_at: Date
  end_time: Date
  id: number
  is_salary: number
  kind_of_leave: {
    name: string
  }
  start_time: Date
  status: number
}
type PropType = DialogProps & {
  title?: string
  handleOnClickForm?: (type_form: number) => void
  idDetail?: number | null
  checkSuccess?: boolean
  handleEdit?: () => void
  openEdit?: boolean
  handleEditInModalDetai?: () => void
  closeModalDetail?: () => void
}

export const ModalDetailLeaveApplication: React.FC<PropType> = ({
  open,
  idDetail,
  handleEditInModalDetai,
  closeModalDetail
}) => {
  const { t } = useTranslation()
  const [dataDetail, setDataDetail] = useState<LeaveFormTypeV2>()
  const [kindOfLeave, setKindOfLeave] = useState<string | undefined>()
  const [dataKindOfLeave, setDataKindOfLeave] = useState<KindOfLeaveType[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [checkStatus, setCheckStatus] = useState<boolean>()

  useQuery<LeaveFormType>([`1.0/user/leave-form/${idDetail}`], {
    onSuccess: (data) => {
      setIsLoading(false)
      //@ts-ignore
      setDataDetail(data)
    },
    enabled: !idDetail ? false : true
  })

  useQuery<{ data: KindOfLeaveType[] }>(
    [`${V1}/user/kind-of-leave`, { type_equal: KIND_OF_LEAVE_TYPES['NORMAL_LEAVE'] }],
    {
      onSuccess: (data) => {
        setDataKindOfLeave(data?.data)
      }
    }
  )

  useEffect(() => {
    dataKindOfLeave?.filter((itemKindOfLeave) => {
      if (itemKindOfLeave.id === dataDetail?.kind_leave_id) {
        setKindOfLeave(`${itemKindOfLeave.name} (${itemKindOfLeave.symbol})`)
      }
    })
  })

  useEffect(() => {
    const check = dataDetail?.approvers.filter(
      (item: any) => item?.status === STATUSCHECK.APPROVALREQUIREMENTS
    )

    if (
      check &&
      check.length >= STATUSCHECK.LENGHT &&
      dataDetail?.status === STATUSCHECK.APPROVALREQUIREMENTS
    ) {
      setCheckStatus(true)
    } else {
      setCheckStatus(false)
    }
  }, [dataDetail])
  // @ts-ignore
  const BoxItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    marginBottom: '24px',
    justifyContent: 'space-between'
  }))

  return (
    <>
      <Dialog open={open} sx={{ ...stylePopUp }}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
              {t('application_management.detail_leave_applicaton')}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={closeModalDetail} aria-label="close">
              <CloseIcon sx={{ ...styleIconClose }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        {isLoading ? (
          <ModalSkeleton />
        ) : (
          <DialogContent
            sx={{
              ...styleDialog
            }}
          >
            <Box>
              <Grid sx={{ ...styleHeader }}>
                <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                  {t('approval_information')}
                </Typography>
                {checkStatus ? (
                  <Tooltip title={t('application_management.edit')} placement="top">
                    <IconButton edge="end" color="inherit" onClick={handleEditInModalDetai}>
                      <EditIcon sx={{ ...styleIconClose }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ''
                )}
              </Grid>

              <Approvers data={dataDetail} />

              <Box sx={{ mt: 2, mb: 3 }}>
                <Divider sx={{ ...styleDivider }} />
              </Box>

              <Grid display={'flex'}>
                <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                  {t('overview.detail')}
                </Typography>
                <Grid display={'flex'}>
                  <Typography sx={{ flex: 1, ...styleRestTime }} variant="body2" component="div">
                    {t('timesheet.time_off')}:
                  </Typography>
                  <Typography variant="body1" sx={{ ...styleNumberOfDayOff }} component="div">
                    {minutesToDays(dataDetail?.total_time_off)}
                  </Typography>
                </Grid>
              </Grid>

              <ItemTimeDetail dataDetails={dataDetail} />

              <BoxItem display={'flex'} justifyContent={'space-between'}>
                <Grid>
                  <Typography sx={{ flex: 1, ...styleBelow }} variant="body2" component="div">
                    {t('application_form.status_form')}
                  </Typography>
                </Grid>
                <Grid>
                  <Status value={dataDetail?.status as number} />
                </Grid>
              </BoxItem>

              <BoxItem display={'flex'} justifyContent={'space-between'}>
                <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                  {t('application_form.kind_of_leave')}
                </Typography>
                <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
                  {kindOfLeave}
                </Typography>
              </BoxItem>

              <BoxItem display={'flex'} justifyContent={'space-between'}>
                <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                  {t('application_form.reason')}
                </Typography>
                <Box sx={{ ...styleBoxNote }}>
                  <Typography sx={{ ...styleNote }} variant="body1" component="div">
                    {dataDetail?.reason}
                  </Typography>
                </Box>
              </BoxItem>
              <BoxItem display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                  {t('application_form.is_paid_leave')}
                </Typography>
                <Status value={dataDetail?.is_salary as number} isStatusPaidLeave={true} />
              </BoxItem>
              <BoxItem display={'flex'} justifyContent={'space-between'}>
                <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                  {t('note')}
                </Typography>
                <Box sx={{ ...styleBoxNote }}>
                  <Typography sx={{ ...styleNote }} variant="body1" component="div">
                    {dataDetail?.note}
                  </Typography>
                </Box>
              </BoxItem>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

export const styleDialog = {
  '&.MuiDialogContent-root': {
    padding: { xs: '12px 16px', sm: '20px 24px 20px 24px' },
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}

const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}
const styleHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
}
const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}
const styleDivider = {
  margin: '0 -24px',
  width: 'calc(100% + 48px)'
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
const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  color: '#111'
}
const styleKindOfLeave = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  textAlign: 'right',
  width: { xs: '60%', sm: '60%' }
}
export const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}
const styleRestTime = {
  fontSize: { xs: '12px', sm: '14px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
  mr: 1
}
const styleNumberOfDayOff = {
  fontWeight: 'bold',
  fontSize: { xs: '12px', sm: '18px' }
}

export const styleBoxNote = {
  width: { xs: '60%', sm: '60%' },
  justifyContent: 'flex-end',
  display: 'flex',
  textAlign: 'justify'
}
export const styleNote = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  wordBreak: ' break-word',
  marginLeft: { xs: '-20px', sm: '58px ' }
}
