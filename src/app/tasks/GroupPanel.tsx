import { Children } from "react"
import { FC } from "react"
import { ReactNode } from "react"

export const GroupPanel: FC<{ children: ReactNode }> = ({
  children: _children,
}) => {
  const children = Children.toArray(_children)
  return (
    <div className="rounded-md bg-white px-3">
      {children.map((child, i) => (
        <div className="group pt-4" key={i}>
          {child}
          <hr className="-mr-3 mt-4 border-gray-300 group-last:border-transparent" />
        </div>
      ))}
    </div>
  )
}
