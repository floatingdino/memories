"use client"

import Button from "@/components/Button"
import Container from "@/components/Container"
import { FormBGManager } from "@/components/FormBGManager"
import Field from "@/components/Forms"
import { FormContextProvider } from "@/components/Forms/context/FormContext"
import useForm from "@/components/Forms/hooks/useForm"
import get from "lodash/get"

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
    name: "task_points",
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
  const { formDefinition, isLoading, form, onChange } = useForm()

  return (
    <form className="flex flex-col gap-4 py-10">
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
      <FormContextProvider formDefinition={FORM_DEFINITION}>
        <Form />
      </FormContextProvider>
    </Container>
  )
}
