import { Box, Grid, Typography, styled } from '@mui/material'
import { AvatarCustom } from 'components/Form/Components/AvatarCustom'
import { AVATAR_SIZE } from 'lib/utils/contants'
// import { AvatarCustom } from 'components/Form'
// import { AVATAR_SIZE } from 'lib/utils'
import { useTranslation } from 'react-i18next'
type EmployeeSummaryInfoProps = {
  employeeId: number | string | undefined
  fullName: string | undefined
  branchName: string | undefined
  departmentName: string | undefined
  positionName: string | undefined
  avatar?: string | undefined
  employee_code?: string | undefined
}

const EmployeeSummaryInfov2 = ({
  fullName,
  employeeId,
  branchName,
  employee_code,
  avatar,
  departmentName,
  positionName
}: EmployeeSummaryInfoProps) => {
  const { t } = useTranslation()
  const TitleEmployee = styled(Typography)(({ theme }) => ({
    color: 'var(--greyscale-500, #878C95)',
    fontSize: '16px',
    fontWeight: '400',
    width: '90px',
    lineHeight: '20px',
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
      fontSize: '14px'
    }
  }))
  const GroupEmployeeInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    marginBottom: '8px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '4px'
    }
  }))
  return (
    <Grid container item sx={{ paddingTop: '12px !important' }}>
      <Box
        sx={{
          ...styleGroupInfo
        }}
      >
        <Box>
          {/* <Avatar alt="Remy Sharp" sx={{ ...styleAvatar }} src={avatar ?? AvtDefault} /> */}
          <AvatarCustom alt="Employee" size={AVATAR_SIZE.MIDDLE} thumbnail_url={avatar} />
        </Box>
        <Box>
          <GroupEmployeeInfo>
            <TitleEmployee>{t('information.name')}</TitleEmployee>
            <Typography
              sx={{
                ...styleContent
              }}
            >
              {fullName}
            </Typography>
            {employee_code && <Typography sx={{ ...styleContent }}> - {employee_code}</Typography>}
          </GroupEmployeeInfo>
          <GroupEmployeeInfo>
            <TitleEmployee>{t('branch')}</TitleEmployee>

            <Typography
              sx={{
                ...styleContentNomarl
              }}
            >
              {branchName}
            </Typography>
          </GroupEmployeeInfo>
          <GroupEmployeeInfo>
            <TitleEmployee>{t('department')}</TitleEmployee>
            <Typography
              sx={{
                ...styleContentNomarl
              }}
            >
              {departmentName}
            </Typography>
          </GroupEmployeeInfo>
          <GroupEmployeeInfo>
            <TitleEmployee>{t('position')}</TitleEmployee>
            <Typography
              sx={{
                ...styleContentNomarl
              }}
            >
              {positionName}
            </Typography>
          </GroupEmployeeInfo>
        </Box>
      </Box>
    </Grid>
  )
}
const styleContent = {
  fontSize: { xs: '14px', sm: '16px' },
  fontWeight: '600',
  lineHeight: '22px'
}

const styleContentNomarl = {
  fontSize: { xs: '14px', sm: '16px' },
  fontWeight: '500',
  lineHeight: '22px'
}

const styleAvatar = {
  width: { xs: '60px', md: '100px' },
  height: { xs: '60px', md: '100px' }
}
const styleGroupInfo = {
  display: 'flex',
  width: '100%',
  gap: 2,
  alignItems: 'center',
  marginBottom: { xs: '10px', sm: '20px' }
}
export { EmployeeSummaryInfov2 }

