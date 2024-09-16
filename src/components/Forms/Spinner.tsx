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
    value?: number
    onChange?: (v: number) => void
    max?: number
  }
> = ({ value, onChange = () => {}, max = 99, className, ...props }) => {
  const wrapperRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onChange(parseInt(entry.target.getAttribute("data-value")!))
          }
        }
      },
      { threshold: 0.7 }
    )
    const elements = wrapperRef.current?.querySelectorAll("div")
    elements?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = wrapperRef.current?.querySelector<HTMLElement>(
      `div[data-value="${value}"]`
    )
    console.log(element)
    wrapperRef.current!.scrollTop = element!.offsetTop
  }, [])
  return (
    <H5
      as="div"
      className={clsx(
        "scrollbar-hidden relative flex snap-y snap-mandatory flex-col overflow-auto text-right tabular-nums leading-[1]",
        className
      )}
      style={{ height: "2.25rem" }}
      ref={wrapperRef}
      {...props}
    >
      {Array(max)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={clsx("snap-center", value !== i && "opacity-40")}
            style={{ paddingBlock: "0.1875rem" }} //3px
            data-value={i}
          >
            {i}
          </div>
        ))}
    </H5>
  )
}
