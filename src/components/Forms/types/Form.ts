import type {
  FC,
  InputHTMLAttributes,
  OptionHTMLAttributes,
  ReactNode,
} from "react"

import type { ButtonProps } from "@/components/Button"
import type { RepeaterFieldProps } from "@/components/Forms/Repeater"
import type {
  ValidatorFunction,
  ValidatorValue,
} from "@/components/Forms/utils/validator"
import { CustomTagArgs } from "@josephmark/createstyle"

export type FormValue =
  | string
  | string[]
  | FileList
  | Record<string, FormValue>[]

export type RepeaterFormValue = Record<string, FormValue>[]

export type FieldProps<
  T = FormValue,
  EL = CustomTagArgs<HTMLInputElement>,
> = Omit<EL, "value" | "type"> & {
  name: string
  label?: ReactNode
  defaultValue?: string | string[]
  value?: T
  validators?: ValidatorFunction[]
  type?: InputHTMLAttributes<HTMLInputElement>["type"]
}
export type ImageFieldProps = FieldProps<FileList> & { type: "image" }
export type TextareaFieldProps = FieldProps<string> & {
  type: "textarea"
  rows?: number
}

export type SelectProps = {
  label?: string
  type: "select"
} & FieldProps<string> &
  (
    | {
        label: string
        options: ({
          label: string
          value: string
        } & OptionHTMLAttributes<HTMLOptionElement>)[]
      }
    | { children: ReactNode }
  )

export type CustomFieldProps<T = Record<string, any>> = Omit<
  FieldProps,
  "type"
> & {
  type: FC<FieldProps>
} & T

export type AllFieldProps =
  | FieldProps
  | ImageFieldProps
  | RepeaterFieldProps
  | SelectProps
  | TextareaFieldProps
  | CustomFieldProps

export type ValidityState = Record<string, ValidatorValue[]>

export type FormState = Record<string, FormValue>
