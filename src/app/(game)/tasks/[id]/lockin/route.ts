import { cookies } from "next/headers"
import { TASK_ID_COOKIE } from "../const"

export async function GET(request: Request, { params }) {
  const newCookies = cookies().set(TASK_ID_COOKIE, params.id)

  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": newCookies.toString(),
    },
  })
}
