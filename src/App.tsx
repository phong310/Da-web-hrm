// @ts-nocheck
import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClientProvider } from 'react-query'
import { Suspense, useEffect, useState } from 'react'
import { queryClient } from 'lib/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Router } from './routers'
import { defaultTheme } from './styles/theme'
import { useAuth } from 'lib/hook/useAth'
import { enUS, vi } from 'date-fns/locale'
import { LocalizationProvider } from '@mui/x-date-pickers'
import CustomDateAdapter from 'components/CustomDateAdapter'

const locale: any = {
  en: enUS,
  vi: vi
}

function App() {
  const [language, setLanguage] = useState<string>()
  const { fetchUser } = useAuth()
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  useEffect(() => {
    const l = localStorage.getItem('language')

    if (l) {
      setLanguage(l)
    } else {
      setLanguage('en')
    }
  }, [])

  return (
    <ThemeProvider theme={defaultTheme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <LocalizationProvider
          locale={locale[language || 'en']}
          dateAdapter={CustomDateAdapter as any}
        >
          <Suspense fallback="Loading...">
            <ToastContainer />
            <Router />
          </Suspense>
        </LocalizationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
