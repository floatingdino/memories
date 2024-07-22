"use client"


import Button from "@/components/Button"
import { useFormStatus } from "react-dom"

export const SubmitButton = () => {
  const {pending} = useFormStatus()

  return <Button as="button" type="submit" className="self-end" disabled={pending}>
    {pending ? "Sending..." : "Send it"}
    </Button>
 }

 export default SubmitButton
