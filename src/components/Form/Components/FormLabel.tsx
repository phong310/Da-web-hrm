import { FormLabel as MFormLabel, styled } from '@mui/material'

const FormLabel = styled(MFormLabel)(({ theme }) => ({
  color: '#4B5058',
  fontSize: 14,
  marginBottom: theme.spacing(0.5),
  fontWeight: 500
}))

export { FormLabel }
