"use client"

import { H5 } from "@/styles/Type"
import clsx from "clsx"
import { useEffect } from "react"
import { useLayoutEffect } from "react"
import { HTMLAttributes } from "react"
import { FC } from "react"
import { useRef } from "react"

export const Spinner: FC<
  Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
    value?: string
    onChange?: (v: string) => void
    options: { value: string; label?: string }[]
  }
> = ({ value, onChange = () => {}, options, className, ...props }) => {
  const wrapperRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onChange(entry.target.getAttribute("data-value")!)
          }
        }
      },
      { threshold: 0.5, root: wrapperRef.current }
    )
    const elements = wrapperRef.current?.querySelectorAll("div")
    elements?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = wrapperRef.current?.querySelector<HTMLElement>(`div[data-value="${value}"]`)
    if (!element || !wrapperRef.current) {
      return
    }
    wrapperRef.current!.scrollTop = element!.offsetTop
  }, [])
  return (
    <H5
      as="div"
      className={clsx(
        "scrollbar-hidden relative flex touch-pan-y snap-y snap-mandatory flex-col overflow-auto text-right tabular-nums leading-[1]",
        className
      )}
      style={{ height: "2.25rem" }}
      ref={wrapperRef}
      {...props}
    >
      {options.map(({ value: optionValue, label }, i) => (
        <div
          key={i}
          className={clsx("snap-center", value !== optionValue && "opacity-40")}
          style={{ paddingBlock: "0.1875rem" }} //3px
          data-value={optionValue}
        >
          {label ?? optionValue}
        </div>
      ))}
    </H5>
  )
}
