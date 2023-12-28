// @ts-nocheck
import { V1 } from 'constants/apiVersion'
import { request } from 'lib/request'
import { toast } from 'react-toastify'
const markAsRead = async (id: number | string) => {
    try {
        const res = await request.patch(`${V1}/user/notifications/mark-as-read/${id}`)
    } catch (error:any) {
        toast.error(error.message)
    }
}

const markAllAsReadApi = async () => {
    try {
        const res = await request.patch(`${V1}/user/notifications/mark-all-as-read`)
    } catch (error:any) {
        toast.error(error.message)
    }
}

const markAsSeenApi = async () => {
    try {
        const res = await request.patch(`${V1}/user/notifications/mark-as-seen`)
    } catch (error:any) {
        toast.error(error.message)
    }
}

export { markAsRead, markAllAsReadApi, markAsSeenApi }
