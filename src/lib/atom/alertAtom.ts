import { atom } from 'jotai'
import { MessageType } from 'lib/types/utils'

const messageAtom = atom<MessageType | null>(null)

export { messageAtom }
