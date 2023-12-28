import { UnknownObj } from "./utils"

// @ts-ignore
export type NotificationType<T = UnknownObj> = {
    id: string
    content: string
    status: number
    model_id: number
    model_type: string
    type: number
    created_at: string
    full_name_sender: string
}

export type Message = {
    type: 'error' | 'success' | 'info'
    content?: string
}
