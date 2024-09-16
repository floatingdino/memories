import Form from "@/components/Forms/context/FormContext"
import { useContext } from "react"

export const useForm = () => {
  return useContext(Form)
}

export default useForm
