import supabase from "@/utils/supabaseClient"
import dynamic from "next/dynamic"
// import PrintClient from "./client"
import qrc from "qrcode"

// const WEB_ROOT = process.env.NEXT_PUBLIC_VERCEL_URL
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
//   : "http://localhost:3000"

const WEB_ROOT = "memories.samhaakman.com"

const PrintClient = dynamic(() => import("./client"), { ssr: false })

export default async function Print() {
  const [{ data: _tasks }, { data: prizes }] = await Promise.all([
    supabase.from("tasks").select(`
    id,
    name,
    description,
    non_player_task,
    goals (
      id,
      description,
      points
    )
  `),
    supabase.from("prizes").select(`id, name, description`),
  ])

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

  return <PrintClient prizes={prizes!} tasks={tasks as any[]} />
}
