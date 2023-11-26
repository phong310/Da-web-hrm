import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { UserType } from '../types/user'
import { SystemSetting } from '../types/system_setting'
import { UserToken } from '../types/auth'


const SystemSettingDefault = {
    format_date: '',
    time_zone: '',
    locale: '',
    company_id: ''
}

const userAtom = atom<UserType | null>(null)
const systemSettingAtom = atom<SystemSetting | null>(null)
const tokenAtom = atomWithStorage<UserToken | null>('user-token', null)

const storeAuth = atom((get) => !!get(tokenAtom))
const fetchAuthAtom = atom(true)
const loadAuthAtom = atom((get) => get(storeAuth) && get(fetchAuthAtom))
const roleAtom = atom<string | null>(null)
const permissionsAtom = atom<Array<string> | null>(null)

export {
    userAtom,
    systemSettingAtom,
    tokenAtom,
    storeAuth,
    fetchAuthAtom,
    loadAuthAtom,
    roleAtom,
    permissionsAtom
}
