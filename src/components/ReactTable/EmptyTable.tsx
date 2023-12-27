import { Stack, styled, Typography } from '@mui/material'
import NoDataSvg from "../../assets/svgs/no_data.svg"
import { useTranslation } from 'react-i18next'

// @ts-ignore
const Empty = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 48,
  backgroundColor: theme.palette.grey[100],
  marginBottom: theme.spacing(2),
  width: '100%'
}))

const EmptyTable: React.VFC = () => {
  const { t } = useTranslation()
  return (
    <Stack justifyContent="center" alignItems="center" spacing={0.5} height="100vh">
      <img src={NoDataSvg}  />
      <Typography variant="body2" color="grey.400">
        {t('no_data')}
      </Typography>
    </Stack>
  )
}

export { EmptyTable }
