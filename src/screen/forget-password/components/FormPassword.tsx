// @ts-nocheck
import { Container, Stack, Typography } from '@mui/material'
import Logo from '../../../assets/svgs/logo.svg'
import { Page } from 'components/Layouts/Page/Page'
import React from 'react'

interface IFormPassword {
  title: string
}

export const FormPassword: React.FC<IFormPassword> = ({ children, title }) => {
  return (
    <Container
      sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Page
        sxCustom={{
          width: '100%',
          maxWidth: '500px',
          padding: {
            xs: '16px',
            sm: '40px 40px 32px 40px'
          },
          boxShadow: {
            sm: 'rgb(88 102 126 / 8%) 0px 4px 24px, rgb(88 102 126 / 12%) 0px 1px 2px',
            xs: 'unset'
          },
          backgroundColor: {
            sm: 'inherit',
            xs: 'transparent'
          }
        }}
      >
        <Stack
          sx={{
            alignItems: 'center',
            mb: {
              xs: '24px',
              sm: '32px'
            }
          }}
        >
          <img src={Logo} alt="logo" width={175} />
          <Typography sx={{ fontWeight: 700, mt: '16px', fontSize: '32px', color: '#3d4852' }}>
            {title}
          </Typography>
        </Stack>
        {children}
      </Page>
    </Container>
  )
}
