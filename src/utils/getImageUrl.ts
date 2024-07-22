export default function getImageUrl(path: string) {
  return new URL(
    `storage/v1/object/public/${path}`,
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ).toString()
}
