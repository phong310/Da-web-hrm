import { Chip, styled } from '@mui/material'

const Tag = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius
}))

export { Tag }
