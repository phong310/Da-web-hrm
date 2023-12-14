import {
    Avatar,
    Box,
    Grid,
    Hidden,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material'
import AvtDefault from 'assets/images/no-image.jpg'
import { CustomTimeline } from 'components/Timeline/CustomTimeline'
import { useAuth } from 'lib/hook/useAuth'
import { convertDatetimeTZ, convertFormatDate, formatTime } from 'lib/utils/format'
import { formatTimeDiff } from 'lib/utils/misc'
// import { CustomTimeline } from 'components/Timeline/CustomTimeline'
// import { useAuth } from 'lib/hooks'
// import { convertDatetimeTZ, convertFormatDate, formatTime, formatTimeDiff } from 'lib/utils'
import { useTranslation } from 'react-i18next'

export type LeaveAppBlockInformationProps = {
  full_name: string
  thumbnail_url: string
  start_time: string | Date
  end_time: string | Date
  created_at: string | Date
  in_day: boolean
  kind_of_leave?: string
}

const LeaveAppBlockInformation: any = ({
  full_name,
  thumbnail_url,
  start_time,
  end_time,
  created_at,
  in_day,
  kind_of_leave
}: LeaveAppBlockInformationProps) => {
  const { systemSetting } = useAuth()
  const { t } = useTranslation()
  const thresHoldDistanceDate = 3
  const startDate = convertFormatDate(start_time, systemSetting?.format_date) //dd-mm-yyyy
  const endDate = convertFormatDate(end_time, systemSetting?.format_date) //dd-mm-yyyy
  const startTime = formatTime(convertDatetimeTZ(start_time, systemSetting?.time_zone)) //hh:mm
  const endTime = formatTime(convertDatetimeTZ(end_time, systemSetting?.time_zone)) //hh:mm
  const createdDate = convertFormatDate(new Date(created_at), systemSetting?.format_date) //dd-mm-yyyy

  const distanceDate =
    (new Date().getTime() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const responsiveGrid = { xs: 12, sm: 6, md: 6, lg: 7, xl: 6 }
  const restGrid = {
    ...responsiveGrid,
    xs: 12 - responsiveGrid.xs,
    sm: 12 - responsiveGrid.sm,
    md: 12 - responsiveGrid.md,
    lg: 12 - responsiveGrid.lg,
    xl: 12 - responsiveGrid.xl
  }

  return (
    <Box sx={{ ...styleBoxContainer }}>
      <Box sx={{ ...styleBoxSta }}>
        <Stack
          sx={{ ...styleStackContainer }}
          direction="row"
          justifyContent={'space-between'}
          spacing={{ xs: 2, sm: 3 }}
        >
          <Box
            sx={{
              ...styleBoxAvt
            }}
          >
            <Avatar
              alt="Employee Avatar"
              sx={{ ...responsiveAvatarStyle }}
              src={thumbnail_url ?? AvtDefault}
            />
          </Box>
          <Box
            sx={{
              ...styleBoxInfo
            }}
          >
            <Box sx={{ ...styleBoxInfoGrid }}>
              <Box>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      ...styleTypographyName
                    }}
                  >
                    {full_name}
                  </Typography>
                  {distanceDate > thresHoldDistanceDate ? (
                    <Typography
                      sx={{
                        ...styleTypographyCreateDate
                      }}
                    >
                      {t('application_form.create_application')}: {createdDate}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        ...styleTypographyCreateDate
                      }}
                    >
                      {t('application_form.create_application')}: {formatTimeDiff(created_at)}
                    </Typography>
                  )}
                </Grid>
              </Box>

              <Box
                sx={{
                  ...styleBoxKind
                }}
              >
                <Typography
                  sx={{
                    ...styleTypographyKind
                  }}
                >
                  {t('application_form.reason')}:
                </Typography>
                <Typography
                  sx={{
                    ...styleTypographyKind
                  }}
                >
                  {kind_of_leave}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Hidden smDown>
            <Box
              sx={{
                ...styleBoxCustomTimeLine
              }}
            >
              <CustomTimeline
                start_time={startTime}
                end_time={endTime}
                start_date={startDate}
                end_date={endDate}
                in_day={in_day}
              />
            </Box>
          </Hidden>
        </Stack>
      </Box>
    </Box>
  )
}

export { LeaveAppBlockInformation }
const responsiveAvatarStyle = {
  width: { xs: '30px', sm: '50px' },
  height: { xs: '30px', sm: '50px' }
}

const styleBoxContainer = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  marginY: '22px'
}

const styleBoxSta = {
  padding: '16px'
}

const styleStackContainer = {
  borderRadius: '12px',
  border: '1px solid #f0f0f0',
  padding: '16px'
}

const styleBoxAvt = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center !important'
}

const styleBoxInfo = {
  display: 'flex',
  alignItems: 'center',
  width: '100%'
}

const styleBoxInfoGrid = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  width: '100%'
}

const styleTypographyName = {
  color: '#000',
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: '28px'
}

const styleTypographyCreateDate = {
  color: '#000',
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '20px'
}

const styleTypographyStartDate = {
  color: '#111111',
  fontSize: { xs: '14px', md: '16px' },
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '20px'
}

const styleBoxIcon = {
  marginTop: 2
}

const styleBoxIconSvg = {
  display: 'flex',
  alignItems: 'center',
  gap: 1
}

const styleTypographyTime = {
  color: '#111111',
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: 1
}

const styleIsMobileTime = {
  display: 'flex',
  alignItems: 'center',
  gap: 1
}

const styleBoxKind = {
  color: '#111111',
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: 1
}

const styleTypographyKind = {
  color: '#000',
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: '20px'
}

const styleBoxCustomTimeLine = { width: '100%', display: 'flex', justifyContent: 'flex-end' }

export const responsiveTextStyle = {
  fontSize: { xs: 13, sm: 14 }
}
