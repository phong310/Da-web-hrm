import { Addresses } from "./address"
import { BaseMaster } from "./baseMaster"
import { Educations } from "./education"
import { IdentificationCards } from "./identificationCard"

export type PersonalInformation = {
    id: number
    first_name: string
    last_name: string
    title_id: number
    nickname: string
    birthday: string
    marital_status: number
    sex: number
    education_level_id: number
    email: string
    phone: string
    note: string
    country_id: number
    ethnic: string
    job: BaseMaster
    country: BaseMaster
    education_level: BaseMaster
    addresses: Addresses
    educations: Educations
    identification_cards: IdentificationCards
}
