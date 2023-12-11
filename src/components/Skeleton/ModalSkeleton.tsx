import { Box, DialogContent, Divider, Grid, Skeleton, Typography } from '@mui/material'

const ModalSkeleton = () => {
  return (
    <DialogContent>
      <Box>
        <Box>
          <Typography sx={{ ml: 2, flex: 1 }} variant="subtitle1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ ml: 2, flex: 1 }} variant="subtitle1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ ml: 2, flex: 1 }} variant="subtitle1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ ml: 2, flex: 1 }} variant="subtitle1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Box>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Divider sx={{ margin: '0 -24px', width: 'calc(100% + 48px)' }} />
        </Box>
        <Grid display={'flex'}>
          <Typography sx={{ ml: 2, flex: 1, ...styleTitle }} variant="subtitle1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Grid>
        <Grid display={'flex'} justifyContent={'space-evenly'} sx={{ mb: 4 }}>
          <Box sx={{ ...styleBox }}>
            <Typography variant="subtitle1" sx={{ ...styleTime }} component="div">
              <Skeleton variant="text" />
            </Typography>
          </Box>
          <Box sx={{ ...styleBox }}>
            <Typography variant="subtitle1" sx={{ ...styleTime }} component="div">
              <Skeleton variant="text" />
            </Typography>
          </Box>
        </Grid>
        <Grid display={'flex'} justifyContent={'space-between'}>
          <Typography variant="body1" component="div" sx={{ ml: 2, flex: 1, ...styleBelow }}>
            <Skeleton variant="text" />
          </Typography>
          <Typography sx={{ ...styleKindOfLeave }} variant="body1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Grid>
        <Grid display={'flex'} justifyContent={'space-between'}>
          <Typography variant="body1" component="div" sx={{ ml: 2, flex: 1, ...styleBelow }}>
            <Skeleton variant="text" />
          </Typography>
        </Grid>
        <Grid display={'flex'} justifyContent={'space-between'}>
          <Typography variant="body1" component="div" sx={{ ml: 2, flex: 1, ...styleBelow }}>
            <Skeleton variant="text" />
          </Typography>
        </Grid>
        <Grid display={'flex'} justifyContent={'space-between'}>
          <Typography variant="body1" component="div" sx={{ ml: 2, flex: 1, ...styleBelow }}>
            <Skeleton variant="text" />
          </Typography>
          <Typography sx={{ ...styleBelow2 }} variant="body1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Grid>
        <Grid display={'flex'} justifyContent={'space-between'}>
          <Typography variant="body1" component="div" sx={{ ml: 2, flex: 1, ...styleBelow }}>
            <Skeleton variant="text" />
          </Typography>
          <Typography sx={{ ...styleBelow2 }} variant="body1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Grid>
        <Grid display={'flex'} justifyContent={'space-between'}>
          <Typography variant="body1" component="div" sx={{ ml: 2, flex: 1, ...styleBelow }}>
            <Skeleton variant="text" />
          </Typography>
          <Typography sx={{ ...styleNote, textAlign: 'right' }} variant="body1" component="div">
            <Skeleton variant="text" />
          </Typography>
        </Grid>
      </Box>
    </DialogContent>
  )
}

const styleTitle = {
  color: '#146BD2',
  fontSize: { xs: '13px', sm: '18px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px',
  mb: 2
}

export { ModalSkeleton }

const styleTime = {
  fontSize: { xs: '12px', sm: '18px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '26px',
  color: '#20B369'
}

const styleBox = {
  display: 'flex',
  width: '300px',
  padding: '8px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px',
  background: '#EDFFF6',
  borderRadius: '8px'
}

const styleBelow = {
  fontSize: { xs: '14px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '400',
  lineHeight: '22px',
  mb: 3,
  color: '#111'
}
const styleBelow2 = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  mb: 3
}

const styleNote = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  width: { xs: '100px', sm: '300px' },
  mb: 3
}

const styleKindOfLeave = {
  fontSize: { xs: '13px', sm: '16px' },
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: '22px',
  width: { xs: '100px', sm: '242px' },
  mb: 3
}
