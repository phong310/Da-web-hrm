
import { ServerValidateError } from 'lib/types/utils'
import { ErrorOption, FieldValues, Path, UseFormSetError } from 'react-hook-form'

export const handleValidateErrors = <T extends FieldValues>(
    error: ServerValidateError<T>,
    setError: UseFormSetError<T>,
    options: ErrorOption = {}
) => {
    for (const name in error.errors) {
        setError(name as unknown as Path<T>, {
            ...options,
            message: error.errors[name]
        })
    }
}