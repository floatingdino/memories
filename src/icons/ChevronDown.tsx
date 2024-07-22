import type { SVGProps } from "react"

export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="1.33"
    strokeLinecap="square"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 7.5L10 12.5L15 7.5" />
  </svg>
)
export default ChevronDownIcon
