import Container from "@/components/Container"
import { FormBGManager } from "@/components/FormBGManager"
import Field from "@/components/Forms"
import { supabase } from "@/utils/supabaseClient"
import generateUID from "@/utils/generateUID"
import { Suspense } from "react"

import SubmitButton from "./Button"
import { redirect } from "next/navigation"

const MemoryType = async () => {
  const memoryTypes = await supabase.from("memory_types").select("*")

  return (
    <Field
      type="select"
      label="What sort of memory is it?"
      options={[
        { value: "", label: "Choose one" },
        ...memoryTypes.data?.map(({ id, name }) => ({
          value: id,
          label: name,
        }))!,
      ]}
    />
  )
}

export default function SubmitMemory() {
  async function action(formData: FormData) {
    "use server"

    const { file, ...payload } = Object.fromEntries(formData.entries())

    if ((file as File).size > 0) {
      const { data } = await supabase.storage
        .from("memories")
        .upload(`memories/${generateUID()}${(file as File).name}`, file as File, { cacheControl: "38400" })
      payload.file = data?.fullPath || ""
    }

    const resp = await supabase.from("memories").insert(payload).select(`id`)

    console.log(resp)

    if (resp.error) {
      throw new Error(resp.error.message)
    }

    redirect(`/memories/${(resp.data?.[0] as any).id}`)

    // return new FormData()
  }

  return (
    <Container>
      <FormBGManager />
      <form className="flex flex-col gap-4 py-10" action={action}>
        <Suspense fallback={<Field type="select" name="memory_type" label="What sort of memory is it?" />}>
          <MemoryType />
        </Suspense>
        <Field type="image" name="file" label="Add an image, if you like" />
        <Field type="textarea" name="memory" label="What do you remember?" rows={10} />
        <Field name="rememberer" label="What's your name?" />
        <SubmitButton />
      </form>
    </Container>
  )
}
