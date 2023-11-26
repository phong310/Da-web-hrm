import { useAtom } from 'jotai'
import { historyAtom, historyCapacity } from '../atom/historyAtom'

const useHistory = () => {
  const [history, setHistory] = useAtom(historyAtom)

  const push = (newPath: string) => {
    if (newPath !== history[history.length - 1]) {
      if (history.length >= historyCapacity) {
        history.shift()
        setHistory([...history, newPath])
      } else {
        setHistory([...history, newPath])
      }
    }
  }
  return {
    push,
    history
  }
}

export { useHistory }
