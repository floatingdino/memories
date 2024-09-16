import { ReactNode } from "react"
import { cookies } from "next/headers"
import { NavBar } from "../NavBar"
import { TASK_ID_COOKIE } from "./tasks/[id]/const"

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <div className="grow" />
      {cookies().has(TASK_ID_COOKIE) && (
        <NavBar task={cookies().get(TASK_ID_COOKIE)!.value} />
      )}
    </>
  )
}
