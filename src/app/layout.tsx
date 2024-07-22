import type { Metadata } from "next";
import "@/styles/main.css"


export const metadata: Metadata = {
  title: "Memories",
  description: "Write some nice memories for me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
