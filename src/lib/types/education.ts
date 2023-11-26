export type Education = {
    id: number
    school_name: string
    from_date: string
    to_date: string
    description: string
    education: any
    personal_information_id: number
}

export type Educations = Array<Education>
export type EducationsObj = {
    id: number
    educations: Array<Education>
}
