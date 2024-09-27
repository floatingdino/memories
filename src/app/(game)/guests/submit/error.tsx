"use client"

import Container from "@/components/Container"
import { H1 } from "@/styles/Type"
import { useSearchParams } from "next/navigation"
import Button from "@/components/Button"
import { ERROR_CODES } from "./errorCodes"

export default function Error({ error }: { error: Error }) {
  const searchParams = useSearchParams()
  return (
    <>
      <div className="grow" />
      <Container>
        <H1 className="text-center">{error.message || "Unknown error"}</H1>
        {error.message === ERROR_CODES.TASK_FILLED && (
          <div className="mt-5 flex justify-center">
            <Button href={`/tasks/${searchParams.get("task")}`}>Show my task</Button>
          </div>
        )}
      </Container>
    </>
  )
}
