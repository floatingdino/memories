/* eslint-disable import/no-cycle */
import dynamic from "next/dynamic"
import { FC } from "react"
import { P } from "@/styles/Type"
import Input from "./Input"
import Select from "./Select"
import { AnyField } from "./types"
import Textarea from "./Textarea"
import Checkbox from "./Checkbox"
import ImageField from "./Image"

const FIELDS = {
  text: Input,
  textarea: Textarea,
  image: ImageField,
  select: Select,
  checkbox: Checkbox,
}

export const Field: FC<Partial<AnyField>> = ({ type = "text", ...props }) => {
  const FormField = FIELDS?.[type as keyof typeof FIELDS] || Input

  return (
    <label className="block" htmlFor={props.id}>
      {props.label && (
        <P as="span" className="inline-block mb-2">
          {props.label}
        </P>
      )}

      <FormField {...(props as any)} type={type} />
    </label>
  )
}

export default Field
