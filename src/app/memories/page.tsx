import supabase from "@/utils/supabaseClient"
import { MemoryCard } from "@/components/MemoryCard"
import { Memory } from "@/types/Memory"
import Button from "@/components/Button"

export const revalidate = 0

const PAGE_SIZE = 20

export default async function MemoriesPage({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const page = searchParams.page || "1"
  const { data, count } = await supabase
    .from("memories")
    .select("*", { count: "estimated" })
    .range((parseInt(page) - 1) * PAGE_SIZE, parseInt(page) * PAGE_SIZE - 1)
    .returns<Memory[]>()

  const hasPrevPage = parseInt(page) > 1
  const hasNextPage = count! > parseInt(page) * PAGE_SIZE

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data?.map((memory) => <MemoryCard key={memory.id} memory={memory} />)}
      <div className="fixed bottom-4 left-0 mx-2 flex w-full justify-center gap-2">
        <Button
          disabled={!hasPrevPage}
          as={hasPrevPage ? "a" : "button"}
          href={
            hasPrevPage ? `/memories?page=${parseInt(page) - 1}` : undefined
          }
        >
          &#9664;
          <span className="sr-only">Previous Page</span>
        </Button>
        <Button>+ Add another memory</Button>
        <Button
          disabled={!hasNextPage}
          as={hasNextPage ? "a" : "button"}
          href={
            hasNextPage ? `/memories?page=${parseInt(page) + 1}` : undefined
          }
        >
          &#9654;
          <span className="sr-only">Next Page</span>
        </Button>
      </div>
    </div>
  )
}
