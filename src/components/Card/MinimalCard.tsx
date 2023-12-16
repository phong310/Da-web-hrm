import { Box, Stack, SxProps, Typography, styled } from '@mui/material'
// import { contentText } from 'lib/utils/v2'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Greyscale } from 'styles/colors'
// import { Greyscale } from 'styles/v2'

const ContainerStyled = styled(Box)({
  borderRadius: '16px',
  textAlign: 'center',
  padding: '24px',
  margin: 0,
  boxShadow: 'rgb(88 102 126 / 8%) 0px 4px 24px, rgb(88 102 126 / 12%) 0px 1px 2px'
})
interface MinimalCardProps {
  title: string
  content: string | number | React.ReactNode
  name?: string
  nameArr?: string[]
  adminApiPrefix?: string
  userApiPrefix?: string
  isTimeStatisticBox?: boolean
  month?: string
  background?: string
  colorText?: string
}

export const MinimalCard: React.VFC<MinimalCardProps> = (props: MinimalCardProps) => {
  const {
    title,
    content,
    adminApiPrefix,
    isTimeStatisticBox,
    userApiPrefix,
    month,
    background,
    colorText
  } = props
  const { t } = useTranslation()

  const underLineCss: SxProps = {
    position: 'relative',
    '&:before': {
      position: 'absolute',
      content: "''",
      width: '100%',
      height: '1px',
      background: colorText,
      top: '20px'
    }
  }

  return (
    <ContainerStyled
      sx={{
        backgroundColor: background,
        height: { xs: '135px', sm: '158px', md: '190px' }
      }}
    >
      <Stack alignItems="center" justifyContent="space-between" height="100%">
        <Box>
          <TitleStyle>{title}</TitleStyle>
        </Box>
        <Box
          sx={{
            ...contentText,
            wordBreak: 'break-word'
          }}
        >
          {content}
        </Box>
        <Box sx={{ ...styleBoxLink }}>
          <Link
            to={
              isTimeStatisticBox
                ? `/time-keeping/timesheet?month=${month}`
                : month
                ? `/applications/${adminApiPrefix ? adminApiPrefix : userApiPrefix}?month=${month}`
                : `${adminApiPrefix ? adminApiPrefix : userApiPrefix}`
            }
            color={colorText}
            style={{
              textDecoration: 'none',
              color: colorText
            }}
          >
            <TextDetailStyle sx={{ ...underLineCss }}> {t('overview.detail')}</TextDetailStyle>
          </Link>
        </Box>
      </Stack>
    </ContainerStyled>
  )
}

const TitleStyle = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  lineHeight: '22px',
  color: Greyscale['900'],
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    fontSize: 12,
    lineHeight: '18px'
  },
  [theme.breakpoints.down('lg')]: {
    fontSize: 14,
    lineHeight: '18px',
    width: '116px'
  }
}))

const TextDetailStyle = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  lineHeight: '22px',
  [theme.breakpoints.down('sm')]: {
    fontSize: 14,
    lineHeight: '20px'
  }
}))

const styleBoxLink = {
  display: ' flex',
  alignItems: 'center'
}

export const contentText = {
  fontSize: { xs: 16, sm: 16, md: 22, lg: 30 },
  lineHeight: '36px',
  fontWeight: 700,
  color: '#111111'
}
