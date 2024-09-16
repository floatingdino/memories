"use client"

import { H5 } from "@/styles/Type"
import { GroupPanel } from "../GroupPanel"
import { Spinner } from "@/components/Forms/Spinner"

export const TaskPanel = ({ id, tasks, guests, guesses }) => {
  return (
    <>
      <H5 className="mb-3 mt-5 text-gray-800">Guess a task</H5>

      <GroupPanel>
        {tasks.map((task) => (
          <div key={task.id} className="-mb-3 -mr-2 -mt-3 flex items-center">
            <H5 className="capitalize">{task.name}</H5>
            <div className="grow" />
            <Spinner
              value=""
              options={[
                { value: "", label: "-" },
                ...guests.map(({ name, id }) => ({ value: id, label: name })),
              ]}
              className="ml-1 rounded bg-gray-100 px-3 py-4"
            />
          </div>
        ))}
      </GroupPanel>
    </>
  )
}
