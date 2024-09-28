import supabase from "@/utils/supabaseClient"
import { redirect } from "next/navigation"
import SubmitTaskClient from "./client"
import { ERROR_CODES } from "./errorCodes"

export default async function SubmitTask({ searchParams }) {
  console.log(searchParams)

  if (!searchParams.task) {
    throw new Error(ERROR_CODES.NO_TASK)
  }

  const { data } = await supabase.from("guests").select("id").eq("task", Number(searchParams.task)).maybeSingle()

  console.log(data)

  if (data) {
    redirect(`/tasks/${searchParams.task}`)
  }

  return <SubmitTaskClient />
}
