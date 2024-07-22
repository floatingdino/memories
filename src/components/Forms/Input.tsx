import { forwardRef, useId } from "react"

import type { InputProps } from "./types"
import { InputEl } from "./styles"

export const Input = forwardRef<HTMLElement, InputProps>(
  ({ name, className, ...props }, ref) => {
    const hash = useId()
    const id =
      props?.as === "div"
        ? undefined
        : props.id || [name, "input", hash].join("-")

    return (
      <InputEl id={id} name={name} ref={ref} className={className} {...props} />
    )
  }
)
export default Input
