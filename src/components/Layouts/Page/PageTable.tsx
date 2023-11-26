import {
    Box,
    Breadcrumbs,
    PaperProps,
    styled,
    Theme,
    Typography
} from '@mui/material'
import Link from '@mui/material/Link'
import React from 'react'
import { useTranslation } from 'react-i18next'

type PageProps = {
  title?: string | JSX.Element
  leftHeader?: React.ReactNode
  isDisableBreadcrumb?: boolean
  enableBreadCrum?: boolean
  sxCustom?: any
  titleNew?: string | JSX.Element
} & PaperProps

const PageTable: React.VFC<PageProps> = ({
  children,
  title,
  leftHeader,
  enableBreadCrum,
  isDisableBreadcrumb,
  sxCustom,
  titleNew,
  ...paperProps
}) => {
  const { t } = useTranslation()

  return (
    <Box
      elevation={1}
      sx={{
        padding: { xs: 2, sm: 4 },
        width: { xs: '100%', md: 'auto' },
        minHeight: (theme: Theme) => `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
        borderRadius: { xs: 0, sm: 2 },
        ...sxCustom
      }}
      {...paperProps}
    >
      {enableBreadCrum == true && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: { xs: '0', md: 'none' } }}>
          <Link
            underline="hover"
            href="/"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              fontSize: '14px',
              fontWeight: 400
            }}
          >
            {t('dashboard.overview')}
          </Link>
          <Typography sx={{ fontWeight: 900, color: 'inherit', fontSize: '14px' }}>
            {t('information.title')}
          </Typography>
        </Breadcrumbs>
      )}
      {(title || leftHeader || titleNew) && (
        <Box sx={{ ...styleBoxTitle }}>
          <Typography
            sx={{
              ...styleTyporaphyTitle
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              ...styleTyporaphyTitleNew
            }}
          >
            {titleNew}
          </Typography>
          <Box sx={{ ...styleLeftHeader }}>
            <Box
            >
              {leftHeader}
            </Box>
          </Box>
        </Box>
      )}
      {children}
    </Box>
  )
}

const CustomLink = styled(Link)({
  fontSize: '14px'
})

const styleTyporaphyTitle = {
  display: { xs: 'block', md: 'none', lg: 'none' },
  fontSize: { xs: '18px', md: '20px', lg: '24px' },
  fontWeight: 800,
  marginBottom: '24px',
  ml: 2,
  textTransform: 'uppercase',
  fontFamily: 'Lato',
  color: '#146BD2',
  lineHeight: '36px',
  '@media (min-width: 350px) and (max-width: 1366px)': {
    display: 'block'
  }
}
const styleTyporaphyTitleNew = {
  fontSize: { xs: '16px', md: '20px', lg: '24px' },
  fontWeight: 800,
  textTransform: 'uppercase',
  fontFamily: 'Lato',
  color: '#146BD2',
  marginBottom: { xs: '24px', md: 0 },
  lineHeight: '36px',
  // width: '100%'
}

const styleBoxTitle = {
  display: { md: 'flex' },
  // width: '100%',
  alignItems: 'flex-start',
  justifyContent: 'space-between'
}

const styleLeftHeader = {
  display: 'flex',
  justifyContent: 'flex-end',
  // width: '100%'
}

export { PageTable }

