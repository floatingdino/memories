import supabase from "@/utils/supabaseClient"
import { MemoryCard } from "@/components/MemoryCard"
import { Memory } from "@/types/Memory"
import clsx from "clsx"
import { P } from "@/styles/Type"
import Link from "next/link"

export const revalidate = 10

export default async function MemoriesPage() {
  const { data } = await supabase
    .from("memories")
    .select("*")
    .limit(20)
    .returns<Memory[]>()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data?.map((memory) => <MemoryCard key={memory.id} memory={memory} />)}
      <Link
        className={clsx(
          "flex items-center justify-center bg-primary-500 p-3 text-center font-semibold text-white",
          P.toString()
        )}
        style={{ aspectRatio: 1 }}
        href="/submit"
      >
        + Add another memory
      </Link>
    </div>
  )
}
