import i18n from 'lib/lang/translations/i18n'
import { upperCamelToSnakeCase } from './misc'
import { ACTION_FORM } from './contants'

const createContentNoti = (model_type: string, type: number) => {
    const content = ` ${i18n.t(
        `notification.${ACTION_FORM[type]}.${upperCamelToSnakeCase(model_type)}`
    )}`
    return content
}

export { createContentNoti }
