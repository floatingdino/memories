"use client"

import Container from "@/components/Container"
import { H1 } from "@/styles/Type"
export default function Error({ error }: { error: Error }) {
  return (
    <>
      <div className="grow" />
      <Container>
        <H1 className="text-center">{error.message || "Unknown error"}</H1>
      </Container>
    </>
  )
}
