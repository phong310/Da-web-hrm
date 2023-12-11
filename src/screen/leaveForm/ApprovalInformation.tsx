import { Box, Grid, Typography } from '@mui/material'
import { Status } from 'components/Status/Status'
import { useAuth } from 'lib/hook/useAuth'
import { convertDatetimeTZ, formatDateTime } from 'lib/utils/format'
// import { useAuth } from 'lib/hooks'
// import { convertDatetimeTZ, formatDateTime } from 'lib/utils'
import { useTranslation } from 'react-i18next'
// import { Status } from './v2/Status'

type ApprovalInformationProps = {
  fullName: string | undefined
  status: number | undefined
  approvalAt?: string | undefined
  rejectAt?: string | undefined
}

const ApprovalInformation = ({
  fullName,
  status,
  approvalAt,
  rejectAt
}: ApprovalInformationProps) => {
  const { t } = useTranslation()
  const grid_input = {
    sm: 6,
    xs: 6
  }
  const { systemSetting } = useAuth()

  const styleBoxContainer = {
    fontSize: { xs: 13, sm: 16 }
  }

  return (
    <Grid container item sx={{ borderBottom: '1px', paddingTop: '12px !important' }}>
      <Grid container item {...grid_input}>
        <Box sx={{ display: { sm: 'flex' }, alignItems: 'center', gap: '4px' }}>
          <Typography sx={{ ...styleBoxContainer }}>{t('information.name')} :</Typography>
          <span style={{ fontWeight: 'bold' }}>{fullName}</span>
        </Box>
      </Grid>

      <Grid
        container
        item
        {...grid_input}
        sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
      >
        <Box sx={{ float: 'right', display: { sm: 'flex' }, alignItems: 'center' }}>
          <Typography sx={{ marginRight: 2, ...styleBoxContainer }}>{t('status')}</Typography>
          <Status value={status as number} />
        </Box>
      </Grid>
      {approvalAt && !rejectAt && (
        <>
          <Grid container item {...grid_input}>
            <Typography sx={{ opacity: 0.7, fontSize: '13px', mt: 1 }}>
              {t('approval_at')}:{' '}
              <span style={{ fontWeight: 'bold' }}>
                {formatDateTime(convertDatetimeTZ(approvalAt, systemSetting?.time_zone))}
              </span>
            </Typography>
          </Grid>
        </>
      )}
      {rejectAt && (
        <>
          <Grid container item {...grid_input}>
            <Typography sx={{ opacity: 0.7, fontSize: '13px', mt: 1 }}>
              {t('reject_at')}:{' '}
              <span style={{ fontWeight: 'bold' }}>
                {formatDateTime(convertDatetimeTZ(rejectAt, systemSetting?.time_zone))}
              </span>
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  )
}

export { ApprovalInformation }
