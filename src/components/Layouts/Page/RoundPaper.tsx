import { Box, Paper, PaperProps, styled, Typography } from '@mui/material'
import { ReactElement } from 'react'

type RoundPaperProps = {
  status?: ReactElement
  roundTitle?: React.ReactNode
} & PaperProps

export const RoundPaper: React.VFC<RoundPaperProps> = ({
  children,
  roundTitle,
  status,
  ...paperProps
}) => {
  return (
    <RoundPaperStyled {...paperProps}>
      {roundTitle && (
        <Box
          bgcolor="grey.300"
          py={2}
          pl={4}
          sx={{
            borderTopLeftRadius: (theme) => theme.spacing(0.5),
            borderTopRightRadius: (theme) => theme.spacing(0.5),
            ...styleBox
          }}
        >
          <Typography fontSize={18} fontWeight={700} lineHeight="22px" component="span">
            {/* {roundTitle} */}
          </Typography>
          {status}
        </Box>
      )}
      {children}
    </RoundPaperStyled>
  )
}

const RoundPaperStyled = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  boxShadow: 'rgb(88 102 126 / 8%) 0px 4px 24px, rgb(88 102 126 / 12%) 0px 1px 2px',

  [theme.breakpoints.down('sm')]: {
    borderRadius: theme.spacing(0.75)
  }
}))

const styleBox = {
  display: 'flex',
  alignItems: 'center',
  gap: 2
}
