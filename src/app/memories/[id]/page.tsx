import Container from "@/components/Container"
import { H2, P } from "@/styles/Type"
import getImageUrl from "@/utils/getImageUrl"
import supabase from "@/utils/supabaseClient"
import Image from "next/image"
import Link from "next/link"

export default async function MemoryPage({ params }: any) {
  const { id } = params
  const { data } = await supabase
    .from("memories")
    .select(
      `
      file,
      memory,
      rememberer,
      memory_type (
        name
      )`
    )
    .eq("id", id)
    .single()

  const { file, memory, rememberer, memory_type } = data! || {}

  return (
    <Container className="py-10">
      <P as="nav" className="mb-5">
        <Link href="/memories">&#9664; Memories</Link>
      </P>
      {file && <Image src={getImageUrl(file)} alt="" width="705" height="705" className="mb-10" />}
      <H2 as="blockquote" className="font-serif italic">
        &ldquo;{memory}&rdquo;
      </H2>
      <P as="cite" className="mt-5 block text-right font-monospace uppercase not-italic">
        &mdash; {rememberer}
      </P>

      {(memory_type as any)?.name && <P className="mt-10 font-monospace">Filed under: {(memory_type as any)?.name}</P>}
    </Container>
  )
}
