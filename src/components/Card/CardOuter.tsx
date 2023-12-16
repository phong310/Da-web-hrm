import { CardProps, Box, styled } from '@mui/material'
import { ReactNode } from 'react'

type CardOuterProps = {
  children: ReactNode
} & CardProps

export const CardOuter: React.VFC<CardOuterProps> = ({ children, ...props }) => {
  return (
    <ContainerStyle
      sx={{
        ...props.sx
      }}
    >
      {children}
    </ContainerStyle>
  )
}

const ContainerStyle = styled(Box)(({ theme }) => ({
  margin: 0,
  backgroundColor: 'white',
  borderRadius: '16px',
  maxWidth: '100%',
  padding: theme.spacing(2.5, 2.5, 3.75, 2.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 0, 2.5, 2)
  }
}))
