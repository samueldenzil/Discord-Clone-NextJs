import { useEffect, useState } from 'react'

export default function UseOrigin() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const origin =
    typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

  if (!mounted) {
    return null
  }

  return origin
}
