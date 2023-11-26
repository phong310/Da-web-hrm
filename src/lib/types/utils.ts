/* eslint-disable @typescript-eslint/no-explicit-any */
export type Maybe<T> = T | null | undefined
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
    /** An ISO 8601-encoded date */
    ISO8601Date: any
    /** An ISO 8601-encoded datetime */
    ISO8601DateTime: any
    /** Represents untyped JSON */
    JSON: any
}

export type Pagination<T> = {
    data: T[]
    meta: {
        pagination: {
            current_page: number
            from: number
            total_pages: number
            per_page: number
            to: number
            total: number
        }
    }
}

export type ServerResponse<T> = {
    message?: string
    data: T
}

export type ServerError = {
    message: string
}

export type UnknownObj = Record<string, unknown>

export type ServerValidateError<T> = {
    errors: Record<keyof T, string>
}

export type MessageType = {
    type: 'success' | 'error' | 'info'
    content?: string
}
