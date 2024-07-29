import { H2, P } from "@/styles/Type"
import { Memory } from "@/types/Memory"
import getImageUrl from "@/utils/getImageUrl"
import clsx from "clsx"
import Image from "next/image"
import { FC, HTMLAttributes } from "react"

export const FeatureMemoryCard: FC<
  Omit<HTMLAttributes<HTMLDivElement>, keyof Memory> & Memory
> = ({
  className,
  file,
  memory,
  rememberer,
  id: _id,
  created_at: _created_at,
  memory_type: _memory_type,
  ...props
}) => {
  return (
    <figure
      className={clsx("absolute inset-0 h-full w-full", className)}
      {...props}
    >
      {!!file && (
        <Image src={getImageUrl(file)} alt="" className="object-cover" fill />
      )}
      {memory && (
        <figcaption
          className={clsx(
            "absolute bottom-0 left-0 flex w-full px-6 py-10",
            file
              ? "bg-gradient-to-t from-black/80"
              : "h-full bg-black/80 text-center",
            "text-white"
          )}
        >
          <div className="flex grow flex-col justify-center">
            <H2 as="p" className="font-serif italic">
              &ldquo;{memory}&rdquo;
            </H2>
            {rememberer && (
              <P as="cite" className="font-monospace uppercase not-italic">
                &mdash; {rememberer}
              </P>
            )}
          </div>
          {!!file && (
            <div style={{ width: 300, height: 1 }} className="shrink-0" />
          )}
        </figcaption>
      )}
    </figure>
  )
}
export default FeatureMemoryCard
