import { useEffect, useRef, useState } from 'react'

export function useDebouncedValue<T extends any>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useDebouncedCallback<A extends any[]>(callback: (...args: A) => void, delay?: number) {
  const argsRef = useRef<A>()
  const timeout = useRef<number>()

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
  }, [])

  return (...args: A) => {
    argsRef.current = args

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current)
      }
    }, delay || 200)
  }
}
