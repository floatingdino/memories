import get from "lodash/get"
import { useLayoutEffect, useRef } from "react"

import useForm from "@/components/Forms/hooks/useForm"

export const useFieldValidity = (
  name: string,
  announceValidity: boolean = false
) => {
  const { validityState } = useForm()
  const ref = useRef<HTMLInputElement>(null)
  const shouldReport = useRef(false)
  useLayoutEffect(() => {
    if (!ref.current) {
      return () => {}
    }
    const validity = get(validityState, name, [])
    const isValid = validity.every((v) => !v)
    if (isValid) {
      return () => {}
    }
    const input = ref.current
    if (announceValidity) {
      input.setCustomValidity(
        validity.filter(Boolean).join("\n") || "Error with this input"
      )
      shouldReport.current = true
    }
    setTimeout(() => {
      if (shouldReport.current) {
        input.reportValidity()
      }
    }, 50)

    return () => {
      shouldReport.current = false
      input.setCustomValidity("")
    }
  }, [announceValidity, name, validityState])

  return ref
}

export default useFieldValidity
