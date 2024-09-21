"use client"

import Container from "@/components/Container"
import { H1, H5 } from "@/styles/Type"
import supabase from "@/utils/supabaseClient"
import { GroupPanel } from "../tasks/GroupPanel"
import { ChangeEventHandler, useCallback, useLayoutEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import Field from "@/components/Forms"

const LeaderboardGuest = ({ guest, showName }: any) => {
  const { id, name, task, points, totalGuesses, correctGuesses, incorrectGuesses } = guest
  if (!task) {
    return null
  }

  const metrics = [
    ["Task points", points],
    ["Total guesses", totalGuesses],
    ["Correct guesses", correctGuesses],
    ["Incorrect guesses", incorrectGuesses],
  ]
  return (
    <div key={id}>
      <div className="mb-2 flex">
        {showName && (
          <>
            <H5>{name}</H5>
            <div className="grow" />
          </>
        )}
        <H5>{task?.name}</H5>
      </div>
      <GroupPanel>
        {metrics.map(([label, value]) => (
          <div key={label} className="flex">
            <H5>{label}</H5>
            <div className="grow" />
            <H5>{value}</H5>
          </div>
        ))}
      </GroupPanel>
    </div>
  )
}

const SORT_OPTIONS = ["id", "points", "totalGuesses", "correctGuesses", "incorrectGuesses"]

export default function Leaderboard() {
  const params = useSearchParams()
  const [sort, setSort] = useState(params.get("sort") || "id")
  const { data: allTasks, mutate: updateTasks } = useSWR("tasks", (table: string) =>
    supabase
      .from(table)
      .select("id, name, guests ( id )")
      .order("id")
      .returns<any>()
      .then(({ data }) => data)
  )
  const { data: guests, mutate } = useSWR(
    "guests",
    (table: string) =>
      supabase
        .from(table)
        .select(
          `
          id,
          name,
          task (
            id,
            name,
            goals (
              points,
              completions
            ),
            guesses (
              guess
            )
          )
        `
        )
        .returns<any>()
        .then(({ data }) => data),
    { refreshWhenHidden: true }
  )

  const tasks = useMemo(() => {
    return allTasks?.map((_task) => {
      const guest = guests?.find(({ id }) => id === _task.guests?.[0]?.id)
      if (!guest) {
        return { task: _task, id: _task.id, points: 0, totalGuesses: 0, correctGuesses: 0, incorrectGuesses: 0 }
      }
      const { task, id } = guest
      const points = task?.goals?.reduce?.((acc, goal) => {
        return acc + goal.points * goal.completions
      }, 0)
      const guess: Record<string, string> = task?.guesses?.guess || {}

      const totalGuesses = Object.values(guess).filter(Boolean).length
      const correctGuesses = Object.entries(guess).filter(([guessTask, guessGuest]) => {
        const taskGuest = guests.find(({ id }) => id.toString() === guessGuest.toString())
        if (!!guessGuest) {
          console.log(guests)
          console.log(taskGuest, guessGuest, guessTask)
        }
        return taskGuest?.task?.id?.toString() === guessTask
      })

      return {
        ...guest,
        points,
        totalGuesses,
        correctGuesses: correctGuesses.length,
        incorrectGuesses: totalGuesses - correctGuesses.length,
      }
    })
  }, [guests, allTasks])

  useLayoutEffect(() => {
    const channels = [
      supabase
        .channel("guests")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "guests" }, () => {
          mutate()
          updateTasks()
        })
        .subscribe(),
      supabase
        .channel("guesses")
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "guesses" }, () => {
          mutate()
        })
        .subscribe(),
      supabase
        .channel("goals")
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "goals" }, () => {
          mutate()
        })
        .subscribe(),
    ]

    return () => {
      channels.forEach((c) => c.unsubscribe())
    }
  }, [])

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setSort(e.currentTarget.value)
  }, [])

  const sortedGuests = useMemo(() => tasks?.sort?.((a, b) => b[sort] - a[sort]), [tasks, sort])

  const orderedGuessesByProminence = useMemo(() => {
    const tasks: Record<number, number> = Object.fromEntries(allTasks?.map((task) => [task.id, 0]) || [])
    guests?.forEach((guest) => {
      const guess = guest.task?.guesses?.guess || {}
      Object.entries(guess)
        .filter(([_k, v]) => !!v)
        .forEach(([taskId]) => {
          tasks[taskId]++
        })
    })

    return Object.entries(tasks).sort((a, b) => b[1] - a[1])
  }, [tasks, guests])

  return (
    <Container>
      <div className="py-10">
        {orderedGuessesByProminence.length > 0 && (
          <>
            <H5 className="mb-2">Most guessed tasks:</H5>
            <GroupPanel className="mb-5">
              {orderedGuessesByProminence.slice(0, 3).map(([id, count]) => {
                const task = allTasks.find((task) => task.id === parseInt(id))
                if (!task) {
                  return null
                }
                return (
                  <div key={id} className="flex">
                    <H5>{task.name}</H5>
                    <div className="grow" />
                    <H5>&times; {count}</H5>
                  </div>
                )
              })}
            </GroupPanel>
          </>
        )}
        {orderedGuessesByProminence.length > 0 && (
          <>
            <H5 className="mb-2">Least guessed tasks:</H5>
            <GroupPanel className="mb-5">
              {[...orderedGuessesByProminence]
                .reverse()
                .slice(0, 3)
                .map(([id, count]) => {
                  const task = allTasks.find((task) => task.id === parseInt(id))
                  if (!task) {
                    return null
                  }
                  return (
                    <div key={id} className="flex">
                      <H5>{task.name}</H5>
                      <div className="grow" />
                      <H5>&times; {count}</H5>
                    </div>
                  )
                })}
            </GroupPanel>
          </>
        )}
        {!!params.get("showLeaderboard") && (
          <>
            <div className="mb-2">
              <H1>Leaderboard</H1>
            </div>
            <Field
              onChange={onChange}
              value={sort}
              name="sort"
              type="select"
              label="Sort by:"
              options={SORT_OPTIONS.map((value) => ({ label: value, value }))}
              className="mb-5"
            />
            <div className="flex flex-col gap-2">
              {sortedGuests?.map((guest) => (
                <LeaderboardGuest showName={!!params.get("showName")} key={guest.id} guest={guest} />
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  )
}
