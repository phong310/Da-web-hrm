import { Alert, Snackbar } from '@mui/material'
import { useAlert } from 'lib/hook/useAlert'
import { useEffect, useRef } from 'react'

export function MessageAlert() {
  const { message, setMessage } = useAlert()
  const timeout = useRef<number | undefined>()

  useEffect(() => {
    if (!message) {
      return
    }
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      setMessage(null)
    }, 3000)
  }, [message])

  const handleClose = () => {
    setMessage(null)
  }

  return (
    <Snackbar
      open={!!message?.content}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert severity={message?.type}>{message?.content}</Alert>
    </Snackbar>
  )
}
