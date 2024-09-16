import type { AllFieldProps, FormState } from "@/components/Forms/types/Form"

export const FIELD_DEFAULT_VALUE_MAP: FormState = {
  // checkbox: [],
  repeater: [],
  search: [],
}

/**
 * Generates a default state object for a form based on its definition
 * eg: An object with keys matching every field name and values matching the
 * default / appropriate empty value of the field.
 *
 * @param form The form definition.
 * @returns The default state for the form.
 */
export function getDefaultStateFromDefinition(
  form: AllFieldProps[]
): FormState {
  return Object.fromEntries(
    form.map(({ name, defaultValue = null, type = "text", ...props }) => {
      let value =
        defaultValue || FIELD_DEFAULT_VALUE_MAP?.[type as string] || ""
      if ("fields" in props) {
        value = [getDefaultStateFromDefinition(props.fields)]
      }
      return [name, value]
    })
  )
}
