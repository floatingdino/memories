"use client"

import Button from "@/components/Button"
import Container from "@/components/Container"
import { FormBGManager } from "@/components/FormBGManager"
import Field from "@/components/Forms"
import { FormContextProvider } from "@/components/Forms/context/FormContext"
import useForm from "@/components/Forms/hooks/useForm"
import { H1 } from "@/styles/Type"
import supabase from "@/utils/supabaseClient"
import get from "lodash/get"
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
  const { formDefinition, setIsLoading, isLoading, form, onChange } = useForm()

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const goals: any[] = await Promise.all(
        (form.goals as any[]).map((goal) => {
          return supabase.from("goals").insert(goal)
        })
      )
      const task = await supabase.from("tasks").insert({
        ...form,
        goals: goals.map(({ data }) => data?.id),
      })
      console.log(task)
    } catch (e) {
      console.error(e)
    }

    setIsLoading(false)
  }, [])

  return (
    <form className="flex flex-col gap-4 py-10" onSubmit={onSubmit}>
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
