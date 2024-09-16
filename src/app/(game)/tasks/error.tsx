"use client"

import Container from "@/components/Container"
import { H1 } from "@/styles/Type"

const ERROR_MESSAGES: Record<string, string> = {
  "Not your task": "No peeking! 😉",
}

export default function Error({ error }: { error: Error }) {
  return (
    <>
      <div className="grow" />
      <Container>
        <H1 className="text-center">
          {ERROR_MESSAGES[error.message] || error.message || "Unknown error"}
        </H1>
      </Container>
    </>
  )
}
