"use client"

import Image from "next/image"
import { ChangeEventHandler, FC, useCallback, useState } from "react"
import Input from "./Input"
import { ImageFieldProps } from "./types/Form"

export const ImageField: FC<Omit<ImageFieldProps, "type">> = ({
  value,
  ...props
}) => {
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    const file = e.currentTarget.files?.[0]
    setPreviewURL(file ? URL.createObjectURL(file) : null)
    props?.onChange?.(e)
  }, [])
  return (
    <div className="flex flex-col gap-2">
      {previewURL && (
        <Image
          src={previewURL}
          width="705"
          height="470"
          unoptimized
          alt=""
          className="rounded-md border object-cover"
          style={{ aspectRatio: 3 / 2 }}
        />
      )}
      <Input {...props} type="file" onChange={onChange} />
    </div>
  )
}
export default ImageField
