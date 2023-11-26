import { Box, FormControl, FormControlProps } from '@mui/material'
import { memo } from 'react'
import { FieldError } from 'react-hook-form'
import { FormHelper } from './FormHelper'

import { styled } from '@mui/system'
import { FormLabel } from './FormLabel'

export type AddControlProps = {
  helperText?: string | JSX.Element
  label?: string
  fieldError?: FieldError | boolean
}

export type InputControlProps = FormControlProps<'div', AddControlProps>

function RawInputControl({
  fieldError,
  fullWidth,
  label,
  helperText,
  children,
  required,
  ...props
}: InputControlProps) {
  return (
    <FormControl fullWidth={fullWidth} error={!!fieldError} {...props}>
      {label && (
        <FormLabel>
          {required ? (
            <>
              {<Styledlabel>{label}</Styledlabel>}
              <Box sx={{ marginLeft: '3px' }} component="span" color="red">
                *
              </Box>
            </>
          ) : (
            <>{<Styledlabel>{label}</Styledlabel>}</>
          )}
        </FormLabel>
      )}

      {children}

      {!!fieldError && (
        <FormHelper error>
          {typeof fieldError === 'boolean' ? helperText : fieldError?.message}
        </FormHelper>
      )}
      {helperText && <FormHelper error={false}>{helperText}</FormHelper>}
    </FormControl>
  )
}

const InputControl = memo(RawInputControl) as typeof RawInputControl
const Styledlabel = styled('span')(({ theme }) => ({
  color: '#000',
  fontSize: '16px',
  textAlign: 'left',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px'
  }
}))
export { InputControl }
