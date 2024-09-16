"use client"

import { useEffect } from "react"

export default function CookieSetter({ id }) {
  useEffect(() => {
    fetch(`/tasks/${id}/lockin`)
  }, [])

  return null
}
