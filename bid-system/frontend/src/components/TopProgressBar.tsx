import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useIsFetching } from '@tanstack/react-query'

export default function TopProgressBar() {
  const location = useLocation()
  const isFetching = useIsFetching()
  const [navActive, setNavActive] = useState(false)

  useEffect(() => {
    setNavActive(true)
    const t = setTimeout(() => setNavActive(false), 600)
    return () => clearTimeout(t)
  }, [location.pathname, location.search])

  const active = navActive || isFetching > 0
  if (!active) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden">
      <div className="progress-bar-indeterminate" />
    </div>
  )
}
