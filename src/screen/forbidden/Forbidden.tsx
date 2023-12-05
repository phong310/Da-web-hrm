import { Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Forbidden: React.VFC = () => {
  const navigate = useNavigate()
  return (
    <Stack justifyContent="center" alignItems="center" spacing={10} mt={4}>
      <Typography variant={'h1'}>Forbidden</Typography>
      <Button onClick={() => navigate(-1)}>Go back</Button>
    </Stack>
  )
}

export { Forbidden }
