import { atomWithStorage } from 'jotai/utils'

const historyAtom = atomWithStorage<string[]>('history', [])
const historyCapacity = 20

export { historyAtom, historyCapacity }
