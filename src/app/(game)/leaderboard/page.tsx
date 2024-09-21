"use client"

import Container from "@/components/Container"
import { H1, H2, H5, P } from "@/styles/Type"
import supabase from "@/utils/supabaseClient"
import { GroupPanel } from "../tasks/GroupPanel"
import { ChangeEventHandler, useCallback, useLayoutEffect, useMemo, useState } from "react"
import useSWR from "swr"
import Select from "@/components/Forms/Select"
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

  const enhancedGuests = useMemo(() => {
    return guests?.map?.((guest) => {
      const { task, id } = guest
      if (!task) {
        return guest
      }
      const points = task?.goals?.reduce?.((acc, goal) => {
        return acc + goal.points * goal.completions
      }, 0)
      const guess = task?.guesses?.guess || {}

      const totalGuesses = Object.values(guess).filter(Boolean).length
      const correctGuesses = Object.entries(guess).filter(([guessTask, guessGuest]) => {
        const taskGuest = guests.find(({ id }) => id === guessGuest)
        return taskGuest?.task?.[0]?.id === guessTask
      })

      return {
        ...guest,
        points,
        totalGuesses,
        correctGuesses: correctGuesses.length,
        incorrectGuesses: totalGuesses - correctGuesses.length,
      }
    })
  }, [guests])

  useLayoutEffect(() => {
    const channels = [
      supabase
        .channel("guests")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "guests" }, () => {
          mutate()
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

  const sortedGuests = useMemo(() => enhancedGuests?.sort?.((a, b) => b[sort] - a[sort]), [enhancedGuests, sort])

  return (
    <Container>
      <div className="py-10">
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
      </div>
    </Container>
  )
}
