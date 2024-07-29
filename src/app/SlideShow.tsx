"use client"

import FeatureMemoryCard from "@/components/FeatureMemoryCard"
import { Memory } from "@/types/Memory"
import supabase from "@/utils/supabaseClient"
import clsx from "clsx"
import { useLayoutEffect, useState } from "react"
import useSWR from "swr"

const SLIDE_DURATION = 15_000

export default function Slideshow() {
  const { data, mutate } = useSWR<any>("memories", (table: string) =>
    supabase
      .from(table)
      .select("*")
      .returns<any>()
      .then(({ data }) => data)
  )

  const [currentOffset, setCurrentOffset] = useState(0)

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

  useLayoutEffect(() => {
    const channel = supabase
      .channel("memories")
      .on("postgres_changes", { event: "INSERT", schema: "public" }, () => {
        mutate()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <>
      {data?.map((mem: Memory, idx: number) => (
        <FeatureMemoryCard
          {...mem}
          key={mem.id}
          className={clsx(
            idx !== currentOffset && "pointer-events-none invisible opacity-0",
            "transition-[opacity,visibility] duration-500"
          )}
        />
      ))}
    </>
  )
}
