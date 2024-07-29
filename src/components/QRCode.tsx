import { FC, HTMLAttributes, SVGProps, useMemo } from "react"
import qrc from "qrcode"

type QRCodeProps = {
  url: string
} & SVGProps<SVGSVGElement>
export const QRCode: FC<QRCodeProps> = async ({ url, ...props }) => {
  const code = await qrc.toString(url, { type: "svg" })
  return <svg {...props} dangerouslySetInnerHTML={{ __html: code }} />
}
export default QRCode
