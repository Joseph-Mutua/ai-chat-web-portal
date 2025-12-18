import { debounce } from 'lodash'

import { useEffect, useState } from 'react'

export const useDebounceInput = (inputText: string, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(inputText)

  useEffect(() => {
    const handler = debounce((newValue: string) => {
      setDebouncedValue(newValue)
    }, delay)

    handler(inputText)

    return () => handler.cancel()
  }, [inputText, delay])

  return debouncedValue
}
