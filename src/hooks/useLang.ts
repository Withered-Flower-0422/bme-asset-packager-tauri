import { load } from "@tauri-apps/plugin-store"
import { useCallback, useEffect, useState } from "react"
import t, { type Lang } from "../locales"

const store = await load("store.json")

export default function () {
  const [lang, _setLang] = useState<Lang>("en")

  const loadLang = useCallback(
    async () => _setLang((t.lang = (await store.get<Lang>("lang")) ?? "en")),
    [],
  )

  const setLang = useCallback(
    async (lang: Lang) => {
      await store.set("lang", lang)
      await loadLang()
    },
    [loadLang],
  )

  useEffect(() => void loadLang(), [loadLang])

  return { lang, loadLang, setLang }
}
