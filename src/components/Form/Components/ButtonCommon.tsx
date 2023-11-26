import { Button } from '@mui/material'
import { SIZE_BUTTON } from 'lib/utils/contants'
import { ReactNode } from 'react'
import { blueV2 } from 'styles/colors'
type ButtonProps = {
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  variant?: 'text' | 'contained' | 'outlined'
  onClick?: () => void
  children?: ReactNode
  sx?: any
  error?: boolean
  type?: 'reset' | 'submit' | 'button'
  startIcon?: ReactNode
  disabled?: true | false
  fontSize?: keyof typeof SIZE_BUTTON
}

// Đặt biến ButtonCommonStyle ở ngoài component
const ButtonCommonStyle = (error: boolean) => ({
  fontWeight: 400,
  whiteSpace: 'nowrap',
  display: 'flex',
  gap: 1,
  width: '100%',
  height: '40px',
  // color: error ? '#146BD2' : '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  border: error ? `1px solid ${blueV2[50]}` : 'initial',
  fontSize: SIZE_BUTTON.NORMAL
})
const ButtonCommon: React.FC<ButtonProps> = ({
  color,
  type,
  variant,
  error,
  startIcon,
  onClick,
  children,
  disabled,
  sx
}) => {
  //@ts-ignore
  const buttonStyle = ButtonCommonStyle(error)
  return (
    <Button
      color={color}
      startIcon={startIcon}
      disabled={disabled}
      type={type}
      fullWidth
      variant={variant}
      sx={{ ...buttonStyle, ...sx }} // Ép kiểu dữ liệu của sx props
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export { ButtonCommon }

