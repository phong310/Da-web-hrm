import { useEffect, useRef, useState } from 'react'

function useCurrentTime() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const timeout = useRef<number>()
    useEffect(() => {
        timeout.current = setTimeout(() => setCurrentTime(new Date()), 1000)

        return () => {
            clearTimeout(timeout.current)
        }
    }, [currentTime])

    return [currentTime]
}

export { useCurrentTime }
