import { UserLoginArgs, UserLoginRes } from 'lib/types/auth'
import { request } from '../request'
import { EmployeeType, UserType } from 'lib/types/user'

const loginApi = (args: UserLoginArgs) => request.post<UserLoginRes>('1.0/user/login', args)

const logoutApi = () => request.post('1.0/user/logout')

const userApi = () => request.get<UserType>('1.0/user/me')

const userInfoApi = () => request.get<EmployeeType>('1.0/user/employee/me/info')

export { loginApi, logoutApi, userApi, userInfoApi }
