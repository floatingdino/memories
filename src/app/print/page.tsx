import supabase from "@/utils/supabaseClient"
import PrintClient from "./client"
import qrc from "qrcode"

// const WEB_ROOT = process.env.NEXT_PUBLIC_VERCEL_URL
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//   : "http://localhost:3000"

const WEB_ROOT = "memories.samhaakman.com"

export default async function Print() {
  const { data: _tasks } = await supabase.from("tasks").select(`
    id,
    name,
    description,
    goals (
      id,
      description,
      points
    )
  `)

  const tasks = await Promise.all(
    _tasks!.map(async (task: any) => {
      const playerCode = await qrc.toDataURL(`https://${WEB_ROOT}/tasks/${task.id}`)
      const setupCode = await qrc.toDataURL(`https://${WEB_ROOT}/guests/submit?task=${task.id}`)

      return {
        ...task,
        playerCode,
        setupCode,
      }
    })
  )

  return <PrintClient tasks={tasks as any[]} />
}
