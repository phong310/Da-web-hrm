export type IdentificationCard = {
    id: number
    ID_no: string
    issued_date: string
    issued_by: string
    ID_expire: string
    type: number
    personal_information_id: number
}

export type IdentificationCards = Array<IdentificationCard>

export type IdentificationCardsObj = {
    id: number
    CMT: IdentificationCard
    TCC: IdentificationCard
}
