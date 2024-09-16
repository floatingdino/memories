"use client"

import isEqual from "lodash/isEqual"
import merge from "lodash/merge"
import set from "lodash/set"
import {
  ChangeEventHandler,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react"

import {
  AllFieldProps,
  FieldProps,
  FormState,
  FormValue,
  ValidityState,
} from "@/components/Forms/types/Form"
import { getDefaultStateFromDefinition } from "@/components/Forms/utils/formUtils"
import {
  VALIDATOR_MAP,
  ValidatorFunction,
  validatorFactory,
} from "@/components/Forms/utils/validator"
import { useSearchParams } from "next/navigation"

export type FormContextValues = {
  form: FormState
  setForm: Dispatch<SetStateAction<FormState>>
  formDefinition: AllFieldProps[]
  setFormDefinition: Dispatch<SetStateAction<AllFieldProps[]>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  onChange: ChangeEventHandler<HTMLInputElement>
  validityState: ValidityState
  isDirty: boolean
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  defaultFormState: FormState
}

export const MultiPageFormContext = createContext<FormContextValues>({
  form: {},
  setForm: () => {},
  formDefinition: [],
  setFormDefinition: () => {},
  page: 0,
  setPage: () => {},
  onChange: () => {},
  validityState: {},
  isDirty: false,
  isLoading: false,
  setIsLoading: () => {},
  defaultFormState: {},
})

const BOOL = {
  true: true,
  false: false,
}

export const FormContextProvider: FC<{
  children: ReactNode
  formDefinition: AllFieldProps[]
  initialFormState?: FormState
}> = ({ children, formDefinition: _formDefinition, initialFormState = {} }) => {
  const params = useSearchParams()
  const [formDefinition, setFormDefinition] = useState(_formDefinition)

  const defaultFormState = useMemo(
    () =>
      merge(
        {},
        getDefaultStateFromDefinition(formDefinition),
        Array.from(params?.entries?.() || []).reduce((acc, [k, v]) => {
          if (v === "undefined" || v === "null") {
            return acc
          }
          return set(acc, k, v)
        }, {}),
        initialFormState
      ),
    [formDefinition, initialFormState, params]
  )

  const [form, setForm] = useState<FormState>(defaultFormState)

  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    const { name, value, type, files } = e.currentTarget
    setForm((prevForm) => {
      let newValue: FormValue = value

      switch (type) {
        case "checkbox": {
          // const oldValue = prevForm[name] as string[]
          newValue = (!BOOL[prevForm[name] as keyof typeof BOOL]).toString()
          // newValue = oldValue.includes(value) ? oldValue.filter((v) => v !== value) : [...oldValue, value]
          break
        }
        case "file":
          newValue = files!
          break
        default:
          break
      }

      // Using `set` here allows for the field name to encode a data path
      return set({ ...prevForm }, name, newValue)
    })
  }, [])

  // An object with each field's name as a key and its validity state as a value
  // Validity value is an array of booleans or strings (that might give more info about the error)
  const validityState = useMemo(() => {
    const fields = formDefinition
    return fields.reduce<ValidityState>((acc, field) => {
      // If the field has specified validators, use them, otherwise infer them from the field's props
      const validators: ValidatorFunction[] =
        field?.validators ||
        Object.entries(VALIDATOR_MAP)
          .filter(([k]) => !!field[k as keyof FieldProps])
          .map(([_k, v]) => v!)
      // The validator is passed into the validatorFactory here
      const fieldValidity = validators.map(validatorFactory(field, form))
      return {
        ...acc,
        [field.name!]:
          // Popping validity for repeaters reduces edge cases for fetching validity but means that the repeater cannot enforce its own validity (only its child fields' validity)
          field.type === "repeater"
            ? (fieldValidity.pop() as any)
            : fieldValidity,
      }
    }, {})
  }, [form, formDefinition])

  const isDirty = useMemo(
    () => !isEqual(form, defaultFormState),
    [defaultFormState, form]
  )

  const fields = useMemo(
    () => ({
      form,
      setForm,
      formDefinition,
      setFormDefinition,
      page,
      setPage,
      onChange,
      validityState,
      isDirty,
      isLoading,
      setIsLoading,
      defaultFormState,
    }),
    [
      form,
      formDefinition,
      page,
      onChange,
      validityState,
      isDirty,
      isLoading,
      defaultFormState,
    ]
  )

  return (
    <MultiPageFormContext.Provider value={fields}>
      {children}
    </MultiPageFormContext.Provider>
  )
}
export default MultiPageFormContext
