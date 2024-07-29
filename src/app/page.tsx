"use client"

import FeatureMemoryCard from "@/components/FeatureMemoryCard"
import { Memory } from "@/types/Memory"
import supabase from "@/utils/supabaseClient"
import clsx from "clsx"
import { useLayoutEffect, useState } from "react"
import useSWR from "swr"

const SLIDE_DURATION = 15_000

export default function Home() {
  const { data } = useSWR<any>("memories", (table: string) =>
    supabase
      .from(table)
      .select("*")
      .returns<any>()
      .then(({ data }) => data)
  )

  const [currentOffset, setCurrentOffset] = useState(2)

  useLayoutEffect(() => {
    if (!data) {
      return
    }
    const interval = setInterval(() => {
      setCurrentOffset((currentOffset) => (currentOffset + 1) % data.length)
    }, SLIDE_DURATION)

    return () => {
      clearInterval(interval)
    }
  }, [currentOffset, data])

  return (
    <main className="relative h-screen w-full bg-black">
      {data?.map((mem: Memory, idx: number) => (
        <FeatureMemoryCard
          {...mem}
          key={mem.id}
          className={clsx(
            idx !== currentOffset && "opacity-0",
            "transition duration-500"
          )}
        />
      ))}
    </main>
  )
}
