import Container from "@/components/Container"
import { H1, P } from "@/styles/Type"
import supabase from "@/utils/supabaseClient"

export default async function TaskList() {
  const { data: tasks } = await supabase.from("tasks").select(`id, name`)

  return (
    <Container className="pt-10">
      <H1 className="mb-5">Task List</H1>
      <P as="ol" className="list-decimal pb-5 pl-7">
        {tasks?.map((task) => <li key={task.name}>{task.name}</li>)}
      </P>
    </Container>
  )
}
