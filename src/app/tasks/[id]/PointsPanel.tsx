"use client"

import { Spinner } from "@/components/Forms/Spinner"
import { H4, H5 } from "@/styles/Type"
import { Goal } from "@/types/Goal"
import supabase from "@/utils/supabaseClient"
import { useCallback } from "react"
import { useEffect } from "react"
import { FC } from "react"
import { useState } from "react"

export const PointsPanel: FC<{ goals: Goal[] }> = ({ goals }) => {
  const [completions, setCompletions] = useState(
    Object.fromEntries(goals.map((goal) => [goal.id, goal.completions]))
  )

  const currentPoints = Object.entries(completions).reduce(
    (acc, [goal, completions]) =>
      acc + goals.find((g) => g.id === parseInt(goal))!.points * completions,
    0
  )

  const onChange = useCallback(
    (id: number) => (value: number) => {
      setCompletions((prev) => ({ ...prev, [id]: value }))
    },
    []
  )

  useEffect(() => {
    const timeout = setTimeout(
      () =>
        Object.entries(completions).forEach(([goal, completions]) => {
          supabase
            .from("goals")
            .update({ completions })
            .eq("id", goal)
            .then(console.log)
        }),
      1500
    )

    return () => clearTimeout(timeout)
  }, [completions])

  return (
    <>
      <H5 className="mb-2 flex justify-between text-gray-800">
        Current Points: <strong>{currentPoints}</strong>
      </H5>
      <div className="rounded-md bg-white px-3">
        {goals.map((goal) => (
          <div className="group pt-4" key={goal.id}>
            <div className="-mb-3 -mr-2 -mt-3 flex items-center">
              <H5>{goal.description}</H5>
              <div className="grow" />
              <H5 as="div">&times;</H5>
              <Spinner
                value={completions[goal.id]}
                onChange={onChange(goal.id)}
                className="ml-1 rounded bg-gray-100 px-3 py-4"
              />
            </div>
            <hr className="-mr-3 mt-4 border-gray-300 group-last:border-transparent" />
          </div>
        ))}
      </div>
    </>
  )
}
