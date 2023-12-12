import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  IconButton,
  styled,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import { useAtomValue } from 'jotai'
import EditIcon from '@mui/icons-material/Edit'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { blue } from '@mui/material/colors'
import { Approvers } from 'screen/application/Atoms/Approvers'
import { useAuth } from 'lib/hook/useAuth'
import { ModelHasApproversType, OvertimeFormType } from 'lib/types/applicationForm'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { STATUSCHECK } from 'lib/utils/contants'
import ItemTimeDetail from 'screen/application/Atoms/ItemTimeDetail'
import { minutesToHours } from '../../lib/utils/datetime'
import { Status } from 'components/Status/Status'
import { Green, Orange, Red } from 'styles/colors'
type PropType = DialogProps & {
  open?: boolean
  idDetail?: number | null
  handleEditInModalDetai?: () => void
  closeModalDetail: () => void
}

const ModalDetailOverTimeApplication: React.VFC<PropType> = ({
  open,
  idDetail,
  closeModalDetail,
  handleEditInModalDetai
}) => {
  const { permissions, user } = useAuth()

  const { t } = useTranslation()

  const [loading, setLoading] = useState<boolean>(true)

  const [selectedApprovers, setSelectedApprovers] = React.useState<[ModelHasApproversType] | []>([])
  const [totalOvertime, setTotalOvertime] = useState<number>(120)
  const [dataDetail, setDataDetail] = useState<OvertimeFormType>()
  const systemSetting: any = useAtomValue(systemSettingAtom)
  useQuery<OvertimeFormType>([`1.0/user/overtime-form/${idDetail}`], {
    onSuccess: (data) => {
      const myId = user?.employee_id
      let index = 0
      if (myId === data.approver_id_1) {
        index = 0
      }
      if (myId === data.approver_id_2) {
        index = 1
      }
      setLoading(false)
      setDataDetail(data)
      setSelectedApprovers(data.approvers)
      setTotalOvertime(parseInt(data.total_time_work))
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    enabled: !idDetail ? false : true
  })

  const [disabledEdit, setDisabledEdit] = useState(true)
  useEffect(() => {
    const check = selectedApprovers.filter(
      (item) => item?.status === STATUSCHECK.APPROVALREQUIREMENTS
    )
    if (
      check &&
      check.length >= STATUSCHECK.LENGHT &&
      dataDetail?.status === STATUSCHECK.APPROVALREQUIREMENTS
    ) {
      setDisabledEdit(false)
    } else {
      setDisabledEdit(true)
    }
  }, [dataDetail, selectedApprovers])

  return (
    <Dialog open={open} sx={{ ...stylePopUp }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
            {t('application_management.detail_ot')}
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="close" onClick={closeModalDetail}>
            <CloseIcon sx={{ ...styleIconClose }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      {loading ? (
        <ModalSkeleton />
      ) : (
        <DialogContent
          sx={{
            ...styleDialog
          }}
        >
          <Box>
            <Grid sx={{ ...styleGridHeader }}>
              <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                {t('approval_information')}
              </Typography>
              {disabledEdit ? (
                <Box />
              ) : (
                <Tooltip title={t('application_management.edit')} placement="top">
                  <IconButton edge="end" color="inherit" onClick={handleEditInModalDetai}>
                    <EditIcon sx={{ ...styleIconClose }} />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            <Approvers data={dataDetail} />
            <Box sx={{ mt: 2, mb: 3 }}>
              <Divider sx={{ ...styleDivider }} />
            </Box>
            <Box sx={{ ...styleHours }}>
              <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                {t('overview.detail')}
              </Typography>
              <span style={{ fontSize: '14px' }}>
                {t('total_time') + ': '}
                <span style={{ fontWeight: 700, fontSize: '16px' }}>
                  {minutesToHours(Number(totalOvertime)) || '0h'}
                </span>
              </span>
            </Box>
            <ItemTimeDetail dataDetails={dataDetail} />

            <BoxItem>
              <Grid>
                <Typography sx={{ ...styleBelow }} variant="body2" component="div">
                  {t('application_form.status_form')}
                </Typography>
              </Grid>
              <Grid>
                <Status value={dataDetail?.status as number} />
              </Grid>
            </BoxItem>
            <BoxItem>
              <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                {t('application_form.reason')}
              </Typography>
              <Box sx={{ ...styleBoxNote }}>
                <Typography sx={{ ...styleNote }} variant="body1" component="div">
                  {dataDetail?.reason}
                </Typography>
              </Box>
            </BoxItem>

            <Grid display={'flex'} justifyContent={'space-between'}>
              <Typography variant="body1" component="div" sx={{ flex: 1, ...styleBelow }}>
                {t('note')}
              </Typography>

              <Box sx={{ ...styleBoxNote }}>
                <Typography sx={{ ...styleNote }} variant="body1" component="div">
                  {dataDetail?.note}
                </Typography>
              </Box>
            </Grid>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  )
}

export const ButtonResponsive = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    maxWidth: '120px'
  }
}))
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
const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  mb: 3,
  color: '#111'
}
export const styleDivider = {
  margin: '0 -24px',
  width: 'calc(100% + 48px)'
}
const styleBelow2 = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  mb: 3
}
const styleHours = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 2
}
const BoxItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between'
}))

export const getBgTimeColor = (status: number) => {
  if (status === STATUSCHECK.APPROVALREQUIREMENTS) return blue[600]
  if (status === STATUSCHECK.APPROVED) return Green[600]
  if (status === STATUSCHECK.REFUSE) return Red[400]
  if (status === STATUSCHECK.CANCEL) return Orange[400]
}

const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}
export const styleTitle = {
  fontWeight: 'bold',
  color: '#146BD2',
  fontSize: { xs: 14, sm: 16, md: 18 }
}
export const styleGridHeader = {
  display: 'flex',
  mb: 2,
  justifyContent: 'space-between',
  alignItems: 'center'
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

export const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}

export { ModalDetailOverTimeApplication }
