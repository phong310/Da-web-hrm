import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, Grid, IconButton, Stack, styled, SvgIcon, Toolbar } from '@mui/material'
import Logo from 'assets/images/logo.png'
import React from 'react'
import { Link } from 'react-router-dom'
import { PropsType } from './Header'
import { Notification } from './Notification'
import { ProfileHeader } from './ProfileHeader'

const MobileHeader: React.VFC<PropsType> = ({ triggerSidebar }) => {
  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#fff' }} elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" width="100%">
            <Grid item xs={4}>
              <Stack direction="row" alignItems="center" justifyContent="space-around">
                <Link to="/">
                  <LogoImg src={Logo} alt="logo" />
                </Link>
              </Stack>
            </Grid>

            <Grid item xs={8}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                <Notification />

                {/* <IconButton>
                  <SvgIcon>
                    <QuestionIcon />
                  </SvgIcon>
                </IconButton> */}
                <Box sx={{ mt: '10px' }}>
                  <ProfileHeader />
                </Box>

                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={triggerSidebar}
                  edge="start"
                >
                  <MenuIcon color="primary" />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )
}

const LogoImg = styled('img')(({ theme }) => ({
  height: theme.spacing(3),
  lineHeight: theme.spacing(2)
}))

export { MobileHeader }
