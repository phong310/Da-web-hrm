import { Box, Grid, Typography } from '@mui/material'
import { AvatarCustom } from 'components/Form/Components/AvatarCustom'
import { Status } from 'components/Status/Status'
import { useAuth } from 'lib/hook/useAuth'
import { CompensatoryLeaveFormType, LeaveFormTypeV2, OvertimeFormType, RequestChangeTimesheetFormType } from 'lib/types/applicationForm'
import { AVATAR_SIZE } from 'lib/utils/contants'
import { convertDatetimeTZ, formatDateTime } from 'lib/utils/format'
import { useTranslation } from 'react-i18next'
type dataProps = {
  data:
    | LeaveFormTypeV2
    | OvertimeFormType
    | CompensatoryLeaveFormType
    | RequestChangeTimesheetFormType
    | undefined
}

export const Approvers: React.VFC<dataProps> = ({ data }) => {
  const { t } = useTranslation()
  const { systemSetting } = useAuth()

  return (
    <>
      {data?.approvers.map((item, index) => (
        <Box sx={{ mb: item.approval_time ? 4 : 2 }} key={index}>
          <Grid sx={item.approval_time ? { ...styleHasTime } : { ...styleNoTime }}>
            <Grid sx={item.approval_time ? styleNameApproveWithTime : styleNameApproveWithoutTime}>
              <Box
                sx={{
                  ...BoxApprover
                }}
              >
                <AvatarCustom
                  thumbnail_url={item?.avatar}
                  size={AVATAR_SIZE.NORMAL}
                  alt="Approvers"
                />
                <Box>
                  <Box>
                    <Typography sx={{ flex: 1, ...styleName }} variant="body1" component="div">
                      {item.full_name}
                    </Typography>
                    <Typography sx={stylePosition}>{item?.position?.name}</Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {item.approval_time && !item.rejected_time && (
                      <Typography sx={{ flex: 1, ...styleDate }} variant="body2" component="div">
                        {t('approval_at')}:{' '}
                        <span style={{ fontWeight: 'bold' }}>
                          {formatDateTime(
                            convertDatetimeTZ(item.approval_time, systemSetting?.time_zone)
                          )}
                        </span>
                      </Typography>
                    )}
                    {item.rejected_time && (
                      <Typography sx={{ flex: 1, ...styleDate }} variant="body2" component="div">
                        {t('reject_at')}:{' '}
                        <span style={{ fontWeight: 'bold' }}>
                          {formatDateTime(
                            convertDatetimeTZ(item.rejected_time, systemSetting?.time_zone)
                          )}
                        </span>
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid sx={{ ...styleStatus }}>
              <Typography sx={{ flex: 1, ...styleStatusTitle }} variant="body2" component="div">
                {t('status')}
              </Typography>
              <Status value={item.status as number} />
              <Box sx={{ ...styleBoxNote }}>
                {item.approval_time && !item.rejected_time && (
                  <Box>
                    <Typography sx={{ flex: 1, ...styleDate, textAlign: 'end' }}>
                      {' '}
                      {t('approval_at')}:{' '}
                    </Typography>
                    <Typography sx={{ flex: 1, ...styleDate }} variant="body2" component="div">
                      {formatDateTime(
                        convertDatetimeTZ(item.approval_time, systemSetting?.time_zone)
                      )}
                    </Typography>
                  </Box>
                )}
                {item.rejected_time && (
                  <Typography sx={{ flex: 1, ...styleDate }} variant="body2" component="div">
                    {t('reject_at')}:{' '}
                    {formatDateTime(
                      convertDatetimeTZ(item.rejected_time, systemSetting?.time_zone)
                    )}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </>
  )
}
const styleHasTime = {
  display: 'flex',
  alignItems: { xs: 'self-start', sm: 'center' },
  justifyContent: 'space-between'
}
const styleNoTime = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between'
}
const styleAvatarApprove = {
  width: { xs: '45px', sm: '60px' },
  height: { xs: '45px', sm: '60px' },
  display: { xs: 'block' }
}

const styleNameApproveWithTime = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px'
}

const styleBoxNote = {
  justifyContent: 'flex-end',
  textAlign: 'justify',
  display: { xs: 'flex', sm: 'none' }
}
const styleNameApproveWithoutTime = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px'
}

const styleName = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px'
}

const styleDate = {
  fontSize: { xs: '11px', sm: '15px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
  color: '#878C95',
  mt: { xs: 0, sm: 1 }
}

const stylePosition = {
  fontSize: { xs: '12px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
  width: { xs: '120px', sm: '300px' },
  mt: { xs: 0, sm: 1 }
}

const styleStatus = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px'
}

const styleStatusTitle = {
  fontSize: { xs: '12px', sm: '15px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '20px',
  color: '#878C95'
}

const BoxApprover = {
  display: 'flex',
  flexDirection: 'column', // Giá trị mặc định
  gap: { xs: 1, sm: 2 },
  alignItems: 'flex-start',
  '@media (min-width:600px)': {
    flexDirection: 'row', // Giá trị cho màn hình có chiều rộng tối thiểu là 600px (sm)
    alignItems: 'center'
  }
}
