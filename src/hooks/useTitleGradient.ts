import { useEffect, useState } from "react"
import store from "../stores"

export default function () {
  const [titleGradient, setTitleGradient] = useState(false)

  useEffect(() => void store.get("titleGradient").then(setTitleGradient), [])

  return {
    titleGradient,
    setTitleGradient: (value: boolean) => {
      store.set("titleGradient", value)
      setTitleGradient(value)
    },
  }
}
