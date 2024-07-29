import { FC } from "react"
import { Memory } from "@/types/Memory"
import createStyle from "@josephmark/createstyle"
import Image from "next/image"
import { H2, P } from "@/styles/Type"
import clsx from "clsx"
import Link from "next/link"
import getImageUrl from "@/utils/getImageUrl"

const CardEl = createStyle("article", "relative", { style: { aspectRatio: 1 } })

export const MemoryCard: FC<{ memory: Memory }> = ({
  memory: { id, file, memory, rememberer },
}) => (
  <CardEl>
    {file && <Image src={getImageUrl(file)} alt="" fill />}
    <div
      className={clsx(
        "absolute inset-0 flex flex-col justify-center gap-5 p-3",
        file && (memory || rememberer) && "bg-black/30 text-white"
      )}
    >
      {memory && (
        <H2
          as="blockquote"
          className="h-0 grow overflow-hidden overflow-ellipsis font-serif italic"
        >
          &ldquo;
          {memory}
          &rdquo;
        </H2>
      )}
      {rememberer && (
        <P as="cite" className="text-right font-monospace uppercase not-italic">
          &mdash; {rememberer}
        </P>
      )}
    </div>
    <Link className="absolute inset-0" href={`/memories/${id}`} passHref>
      <span className="sr-only">View memory</span>
    </Link>
  </CardEl>
)

export default MemoryCard
