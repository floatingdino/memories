"use client"

import Button from "@/components/Button"
import Container from "@/components/Container"
import { FormBGManager } from "@/components/FormBGManager"
import Field from "@/components/Forms"
import { FormContextProvider } from "@/components/Forms/context/FormContext"
import useForm from "@/components/Forms/hooks/useForm"
import { H1 } from "@/styles/Type"
import generateUID from "@/utils/generateUID"
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
    name: "costume",
    label: "Costume",
    required,
  },
  {
    name: "image",
    label: "Image",
    type: "image",
  },
]

const Form = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const { formDefinition, setIsLoading, isLoading, form, setForm, onChange } = useForm()
  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault()
      setIsLoading(true)
      try {
        const { image, ...payload } = form

        if (image) {
          const [{ data: imageData }] = await Promise.all(
            Array.from(image as FileList).map((file) =>
              supabase.storage.from("memories").upload(`guests/${generateUID()}${file.name}`, file, {
                cacheControl: "38400",
              })
            )
          )
          payload.image = imageData?.fullPath || ""
        }

        await supabase.from("guests").insert(payload).select("id")

        window.close()
      } catch (e) {
        console.error(e)
      }

      setIsLoading(false)
    },
    [form, setForm, formDefinition, setIsLoading]
  )

  return (
    <form className="flex flex-col gap-4 py-10" onSubmit={onSubmit} ref={formRef}>
      {formDefinition.map((field) => (
        <Field key={field.name} value={get(form, field.name)} onChange={onChange} {...field} />
      ))}
      <Button type="submit" as="button" className="self-end" disabled={isLoading}>
        Submit
      </Button>
    </form>
  )
}

export default function SubmitTaskClient() {
  return (
    <Container>
      <FormBGManager />
      <H1 className="mt-10">Add a guest</H1>
      <FormContextProvider formDefinition={FORM_DEFINITION}>
        <Form />
      </FormContextProvider>
    </Container>
  )
}
