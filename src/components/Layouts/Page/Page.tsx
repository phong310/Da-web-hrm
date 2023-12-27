import {
  Box,
  Breadcrumbs,
  Paper,
  PaperProps,
  Stack,
  Theme,
  Typography
} from '@mui/material'
import Link from '@mui/material/Link'
import { CustomBreadCrumbs } from 'components/BreadCrumbs/CustomBreadCrumbs'
import React from 'react'
import { useTranslation } from 'react-i18next'

type PageProps = {
  title?: string | JSX.Element
  leftHeader?: React.ReactNode
  isDisableBreadcrumb?: boolean
  enableBreadCrum?: boolean
  sxCustom?: any
  titleDelete?: string | JSX.Element
} & PaperProps

const Page: React.VFC<PageProps> = ({
  children,
  title,
  leftHeader,
  enableBreadCrum,
  isDisableBreadcrumb,
  sxCustom,
  titleDelete,
  ...paperProps
}) => {
  const { t } = useTranslation()

  return (
    <>
      <CustomBreadCrumbs isDisableBreadcrumb={isDisableBreadcrumb} />
      <Paper
        elevation={1}
        sx={{
          padding: { md: '16px 16px', xs: '12px 8px' },
          margin: '8px 0',
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
        {(title || titleDelete || leftHeader) && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={{ xs: 1, sm: 'unset' }}
            justifyContent="space-between"
            mb={2}
          >
            <Typography
              variant="h5"
              sx={{
                textTransform: 'uppercase',
                fontWeight: 600,
                fontFamily: 'Lato',
                fontSize: { xs: '1rem', md: '1.5rem' }
              }}
              // color :"grey.900"
              color="var(--primary-600, #146BD2)"
            >
              {title}
            </Typography>
            <Box width={{ xs: '100%', sm: 'fit-content' }}>{leftHeader}</Box>
          </Stack>
        )}
        {children}
      </Paper>
    </>
  )
}


export { Page }
