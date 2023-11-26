import { Box, Stack, Typography } from '@mui/material'
import { AvatarCustom } from 'components/Form/Components/AvatarCustom'
import { AVATAR_SIZE } from 'lib/utils/contants'
import { grey } from 'styles/colors'
interface TimesheetEmployeeProps {
  avatar: string
  fullname: string
  job: string
  employee_code?: string
}

const styleTextFullName = {
  fontWeight: 600,
  fontSize: {
    xs: '14px',
    sm: '16px'
  },
  lineHeight: '22px',
  color: grey[900],
  whiteSpace: 'nowrap'
}

const styleTextInfo = {
  fontWeight: 400,
  fontSize: {
    xs: '12px',
    sm: '14px'
  },
  lineHeight: '140%',
  color: grey[500],
  whiteSpace: 'nowrap'
}

const styleAvatar = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 1
}

const TimesheetEmployee = (props: TimesheetEmployeeProps) => {
  const { avatar, fullname, job, employee_code } = props
  return (
    <Stack
      direction="row"
      sx={{
        width: '100%'
      }}
    >
      <Box sx={{ ...styleAvatar }}>
        <AvatarCustom alt="Employee" size={AVATAR_SIZE.MIN} thumbnail_url={avatar} />
      </Box>
      <Box>
        <Typography sx={{ ...styleTextFullName }}>{fullname}</Typography>
        <Typography sx={{ ...styleTextInfo }}>
          {employee_code ? `MNV : ${employee_code}` : ''}
        </Typography>
        <Typography sx={{ ...styleTextInfo }}>{job}</Typography>
      </Box>
    </Stack>
  )
}

export { TimesheetEmployee }

