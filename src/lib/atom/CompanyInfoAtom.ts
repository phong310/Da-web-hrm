import { atomWithStorage } from "jotai/utils";
import { CompanyData } from "lib/types/companyGroup";

const companyAtom = atomWithStorage<CompanyData>('company_info', {
    id: 0,
    name: "",
    phone_number: "",
    tax_code: "",
    address: "",
    status: 0,
    type_of_business: 0,
    representative: "",
    logo: "",
    is_create: 0
})
export { companyAtom }
