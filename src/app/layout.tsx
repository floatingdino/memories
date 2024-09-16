import type { Metadata } from "next"
import "@/styles/main.css"
import { cookies } from "next/headers"
import { TASK_ID_COOKIE } from "./(game)/tasks/[id]/const"
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
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  )
}
