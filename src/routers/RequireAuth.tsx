import { useAuth } from 'lib/hook/useAuth'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type RequireAuthProps = {
  children: JSX.Element
}

const RequireAuth: React.VFC<RequireAuthProps> = ({ children }) => {
  const { auth } = useAuth()
  const location = useLocation()

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  return children
}

export { RequireAuth }
