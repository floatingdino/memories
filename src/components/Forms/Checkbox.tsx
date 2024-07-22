import { FC, InputHTMLAttributes } from "react"

import CheckmarkIcon from "@/icons/Checkmark"
import clsx from "clsx"

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>
export const Checkbox: FC<CheckboxProps> = ({ className, ...props }) => {
  return (
    <div className={clsx("flex", className)}>
      <div className="relative">
        <input
          type="checkbox"
          className={clsx(
            "rounded border border-gray-300 bg-white peer checked:bg-primary-400 checked:border-primary-400 w-6 h-6 block appearance-none"
          )}
          {...props}
        />
        <CheckmarkIcon
          className="absolute pointer-events-none text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 peer-checked:scale-100 scale-0 transition duration-200"
          width="12"
          height="12"
        />
      </div>
    </div>
  )
}
export default Checkbox
