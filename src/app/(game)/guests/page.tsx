import { GuestCard } from "@/components/GuestCard"
import supabase from "@/utils/supabaseClient"

export default async function GuestList() {
  const { data: guests } = await supabase
    .from("guests")
    .select("id, name, costume, image")
    .order("name")
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {guests?.map((guest) => <GuestCard key={guest.id} guest={guest} />)}
    </div>
  )
}
