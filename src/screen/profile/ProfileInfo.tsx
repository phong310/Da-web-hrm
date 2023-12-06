import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from 'lib/hook/useAuth'
import { Pagev2 } from 'components/Layouts/Page/Pagev2'
import { EmployeeTabv2 } from './EmployeeTabv2'

const ProfileInfo = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [button, setButton] = useState(false)

  return (
    <Pagev2>
      <EmployeeTabv2 />
      <Outlet />
    </Pagev2>
  )
}

export { ProfileInfo }
