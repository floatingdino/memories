import { forwardRef, useId } from "react"

import type { TextareaFieldProps } from "./types/Form"
import { InputEl } from "./styles"

export const Textarea = forwardRef<HTMLElement, TextareaFieldProps>(
  ({ name, className, ...props }, ref) => {
    const hash = useId()
    const id =
      props?.as === "div"
        ? undefined
        : props.id || [name, "input", hash].join("-")

    return (
      <InputEl
        as="textarea"
        id={id}
        name={name}
        ref={ref}
        className={className}
        {...(props)}
      />
    )
  }
)
export default Textarea
