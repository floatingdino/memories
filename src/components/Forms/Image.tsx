"use client"

import Image from 'next/image'
import { ChangeEventHandler, FC, InputHTMLAttributes, useCallback, useId, useState } from 'react'


export const ImageField:FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
const [previewURL, setPreviewURL] = useState<string | null>(null)
const onChange= useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
  const file = e.currentTarget.files?.[0]
  setPreviewURL(file ? URL.createObjectURL(file) : null)
}, [])
return (
  <div className="flex flex-col gap-2">
    {previewURL && (
    <Image src={previewURL} width="1120" height="745" unoptimized alt="" className="object-contain rounded-md border" />
    )}
  </div>
)
}
export default ImageField