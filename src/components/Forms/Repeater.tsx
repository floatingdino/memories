/* eslint-disable import/no-cycle */
import createStyle from "@josephmark/createstyle"
import get from "lodash/get"
import { FC, Fragment, MouseEventHandler, useCallback } from "react"

import { Button } from "@/components/Button"
import useForm from "@/components/Forms/hooks/useForm"
import type { FieldProps, FormValue } from "@/components/Forms/types/Form"
import { getDefaultStateFromDefinition } from "@/components/Forms/utils/formUtils"

import Field from "."
import { P } from "@/styles/Type"

const RepeaterWrapper = createStyle("div", "flex flex-col gap-5")

type RepeaterValue = Record<string, FormValue>[]

export type RepeaterFieldProps = FieldProps<RepeaterValue> & {
  type: "repeater"
  recordName?: string
  maxRepeats?: number
  fields: FieldProps[]
}

export const RepeaterField: FC<RepeaterFieldProps> = ({
  maxRepeats = Infinity,
  name,
  value = [],
  recordName = "Record",
  label = `Add ${recordName}`,
  fields,
  type: _type,
  ...props
}) => {
  const { setForm } = useForm()

  const addNewRecord = useCallback(() => {
    setForm((f) => ({
      ...f,
      [name]: [...(f[name] as RepeaterValue), {}],
    }))
  }, [fields, name, setForm])

  const removeRecord = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      const { value: idx } = e.currentTarget
      setForm((f) => ({
        ...f,
        [name]: (f[name] as RepeaterValue).filter(
          (_, i) => i !== parseInt(idx, 10)
        ),
      }))
    },
    [name, setForm]
  )

  return (
    <div className="w-full">
      <div className="flex w-full gap-2">
        <div className="border-2 border-l border-dashed border-gray-300" />
        <RepeaterWrapper className="grow">
          {value.map((v, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <div className="flex gap-2 align-baseline">
                  <P as="h3">
                    {recordName} {i + 1}
                  </P>
                  <button
                    type="button"
                    value={i}
                    onClick={removeRecord}
                    className={P.classNames}
                  >
                    Remove &times;
                  </button>
                </div>
              )}
              {fields.map((field) => (
                <Field
                  key={field.name}
                  {...props}
                  {...field}
                  value={get(v, field.name)}
                  name={`${name}[${i}].${field.name}`}
                />
              ))}
            </Fragment>
          ))}
          {value.length < maxRepeats && (
            <Button
              as="button"
              type="button"
              theme="secondary"
              leadingIcon="plus"
              onClick={addNewRecord}
              style={{ alignSelf: "flex-start" }}
            >
              Add {recordName}
            </Button>
          )}
        </RepeaterWrapper>
      </div>
    </div>
  )
}
export default RepeaterField
