"use client"

import Image from 'next/image'
import { ChangeEventHandler, FC, InputHTMLAttributes, useCallback, useId, useState } from 'react'
import Input from './Input'
import { ImageFieldProps } from './types'


export const ImageField:FC<Omit<ImageFieldProps, "type">> = (props) => {
const [previewURL, setPreviewURL] = useState<string | null>(null)
const onChange= useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
  const file = e.currentTarget.files?.[0]
  setPreviewURL(file ? URL.createObjectURL(file) : null)
}, [])
return (
  <div className="flex flex-col gap-2">
    {previewURL && (
    <Image src={previewURL} width="1120" height="745" unoptimized alt="" className="object-cover rounded-md border" style={{aspectRatio: 3/2}} />
    )}
    <Input {...props} type="file" onChange={onChange} />
  </div>
)
}
export default ImageField
