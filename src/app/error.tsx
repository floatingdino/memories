"use client"

import Container from "@/components/Container"
import { H1 } from "@/styles/Type"
export default function Error({ error }: { error: Error }) {
  return (
    <>
      <Container>
        <H1 className="text-center">Error: {error.message || "Unknown error"}</H1>
      </Container>
    </>
  )
}
