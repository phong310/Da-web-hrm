import { Box, BoxProps } from '@mui/material'

type Props = BoxProps & {
  color: string
}

const TitleCard = ({ color, children }: Props) => {
  return (
    <Box display={'flex'} alignItems={'center'}>
      <Box width={6} height={30} borderRadius={0.5} bgcolor={color} mr={{ xs: 1, md: 2 }} />
      {children}
    </Box>
  )
}

export default TitleCard
