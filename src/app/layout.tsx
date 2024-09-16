import type { Metadata } from "next"
import "@/styles/main.css"
import { cookies } from "next/headers"
import { TASK_ID_COOKIE } from "./tasks/[id]/const"
import Link from "next/link"
import { NavBar } from "./NavBar"

export const metadata: Metadata = {
  title: "Memories",
  description: "Write some nice memories for me",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {cookies().has(TASK_ID_COOKIE) && (
          <NavBar task={cookies().get(TASK_ID_COOKIE)!.value} />
        )}
      </body>
    </html>
  )
}
