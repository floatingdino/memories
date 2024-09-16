import Container from "@/components/Container"
import { FormBGManager } from "@/components/FormBGManager"
import { Spinner } from "@/components/Forms/Spinner"
import { H1, H2, H3, H4, H5, P } from "@/styles/Type"
import supabase from "@/utils/supabaseClient"
import createStyle from "@josephmark/createstyle"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { PointsPanel } from "./PointsPanel"
import { TASK_ID_COOKIE } from "./const"
import CookieSetter from "./CookieSetter"
import { TaskPanel } from "./TaskPanel"

export default async function TaskHome({ params }) {
  const { id } = params
  if (
    cookies().has(TASK_ID_COOKIE) &&
    cookies().get(TASK_ID_COOKIE)?.value != id
  ) {
    throw new Error("Not your task")
  }
  const { data: tasks } = await supabase
    .from("tasks")
    .select(
      `
    name,
    description,
    goals (
      id,
      description,
      points,
      completions
    )`
    )
    .eq("id", id)
  const [task] = tasks || []

  if (!task) {
    notFound()
  }

  const [{ data: allTasks }, { data: allGuests }] = await Promise.all([
    supabase.from("tasks").select("id, name"),
    supabase.from("guests").select("id, name, costume"),
  ])

  return (
    <Container className="py-10">
      <FormBGManager />
      {!cookies().has(TASK_ID_COOKIE) && <CookieSetter id={id} />}
      <H1 className="mb-5">{task.name}</H1>
      <H5 className="mb-2 text-gray-800">Goal:</H5>
      <div className="mb-5 rounded-md bg-white px-3 py-2">
        <P>{task.description}</P>
      </div>
      <PointsPanel goals={task.goals.sort((a, b) => a.id - b.id)} />

      <TaskPanel id={id} tasks={allTasks} guests={allGuests} />
    </Container>
  )
}
