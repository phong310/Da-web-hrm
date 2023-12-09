import { useAtom, useSetAtom, useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import { formatNormalDate } from '../utils/format'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, logoutApi, userApi } from '../api/auth'
import {
    fetchAuthAtom,
    loadAuthAtom,
    permissionsAtom,
    roleAtom,
    systemSettingAtom,
    tokenAtom,
    userAtom
} from '../atom/authAtom'
import { UserLoginArgs } from '../types/auth'
import { timekeepingAtom, timekeepingReminderFirstInDateAtom } from 'lib/atom/timekeepingAtom'
import { checkHasTimekeepingYesterday } from 'lib/api/timekeeping'
const useAuth = () => {
    const [user] = useAtom(userAtom)
    const [systemSetting] = useAtom(systemSettingAtom)
    const loading = useAtomValue(loadAuthAtom)
    const [role] = useAtom(roleAtom)
    const [permissions] = useAtom(permissionsAtom)
    const [timekeeping] = useAtom(timekeepingAtom)

    const navigate = useNavigate()
    const setToken = useSetAtom(tokenAtom)
    const setUser = useSetAtom(userAtom)
    const setSystemSetting = useSetAtom(systemSettingAtom)
    const setFetching = useSetAtom(fetchAuthAtom)
    const setRole = useSetAtom(roleAtom)
    const setPermissions = useSetAtom(permissionsAtom)
    const setTimekeeping = useSetAtom(timekeepingAtom)
    const [timekeepingReminderFirstInDate, setTimekeepingReminderFirstInDate] = useAtom(
        timekeepingReminderFirstInDateAtom
    )
    
    const auth = !!user

    const login = async (args: UserLoginArgs) => {
        const res = await loginApi(args)
        const { user, ...token } = res.data
        setUser(user)
        setToken(token)
        setRole(user.role)
        setPermissions(user.all_permissions)
        setSystemSetting(user?.setting)
        localStorage.setItem('system-setting', JSON.stringify(user.setting))

        const hasTimekeepingYesterday = await checkHasTimekeepingYesterday()
        setTimekeeping(hasTimekeepingYesterday.data)
        setTimekeepingReminderFirstInDate({
            date: hasTimekeepingYesterday.data.date,
            is_first: true
        })
    }

    const logout = async () => {
        await logoutApi()
        setUser(null)
        setPermissions(null)
        setRole(null)
        setSystemSetting(null)
        localStorage.removeItem('user-token')
        localStorage.removeItem('system-setting')
        localStorage.removeItem('timekeeping-reminder-first-in-date')
        setFetching(false)
    }

    const fetchUser = useAtomCallback(
        useCallback(
            async (get) => {
                try {
                    const token = get(tokenAtom)
                    if (token?.access_token) {
                        const res = await userApi()
                        setRole(res?.data.role)
                        setPermissions(res?.data.all_permissions)
                        setUser(res?.data)
                        setSystemSetting(res?.data?.setting)
                        localStorage.setItem('system-setting', JSON.stringify(res?.data?.setting))
                        if (res.data.is_first_time_login) {
                            navigate('/time-keeping/timekeeping', {
                                replace: true
                            })
                        }

                        const hasTimekeepingYesterday = await checkHasTimekeepingYesterday()
                        setTimekeeping(hasTimekeepingYesterday.data)

                        setTimekeepingReminderFirstInDate({
                            date: hasTimekeepingYesterday.data.date,
                            is_first:
                                formatNormalDate(timekeepingReminderFirstInDate.date) !==
                                formatNormalDate(hasTimekeepingYesterday.data.date)
                        })
                    }
                    setFetching(false)
                } catch (error) {
                    setFetching(false)
                    setUser(null)
                }
            },
            [setFetching, setUser]
        )
    )

    return {
        auth,
        user,
        systemSetting,
        logout,
        login,
        fetchUser,
        loading,
        permissions,
        role,
        timekeeping
    }
}

export { useAuth }
