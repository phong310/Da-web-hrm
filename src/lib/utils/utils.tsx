/* eslint-disable react-hooks/rules-of-hooks */
import { Stack, styled, Typography, useMediaQuery, useTheme } from '@mui/material'
// import { contentText } from '.'
// import { Base } from 'styles/v2'
import { useTranslation } from 'react-i18next'
import { Base } from 'styles/colors'
export function minutesToHourObject(minutes: number) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useTranslation()
  let minute = 0
  let hour = 0

  if (minutes < 1) {
    return <Typography sx={{ ...contentText }}>0</Typography>
  }

  hour = Math.floor(minutes / 60)

  minute = Math.floor(minutes - hour * 60)

  return (
    <Stack direction="row" spacing={0.5} justifyContent="center">
      {hour ? (
        <Typography fontSize={30} lineHeight={'36px'} sx={{ ...contentText }}>
          {hour}
          <TimePrefixText> {isMobile ? 'h' : t('hour')} </TimePrefixText>
        </Typography>
      ) : null}
      {minute ? (
        <Typography fontSize={30} lineHeight={'36px'} sx={{ ...contentText }}>
          {minute}
          <TimePrefixText> {isMobile ? 'm' : t('minute')} </TimePrefixText>
        </Typography>
      ) : null}
    </Stack>
  )
}

export const TimePrefixText = styled('span')(({ theme }) => ({
  color: Base.black,
  fontSize: 20,
  lineHeight: '26px',
  opacity: 1,
  fontWeight: 700,
  alignSelf: 'center',
  position: 'relative',
  left: '-3px',
  [theme.breakpoints.down('md')]: {
    fontSize: 14,
    lineHeight: '20px'
  }
}))
export const randomString = (length: number) => {
  const characters = '0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

export const contentText = {
  fontSize: { xs: 16, sm: 16, md: 22, lg: 30 },
  lineHeight: '36px',
  fontWeight: 700,
  color: '#111111'
}
