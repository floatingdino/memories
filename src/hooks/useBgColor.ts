import { useLayoutEffect } from "react"

export default function useBgColor(className: string) {
  useLayoutEffect(() => {
    document.documentElement.classList.add(className)
    return () => {
      document.documentElement.classList.remove(className)
    }
  }, [className])
}
