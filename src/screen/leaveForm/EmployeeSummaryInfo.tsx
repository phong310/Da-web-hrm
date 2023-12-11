import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

type EmployeeSummaryInfoProps = {
  employeeId: number | string | undefined
  fullName: string | undefined
  branchName: string | undefined
  departmentName: string | undefined
  positionName: string | undefined
}

const EmployeeSummaryInfo = ({
  fullName,
  employeeId,
  branchName,
  departmentName,
  positionName
}: EmployeeSummaryInfoProps) => {
  const { t } = useTranslation()

  return (
    <Grid container ml={2} item rowSpacing={1} sx={{ paddingTop: '12px !important' }}>
      <Grid container item xs={12} md={6}>
        <Typography>
          {t('information.name')}: <span style={{ fontWeight: 'bold' }}>{fullName}</span>
        </Typography>
      </Grid>

      <Grid container item xs={12} md={6}>
        <Typography>
          {t('branch')}: <span style={{ fontWeight: 'bold' }}>{branchName}</span>
        </Typography>
      </Grid>
      <Grid container item xs={12} md={6}>
        <Typography>
          {t('department')}: <span style={{ fontWeight: 'bold' }}>{departmentName}</span>
        </Typography>
      </Grid>
      <Grid container item xs={12} md={6}>
        <Typography>
          {t('position')}: <span style={{ fontWeight: 'bold' }}>{positionName}</span>
        </Typography>
      </Grid>
    </Grid>
  )
}

export { EmployeeSummaryInfo }

