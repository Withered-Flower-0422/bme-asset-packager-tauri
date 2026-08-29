import { useEffect, useState } from "react"
import t, { type Lang } from "../locales"
import store from "../stores"

export default function () {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => void store.get("lang").then(la => setLang((t.lang = la))), [])

  return {
    lang,
    setLang: (value: Lang) => {
      t.lang = value
      store.set("lang", value)
      setLang(value)
    },
  }
}
