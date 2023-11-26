import { atomWithStorage } from 'jotai/utils'

type PositionAndTitles = {
  value: string
  key: number
}

export type PositionAndTitleResponse = {
  positions: PositionAndTitles[]
  titles: PositionAndTitles[]
}
const positionAndTitle = atomWithStorage<PositionAndTitleResponse>('positions_titles', {
  positions: [],
  titles: []
})

export { positionAndTitle }
