import supabase from "@/utils/supabaseClient"
import SubmitTaskClient from "./client"

export enum ERROR_CODES {
  NO_TASK = "Submitting a guest requires a task",
  TASK_FILLED = "This task is already filled. Did you scan the wrong QR code?",
}

export default async function SubmitTask({ searchParams }) {
  console.log(searchParams)

  if (!searchParams.task) {
    throw new Error(ERROR_CODES.NO_TASK)
  }

  const { data } = await supabase.from("guests").select("id").eq("task", searchParams.task).maybeSingle()

  if (data) {
    throw new Error(ERROR_CODES.TASK_FILLED)
  }

  return <SubmitTaskClient />
}
