import { useAtom, useSetAtom } from 'jotai'
import { messageAtom } from 'lib/atom/alertAtom'

const useAlert = () => {
    const [message] = useAtom(messageAtom)
    const setMessage = useSetAtom(messageAtom)

    return {
        message,
        setMessage
    }
}

export { useAlert }
