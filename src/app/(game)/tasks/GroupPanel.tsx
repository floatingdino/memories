import clsx from "clsx"
import { Children, HTMLAttributes, FC, ReactNode } from "react"

export const GroupPanel: FC<{ children: ReactNode } & HTMLAttributes<HTMLDivElement>> = ({
  children: _children,
  className,
  ...props
}) => {
  const children = Children.toArray(_children)
  return (
    <div className={clsx("rounded-md bg-white px-3 text-black dark:bg-black dark:text-white", className)} {...props}>
      {children.map((child, i) => (
        <div className="group pt-4" key={i}>
          {child}
          <hr className="-mr-3 mt-4 border-gray-300 group-last:border-transparent dark:border-gray-700" />
        </div>
      ))}
    </div>
  )
}
