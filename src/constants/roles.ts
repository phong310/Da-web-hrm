export const allRoles = {
    "employee": "employee",
    "manager": "manager",
    "accountant": "accountant",
    "admin": "admin",
}
export const checkHasRole = (routerRole: string | undefined, roleUser: string | null) => {
    if (!roleUser) {
        return false
    }
    return routerRole === roleUser
}