import ChevronDownIcon from "@/icons/ChevronDown"
import clsx from "clsx"
import { InputEl } from "./styles"
import { SelectProps } from "./types/Form"

export const Select = ({
  className,
  children,
  placeholder,
  ...props
}: SelectProps) => {
  return (
    <div className={clsx(className, "bg-paper-white relative flex")}>
      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 lg:right-5" />
      <InputEl as="select" {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {"options" in props &&
          props.options?.map(({ label: optionLabel, ...optionProps }) => (
            <option key={optionProps.value} {...optionProps}>
              {optionLabel}
            </option>
          ))}
        {children}
      </InputEl>
    </div>
  )
}
export default Select
