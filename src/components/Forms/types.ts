import {
  ReactNode,
  OptionHTMLAttributes,
  InputHTMLAttributes,
} from "react"

import { CustomTagArgs } from "@josephmark/createstyle"

export type InputProps = {
  label: string
  name: string
} & Omit<
  CustomTagArgs<HTMLInputElement>,
  keyof InputHTMLAttributes<HTMLInputElement>
> &
  InputHTMLAttributes<HTMLInputElement>

export type ImageFieldProps = InputProps & {type: "image"}

export type SelectProps = {
  label?: string
  type: "select"
} & InputHTMLAttributes<HTMLInputElement> &
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


export type AnyField = InputProps | SelectProps | ImageFieldProps
