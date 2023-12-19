import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import { PersonalInformationType } from 'lib/types/user'
// import { PersonalInformationType } from 'lib/types'
import { SEX_OPTIONS } from 'lib/utils/contants'
import { useTranslation } from 'react-i18next'
import { grid_half_v2 } from './components'
// import { grid_half_v2 } from 'screen/labor-contract'
type EmployeeSummaryProps = {
  employeeInfo?: PersonalInformationType | any
  employeeCode?: string | number | null
  employeePosition?: string
  employeeBranch?: string
  employeeDepartment?: string
}

const EmployeeSummary: React.FC<EmployeeSummaryProps> = ({
  employeeInfo,
  employeeCode,
  employeePosition,
  employeeBranch,
  employeeDepartment
}) => {
  const { t } = useTranslation()
  const isXsScreen = useMediaQuery('(max-width:900px)')
  return (
    <>
      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('information.employee_code')}: </Typography>
          <Typography sx={{ ...styleValue }}>{employeeCode}</Typography>
        </Box>
      </Grid>

      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('information.full_name')}: </Typography>
          <Typography sx={{ ...styleValue }}>{employeeInfo?.full_name}</Typography>
        </Box>
      </Grid>

      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('information.birthday')}: </Typography>
          <Typography sx={{ ...styleValue }}>{employeeInfo?.birthday}</Typography>
        </Box>
      </Grid>

      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('information.email')}: </Typography>
          <Typography
            sx={{
              ...(isXsScreen ? shortValue : styleValue)
            }}
          >
            {employeeInfo?.email}
          </Typography>
        </Box>
      </Grid>
      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('information.phone')}: </Typography>
          <Typography sx={{ ...styleValue }}>{employeeInfo?.phone}</Typography>
        </Box>
      </Grid>
      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('information.sex')}: </Typography>
          <Typography sx={{ ...styleValue }}>
            {SEX_OPTIONS.find((sex) => sex.value === employeeInfo?.sex)?.label}
          </Typography>
        </Box>
      </Grid>
      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('labor_contract.branch')}: </Typography>
          <Typography sx={{ ...styleValue }}>{employeeBranch}</Typography>
        </Box>
      </Grid>
      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('labor_contract.department')}: </Typography>
          <Typography sx={{ ...styleValue }}>{employeeDepartment}</Typography>
        </Box>
      </Grid>
      <Grid container item {...grid_half_v2} padding={1}>
        <Box sx={{ ...styleGridFlex }}>
          <Typography sx={{ ...styleTitle }}>{t('labor_contract.position')}: </Typography>
          <Typography
            sx={{
              ...(isXsScreen ? shortValue : styleValue)
            }}
          >
            {employeePosition}
          </Typography>
        </Box>
      </Grid>
    </>
  )
}

const styleGridFlex = {
  display: 'flex',
  alignItems: 'center'
}

const styleTitle = {
  width: '126px',
  color: '#000'
}

const styleValue = {
  fontWeight: 'bold',
  color: '#000',
  flex: 1
}

const shortValue = {
  width: 'fit-content',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '150px',
  fontWeight: 'bold'
}

export { EmployeeSummary }

