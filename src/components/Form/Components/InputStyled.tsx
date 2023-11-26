import { OutlinedInput, outlinedInputClasses, styled } from '@mui/material'

const InputStyled = styled(OutlinedInput)(({ theme }) => ({
  [`&.${outlinedInputClasses.disabled}`]: {
    backgroundColor: theme.palette.grey[300]
  },
  '& input:focus': {
    fontSize: '16px'
  },
  height: 46
}))

export { InputStyled }
