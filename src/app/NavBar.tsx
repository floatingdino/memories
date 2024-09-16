"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const NavBar = ({ task }) => {
  const pathname = usePathname()
  return (
    <nav className="sticky bottom-0 left-0 flex w-full gap-1 border-t border-gray-300 bg-white p-1 dark:border-gray-800 dark:bg-black">
      <Link
        href={`/tasks/${task}`}
        className={clsx(
          "flex-1 rounded py-2 text-center",
          pathname === `/tasks/${task}` && "bg-gray-100 dark:bg-gray-900"
        )}
      >
        📋
        <span className="sr-only">My task</span>
      </Link>
      <Link
        href="/guests"
        className={clsx(
          "flex-1 rounded py-2 text-center",
          pathname === `/guests` && "bg-gray-100 dark:bg-gray-900"
        )}
      >
        📒
        <span className="sr-only">Guest compendium</span>
      </Link>
    </nav>
  )
}
