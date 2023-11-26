export type Address = {
    id: number
    province: string
    district: string
    ward: string
    address: string
    type: number
    personal_information_id: number
}
export type Addresses = Array<Address>

export type AddressesObj = {
    id: number
    RESIDENT: Address
    DOMICILE: Address
}
