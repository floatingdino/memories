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
import { useRef } from "react"

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
  const wrapperRef = useRef<HTMLElement>(null)
  const { setForm } = useForm()

  const addNewRecord = useCallback(() => {
    setForm((f) => {
      const newValue = [...(f[name] as RepeaterValue), {}]
      const inputs =
        wrapperRef.current?.querySelectorAll<HTMLElement>("input, textarea")
      const target = inputs?.[(newValue.length - 1) * fields.length + 1]
      target?.focus?.()
      return {
        ...f,
        [name]: newValue,
      }
    })
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
        <RepeaterWrapper className="grow" ref={wrapperRef}>
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
