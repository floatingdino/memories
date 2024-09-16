"use client"

import { H5 } from "@/styles/Type"
import { GroupPanel } from "../GroupPanel"
import { Spinner } from "@/components/Forms/Spinner"
import { useEffect, useState, useCallback } from "react"
import supabase from "@/utils/supabaseClient"
import { FC } from "react"

export const TaskPanel: FC<{
  id: number
  tasks: any[]
  guests: any[]
  guesses: any
}> = ({ id, tasks, guests, guesses: _guesses }) => {
  const [recordId, setRecordId] = useState(_guesses.id)
  const [guesses, setGuesses] = useState(_guesses.guess)

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
        .upsert({ id: recordId, guest: id, guess: guesses })
        .select()
        .then(({ data }) => {
          setRecordId(data![0].id)
        })
    }, 1500)

    return () => clearTimeout(timeout)
  }, [guesses, id])

  return (
    <>
      <H5 className="mb-2 mt-5 opacity-80">Guess a task:</H5>

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
              className="ml-1 rounded bg-gray-100 px-3 py-4 dark:bg-gray-900"
            />
          </div>
        ))}
      </GroupPanel>
    </>
  )
}
