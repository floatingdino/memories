"use client"

import Button from "@/components/Button"
import Container from "@/components/Container"
import { FormBGManager } from "@/components/FormBGManager"
import Field from "@/components/Forms"
import { FormContextProvider } from "@/components/Forms/context/FormContext"
import useForm from "@/components/Forms/hooks/useForm"
import { getDefaultStateFromDefinition } from "@/components/Forms/utils/formUtils"
import { H1 } from "@/styles/Type"
import supabase from "@/utils/supabaseClient"
import get from "lodash/get"
import { useRef } from "react"
import { useCallback, FormEventHandler } from "react"

const required = true

const FORM_DEFINITION = [
  {
    name: "name",
    label: "Name",
    required,
  },
  {
    name: "description",
    label: "Task",
    required,
    type: "textarea",
  },
  {
    name: "goals",
    type: "repeater",
    label: "Goals",
    recordName: "Goal",
    fields: [
      {
        name: "description",
        label: "Description",
        type: "textarea",
      },
      {
        name: "points",
        label: "Points",
        type: "number",
      },
    ],
  },
]

const Form = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const { formDefinition, setIsLoading, isLoading, form, setForm, onChange } =
    useForm()
  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault()
      setIsLoading(true)
      console.log(form)
      try {
        const { goals: _goals, ...payload } = form
        const task = await supabase.from("tasks").insert(payload).select("id")
        await Promise.all(
          (_goals as any[]).map((goal) => {
            return supabase
              .from("goals")
              .insert({ ...goal, task: task?.data?.[0].id })
              .select("id")
          })
        )
        setForm(getDefaultStateFromDefinition(formDefinition))
        formRef.current!.querySelector("input")!.focus()
      } catch (e) {
        console.error(e)
      }

      setIsLoading(false)
    },
    [form, setForm, formDefinition, setIsLoading]
  )

  return (
    <form
      className="flex flex-col gap-4 py-10"
      onSubmit={onSubmit}
      ref={formRef}
    >
      {formDefinition.map((field) => (
        <Field
          key={field.name}
          value={get(form, field.name)}
          onChange={onChange}
          {...field}
        />
      ))}
      <Button
        type="submit"
        as="button"
        className="self-end"
        disabled={isLoading}
      >
        Submit
      </Button>
    </form>
  )
}

export default function SubmitTask() {
  return (
    <Container>
      <FormBGManager />
      <H1 className="mt-10">Add a task</H1>
      <FormContextProvider formDefinition={FORM_DEFINITION}>
        <Form />
      </FormContextProvider>
    </Container>
  )
}
