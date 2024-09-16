import clsx from "clsx"

import createStyle from "@josephmark/createstyle"

export const Label = createStyle(
  "label",
  clsx("text-[0.875rem] font-semibold tracking-[0.01em]")
)

export const InputEl = createStyle(
  "input",
  clsx(
    "peer block",
    "w-full p-4",
    "rounded-md bg-white text-black",
    "text-[1rem] leading-[1.25]",
    "placeholder-black placeholder-opacity-50",
    "appearance-none text-left"
  )
)
