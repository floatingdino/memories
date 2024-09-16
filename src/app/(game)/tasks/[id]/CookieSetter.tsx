"use client"

import { useEffect } from "react"

export default function CookieSetter({ id }: { id: string }) {
  useEffect(() => {
    fetch(`/tasks/${id}/lockin`)
  }, [])

  return null
}
