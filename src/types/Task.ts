import { Goal } from "./Goal"

export type Task = {
  id: number
  created_at: string
  name: string
  description: string
  goals: Goal[]
}
