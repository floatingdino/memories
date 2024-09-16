import type { AllFieldProps, FieldProps, FormState, FormValue, RepeaterFormValue } from "@/form/types/Form"
import { s } from "@/utils/i18n"
import get from "lodash/get"
import { InputHTMLAttributes } from "react"

export type ValidatorValue = boolean | string | Record<string, ValidatorValue[]>[]

export type ValidatorParams<T = Record<string, any>> = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "type"> &
  T & { value: FormValue }

export type ValidatorFunction<T = Record<string, any>> = (args: ValidatorParams<T>) => ValidatorValue

type ValidatorMap<K extends string = string> = Record<K, ValidatorFunction>

const FileTypes = {
  pdf: ["application/pdf"],
  image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  video: ["video/mp4", "video/mpeg"],
  audio: ["audio/mpeg", "audio/wav", "audio/x-wav"],
}

type ValidatorInput = AllFieldProps

export const validatorFactory = (field: ValidatorInput, form: FormState) => (validator: ValidatorFunction) => {
  const value = get(form, field.name!)
  const validatorPassed = validator({
    ...field!,
    value,
  })

  return validatorPassed
}

/**
 * A validator is a function that accepts a field props and returns a string
 * describing why the validation has **failed** or false if the validation has passed.
 *
 * This might be backwards to what you expect, but it's because we want the validator
 * to return a string describing the error (which evaluates to true in boolean context)
 *
 * This is a collection of default validators that can be used in the `validators` prop,
 * however you can always write a custom validator for a field-specific validation.
 */
export const Validator: ValidatorMap = {
  required({ value = "" }) {
    return (Array.isArray(value) ? value.length <= 0 : !value) && s`Please fill in this field`
  },
  minLength({ value, minLength = 0 }) {
    return (
      value &&
      value.length < minLength &&
      s`Please lengthen this text to ${minLength} characters or more (you are currently using ${
        value.length
      } ${value.length === 1 ? s`character` : s`characters`})`
    )
  },
  maxLength({ value, maxLength = Infinity }) {
    return (
      value &&
      value.length > maxLength &&
      s`Please shorten this text to ${maxLength} characters or less (you are currently using ${
        value.length
      } ${value.length === 1 ? s`character` : s`characters`})`
    )
  },
  // File type
  validFileType({ value, accept: _accept }) {
    if (value && !(value instanceof FileList)) {
      return false
    }
    const files = Array.from(value as FileList)

    const accept =
      _accept! in Object.keys(FileTypes) ? FileTypes[_accept as keyof typeof FileTypes] : _accept!.split(",")

    // Loop over files and ensure all files are of valid type
    return !Object.values(files).every((file) => accept.indexOf(file.type) > -1) && s`File type must be ${_accept}`
  },
  // Probably worth making a custom pattern validator just for the sake of
  // having a meaningful error message
  pattern({ value, pattern }) {
    return !(value && new RegExp(pattern!).test(value as string)) && s`Please match the format requested`
  },
  fileSize: ({ value, maxLength = Infinity }) => {
    // Expects input in MBs
    const bytes = maxLength * 1024 * 1024
    const files = Array.from(value as FileList)

    return Object.values(files).some((file) => file.size > bytes) && s`File size must be less than ${maxLength}MB`
  },
  repeater({ value: _value, fields: _fields }) {
    const value = _value as RepeaterFormValue
    const fields = _fields as FieldProps[]
    return value!.map((v) => {
      return Object.fromEntries(
        fields!.map((field) => {
          const validators =
            field.validators ||
            Object.entries(Validator)
              .filter(([k]) => !!field[k as keyof FieldProps])
              .map(([_k, vf]) => vf)

          return [field.name, validators.map((vf) => validatorFactory(field, v)(vf))]
        })
      )
    })
  },
  email({ value }) {
    return value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string) && s`Please enter a valid email address`
  },
  max({ value, max = Infinity }) {
    return value && value > max && s`Please enter a value less than or equal to ${max}`
  },
  min({ value, min = -Infinity }) {
    return value && value < min && s`Please enter a value greater than or equal to ${min}`
  },
} as const

export const VALIDATOR_MAP: Partial<
  Record<string, ValidatorFunction>
  // Record<keyof AllFieldProps, ValidatorFunction>
> = {
  required: Validator.required,
  minLength: Validator.minLength,
  maxLength: Validator.maxLength,
  max: Validator.max,
  min: Validator.min,
  accept: Validator.validFileType,
  pattern: Validator.pattern,
  fields: Validator.repeater,
}

export default Validator
