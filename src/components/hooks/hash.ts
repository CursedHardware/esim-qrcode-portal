import { useEffect, useState } from 'react'

export function useHashTag(): string {
  const [hashtag, setHashTag] = useState(location.hash.slice(1))
  useEffect(() => {
    const onHashChange = () => setHashTag(location.hash.slice(1))
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])
  return hashtag
}
