"use client"

import { H5 } from "@/styles/Type"
import { GroupPanel } from "../GroupPanel"
import { Spinner } from "@/components/Forms/Spinner"
import { useEffect, useState, useCallback } from "react"
import supabase from "@/utils/supabaseClient"

export const TaskPanel = ({ id, tasks, guests, guesses: _guesses }) => {
  const [guesses, setGuesses] = useState(_guesses.guesses)

  const onChange = useCallback(
    (id: number) => (value: string) => {
      setGuesses((prev) => ({ ...prev, [id]: value }))
    },
    []
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      return supabase
        .from("guesses")
        .upsert({ id: _guesses.id, guest: id, guess: guesses })
        .then(console.log)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [guesses, id])

  return (
    <>
      <H5 className="mb-3 mt-5 text-gray-800">Guess a task</H5>

      <GroupPanel>
        {tasks.map((task) => (
          <div key={task.id} className="-mb-3 -mr-2 -mt-3 flex items-center">
            <H5 className="capitalize">{task.name}</H5>
            <div className="grow" />
            <Spinner
              value={guesses?.[task.id]?.toString() || ""}
              onChange={onChange(task.id)}
              options={[
                { value: "", label: "-" },
                ...guests.map(({ name, id }) => ({
                  value: id.toString(),
                  label: name,
                })),
              ]}
              className="ml-1 rounded bg-gray-100 px-3 py-4"
            />
          </div>
        ))}
      </GroupPanel>
    </>
  )
}
