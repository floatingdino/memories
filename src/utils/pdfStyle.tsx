import { ComponentType, ReactNode } from "react"
import {
  Document,
  Page,
  View,
  Image,
  Text,
  Link,
  Note,
  Canvas,
  StyleSheet,
  NodeProps,
  Styles,
  ImageProps,
  LinkProps,
  NoteProps,
  CanvasProps,
  DocumentProps,
  PageProps,
  TextProps,
  ViewProps,
} from "@react-pdf/renderer"

const COMPONENTS = {
  Document,
  Page,
  View,
  Image,
  Text,
  Link,
  Note,
  Canvas,
}

function parseStyle(style: TemplateStringsArray, subs: any[]) {
  const lines = String.raw(style, ...subs).split("\n")
  return StyleSheet.create(
    Object.fromEntries(
      lines
        .filter(([k, v]) => !!k && !!v)
        .map((line) => {
          const [k, value] = line.trim().replace(";", "").split(":")
          const key = k
            .split("-")
            .map((word, idx) => (idx === 0 ? word : word[0].toUpperCase() + word.slice(1)))
            .join("")
          return [key.trim(), value.trim()]
        })
    ) as Styles
  )
}

export function styleFactory<T extends ComponentType<any>, P extends NodeProps>(tag: keyof typeof COMPONENTS) {
  const C = COMPONENTS[tag] as T

  return (template: TemplateStringsArray, ...subs: any[]) => {
    const parsedStyle = parseStyle(template, subs)
    function styledPDFElement(props: P & { children?: ReactNode }) {
      return <C {...(props as any)} style={{ ...parsedStyle, ...props.style }} />
    }
    styledPDFElement.styleTemplate = template
    styledPDFElement.style = parsedStyle
    return styledPDFElement
  }
}

export const spc = {
  Document: styleFactory<typeof Document, DocumentProps>("Document"),
  Page: styleFactory<typeof Page, PageProps>("Page"),
  View: styleFactory<typeof View, ViewProps>("View"),
  Image: styleFactory<typeof Image, ImageProps>("Image"),
  Text: styleFactory<typeof Text, TextProps>("Text"),
  Link: styleFactory<typeof Link, LinkProps>("Link"),
  Note: styleFactory<typeof Note, NoteProps>("Note"),
  Canvas: styleFactory<typeof Canvas, CanvasProps>("Canvas"),
}

export default spc
