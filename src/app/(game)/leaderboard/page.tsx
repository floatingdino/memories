"use client"

import Container from "@/components/Container"
import { H1, H4, H5 } from "@/styles/Type"
import supabase from "@/utils/supabaseClient"
import { ChangeEventHandler, Fragment, useCallback, useLayoutEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import Field from "@/components/Forms"
import { FormBGManager } from "@/components/FormBGManager"

import { GroupPanel } from "../tasks/GroupPanel"

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
      <div className="mb-2 mt-3 flex">
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
const BEST_DRESSED_ID = 45
const PARTY_STARTER_ID = 46
const MOST_MISCHIEVOUS_ID = 47

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
            non_player_task,
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
    const nonPlayerTasks = allTasks?.filter((task) => task.non_player_task)?.map(({ id }) => id) || []
    return (
      allTasks?.map((_task) => {
        const guest = guests?.find(({ id }) => id === _task.guests?.[0]?.id)
        if (!guest) {
          return {
            task: _task,
            id: _task.id,
            points: 0,
            totalGuesses: 0,
            correctGuesses: 0,
            incorrectGuesses: 0,
            combinedPoints: 0,
            identified: Infinity,
          }
        }
        const { task, id } = guest
        const points = task?.goals?.reduce?.((acc, goal) => {
          return acc + goal.points * goal.completions
        }, 0)
        const guess: Record<string, string> = task?.guesses?.guess || {}

        const totalGuesses = Object.entries(guess).filter(
          ([task, guess]) => !!guess && !nonPlayerTasks.includes(task)
        ).length
        const correctGuesses = Object.entries(guess).filter(([guessTask, guessGuest]) => {
          const taskGuest = guests.find(({ id: guestId }) => guestId.toString() === guessGuest.toString())
          if (!!guessGuest) {
            console.log(guests)
            console.log(taskGuest, guessGuest, guessTask)
          }
          return taskGuest?.task?.id?.toString() === guessTask
        })

        const identified = guests?.reduce((acc, guest) => {
          const correctlyIdentified = guest.task?.guesses?.guess?.[task.id.toString()] === guest.id.toString()
          return acc + (correctlyIdentified ? 1 : 0)
        }, 0)

        return {
          ...guest,
          points,
          totalGuesses,
          correctGuesses: correctGuesses.length,
          incorrectGuesses: totalGuesses - correctGuesses.length,
          combinedPoints: points + correctGuesses.length,
          identified,
        }
      }) || []
    )
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
  }, [mutate, updateTasks])

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setSort(e.currentTarget.value)
  }, [])

  const sortedGuests = useMemo(
    () => tasks?.filter(({ task }) => !task.non_player_task)?.sort?.((a, b) => b[sort] - a[sort]),
    [tasks, sort]
  )

  const orderedGuessesByProminence = useMemo(() => {
    const _tasks: Record<number, number> = Object.fromEntries(allTasks?.map((task) => [task.id, 0]) || [])
    guests?.forEach((guest) => {
      const guess = guest.task?.guesses?.guess || {}
      Object.entries(guess)
        .filter(([_k, v]) => !!v)
        .forEach(([taskId]) => {
          _tasks[taskId]++
        })
    })

    return Object.entries(_tasks).sort((a, b) => b[1] - a[1])
  }, [tasks, guests, allTasks])

  const getMostProminentGuestForRole = useCallback(
    (roleId: number) => {
      const [roleEntry] = Object.entries<number>(
        (guests || []).reduce((acc, guest) => {
          const favoured = guest?.task?.guesses?.guess?.[roleId.toString()]
          console.log(favoured, guest?.task?.guesses, roleId)
          acc[favoured] = (acc[favoured] || 0) + 1
          return acc
        }, {}) || {}
      ).sort((a, b) => b[1] - a[1])

      return guests?.find(({ id }) => id.toString() === roleEntry?.[0])
    },
    [guests]
  )

  const prizes = useMemo(() => {
    const _overall = tasks?.sort((a, b) => b.combinedPoints - a.combinedPoints)

    const [overall] = _overall
    const [bestSpy] = tasks?.sort((a, b) => b.correctGuesses - a.correctGuesses)

    const [incognito] = tasks?.filter((task) => !!task.id)?.sort((a, b) => b.identified - a.identified)

    const bestDressed = getMostProminentGuestForRole(BEST_DRESSED_ID)
    const partyStarter = getMostProminentGuestForRole(PARTY_STARTER_ID)
    const mostMischievous = getMostProminentGuestForRole(MOST_MISCHIEVOUS_ID)

    return {
      overall,
      "Best Dressed": bestDressed,
      "Best Spy": bestSpy,
      "Party Starter": partyStarter,
      incognito,
      "Most Mischievous": mostMischievous,
    }
  }, [tasks, getMostProminentGuestForRole])

  return (
    <Container>
      <div className="py-10">
        <FormBGManager />
        {orderedGuessesByProminence.length > 0 && (
          <>
            <H5 className="mb-2">Most guessed tasks:</H5>
            <GroupPanel className="mb-5">
              {orderedGuessesByProminence.slice(0, 3).map(([id, count]) => {
                const task = allTasks?.find((t) => t.id === parseInt(id))
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
                  const task = allTasks?.find((t) => t.id === parseInt(id))
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
        {!!params.get("showPrizes") &&
          Object.entries(prizes).map(([prize, guest]) => (
            <Fragment key={prize}>
              <H4 className="mb-2 mt-5">{prize}</H4>
              <GroupPanel key={prize}>
                <H5>{guest?.name}</H5>
                <H5>{guest?.task?.name}</H5>
              </GroupPanel>
            </Fragment>
          ))}
        {!!params.get("showLeaderboard") && (
          <>
            <div className="mb-2 mt-5">
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
                <LeaderboardGuest showName={!!params.get("showName")} key={guest.task.id} guest={guest} />
              ))}
            </div>
          </>
        )}
      </div>
    </Container>
  )
}
