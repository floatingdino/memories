import { FC } from "react"
import clsx from "clsx"

import createStyle, { CustomTagArgs } from "@josephmark/createstyle"
import Link from "next/link"
import { P } from "@/styles/Type"

export const ButtonEl = createStyle("a", clsx("inline-flex", P.toString()))

const THEMES = {
  primary:
    "bg-primary-500 active:bg-primary-400 text-white disabled:bg-gray-600 disabled:text-gray-300",
  inverted: "bg-black bg-opacity-0 text-primary-500 active:bg-opacity-10",
  secondary: "bg-white border border-black text-black",
  destructive: "bg-error-500 active:bg-error-400 text-white",
}

const SIZES = {
  large: "py-3 px-4 rounded-lg",
  square: "p-3",
}

type ButtonProps = {
  theme?: keyof typeof THEMES
  size?: keyof typeof SIZES
} & Omit<CustomTagArgs<HTMLAnchorElement>, "size">

export const Button: FC<ButtonProps> = ({
  theme = "primary",
  size = "large",
  className,
  href,
  ...props
}) =>
  href ? (
    <Link href={href} passHref legacyBehavior>
      <ButtonEl
        {...props}
        className={clsx(className, SIZES[size], THEMES[theme])}
      />
    </Link>
  ) : (
    <ButtonEl
      {...props}
      className={clsx(className, SIZES[size], THEMES[theme])}
    />
  )

export default Button
