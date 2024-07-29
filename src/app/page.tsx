import QRCode from "@/components/QRCode"
import { Suspense } from "react"
import Slideshow from "./SlideShow"
import { P } from "@/styles/Type"

const WEB_ROOT = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000"

export default function Home() {
  return (
    <main className="relative h-screen w-full bg-black text-white">
      <Slideshow />
      <Suspense>
        <div className="fixed bottom-10 right-6 flex flex-col gap-2 text-center">
          <P className="font-monospace uppercase">Add your own memory</P>
          <QRCode
            url={new URL("/submit", WEB_ROOT).toString()}
            width="200"
            height="200"
          />
        </div>
      </Suspense>
    </main>
  )
}
