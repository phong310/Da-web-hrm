import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import CustomDateAdapter from 'components/CustomDateAdapter'
import { enUS, ja, vi } from 'date-fns/locale'
import { useAuth } from 'lib/hook/useAuth'
import { queryClient } from 'lib/react-query'
import { Suspense, useEffect, useState } from 'react'
import { QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Router } from 'routers'
import { defaultTheme } from 'styles/theme'

const locale: any = {
  en: enUS,
  vi: vi,
  ja: ja
}

function App() {
  const { fetchUser } = useAuth()
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const [language, setLanguage] = useState<string>()

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
