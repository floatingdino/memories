/* eslint-disable import/no-cycle */
import { FC } from "react"
import { P } from "@/styles/Type"
import Input from "./Input"
import Select from "./Select"
import Textarea from "./Textarea"
import Checkbox from "./Checkbox"
import ImageField from "./Image"
import { AllFieldProps } from "./types/Form"
import RepeaterField from "./Repeater"

const FIELDS = {
  text: Input,
  textarea: Textarea,
  image: ImageField,
  select: Select,
  checkbox: Checkbox,
  repeater: RepeaterField,
}

export const Field: FC<Partial<AllFieldProps>> = ({
  type = "text",
  ...props
}) => {
  const FormField =
    typeof type === "function"
      ? type
      : FIELDS?.[type as keyof typeof FIELDS] || Input

  return (
    <label className="block" htmlFor={props.id}>
      {props.label && (
        <P as="span" className="mb-2 inline-block">
          {props.label}
        </P>
      )}

      <FormField {...(props as any)} type={type} />
    </label>
  )
}

export default Field
