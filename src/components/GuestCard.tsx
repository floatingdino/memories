import { H3, H4, H5 } from "@/styles/Type"
import getImageUrl from "@/utils/getImageUrl"
import createStyle from "@josephmark/createstyle"
import Image from "next/image"
import { FC } from "react"

const CardEl = createStyle("article", "relative", {
  style: { aspectRatio: "1/1" },
})

export const GuestCard: FC<{ guest: any }> = ({ guest }) => {
  return (
    <CardEl>
      {guest.image && (
        <Image src={getImageUrl(guest.image)} alt="" fill sizes="50vw" />
      )}
      <div className="absolute bottom-0 bg-black/50 p-3 text-white">
        <H5 className="font-monospace">
          {guest.name} / {guest.costume}
        </H5>
      </div>
    </CardEl>
  )
}
