import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import ForwardOutlinedIcon from '@mui/icons-material/ForwardOutlined'
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
    Tooltip,
    Typography
} from '@mui/material'
import { ModalSkeleton } from 'components/Skeleton/ModalSkeleton'
import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { styled } from '@mui/system'
import { Approvers } from 'screen/application/Atoms/Approvers'
import { RequestChangeTimesheetFormType } from 'lib/types/applicationForm'
import { systemSettingAtom } from 'lib/atom/authAtom'
import { STATUSCHECK } from 'lib/utils/contants'
import { convertDatetimeTZWithoutSecond } from 'lib/utils/format'
import { Status } from 'components/Status/Status'
import { Green, Red, Yellow, blue } from 'styles/colors'

type PropType = DialogProps & {
  handleClose: () => void
  idDetail?: number | null
  handleEdit?: () => void
  updateSuccess?: boolean
  openEdit?: boolean
}

const ModalDetailRequestChangeTimesheetApplication: React.FC<PropType> = ({
  open,
  handleClose,
  idDetail,
  handleEdit
}) => {
  const { t } = useTranslation()
  const [dataDetail, setDataDetail] = useState<RequestChangeTimesheetFormType>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [checkStatus, setCheckStatus] = useState<boolean>(false)
  const systemSetting: any = useAtomValue(systemSettingAtom)

  useQuery<RequestChangeTimesheetFormType>([`1.0/user/request-change-timesheet/${idDetail}`], {
    onSuccess: (data) => {
      setIsLoading(false)
      setDataDetail(data)
    },
    enabled: !idDetail ? false : true
  })
  useEffect(() => {
    const check = dataDetail?.approvers.filter(
      (item) => item?.status === STATUSCHECK.APPROVALREQUIREMENTS
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

  return (
    <Dialog open={open} sx={{ ...stylePopUp }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1, ...styleTitleDialog }} variant="h6" component="div">
            {t('application_management.detail_rqct')}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
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
            <Grid sx={{ ...styleGridHeader }}>
              <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
                {t('approval_information')}
              </Typography>
              {checkStatus ? (
                <Tooltip title={t('application_management.edit')} placement="top">
                  <IconButton edge="end" color="inherit" onClick={handleEdit}>
                    <EditIcon sx={{ ...styleIconClose }} />
                  </IconButton>
                </Tooltip>
              ) : (
                ''
              )}
            </Grid>
            <Approvers data={dataDetail} />
            <Box sx={{ mt: 2, mb: 3 }}>
              <Divider sx={{ margin: '0 -24px', width: 'calc(100% + 48px)' }} />
            </Box>
            <Typography sx={{ flex: 1, ...styleTitle }} variant="subtitle1" component="div">
              {t('overview.detail')}
            </Typography>
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
  )
}

export default ModalDetailRequestChangeTimesheetApplication

const getStatusColor = (status: number) => {
  if (status === 0) return blue[600]
  if (status === 1) return Green[600]
  if (status === 2) return Red[400]
  if (status === 3) return Yellow[600]
}
const styleTitleDialog = {
  fontSize: { xs: '14px', sm: '18px' }
}
const styleGridHeader = {
  display: 'flex',
  mb: 2,
  justifyContent: 'center',
  alignItems: 'center'
}
const styleIconClose = {
  width: { xs: '20px', sm: '30px' }
}
  // @ts-ignore
const BoxItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between'
}))

const styleTitle = {
  fontWeight: 'bold',
  color: '#146BD2',
  fontSize: { xs: 14, sm: 16, md: 18 },
  mb: 2,
  pt: 1
}

const styleTime = {
  fontSize: { xs: '12px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px',
  color: '#20B369'
}

const styleIconArrow = {
  mt: 1,
  fontSize: { xs: 18, sm: 24 }
}
const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  mb: 3,
  color: '#111'
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

export const styleDialog = {
  '&.MuiDialogContent-root': {
    padding: { xs: '12px 16px', sm: '20px 24px 20px 24px' },
    overflowX: 'hidden',
    overflowY: 'overlay'
  }
}

const stylePopUp = {
  '& .MuiDialog-container': {
    '& .MuiDialog-paper': {
      margin: '16px'
    }
  }
}


const BoxTimeStyle = styled(Box)<{
  status: number
  // @ts-ignore
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
