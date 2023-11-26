import { Avatar } from '@mui/material'
import AvtDefault from 'assets/images/no-image.jpg'

type Size = {
  xs: number
  md: number
}

type AvatarProps = {
  thumbnail_url?: string
  size: Size
  alt: string
}

const AvatarCustom: React.FC<AvatarProps> = ({ thumbnail_url, size, alt }) => {
  return <Avatar src={thumbnail_url ?? AvtDefault} alt={alt} sx={{ width: size, height: size }} />
}

export { AvatarCustom }
