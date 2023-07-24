import React, { RefObject, useEffect } from 'react'

export const useClickOutside = (ref: RefObject<Element>, callback?: () => void) => {
  useEffect(() => {
    if (ref.current && callback) {
      const handleClick = (e: Event) => {
        if (!ref.current.contains(e.target as Node)) {
          callback()
        }
      }
      document.addEventListener('click', handleClick, true)
      return () => {
        document.removeEventListener('click', handleClick, true)
      }
    }
  }, [ref, callback])
}
