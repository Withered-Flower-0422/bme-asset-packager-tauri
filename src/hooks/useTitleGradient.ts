import { load } from "@tauri-apps/plugin-store"
import { useCallback, useEffect, useState } from "react"

const store = await load("store.json")

export default function () {
  const [titleGradient, _setTitleGradient] = useState(false)

  const loadTitleGradient = useCallback(
    async () =>
      _setTitleGradient((await store.get<boolean>("titleGradient")) ?? false),
    [],
  )

  const setTitleGradient = useCallback(
    async (titleGradient: boolean) => {
      await store.set("titleGradient", titleGradient)
      await loadTitleGradient()
    },
    [loadTitleGradient],
  )

  useEffect(() => void loadTitleGradient(), [loadTitleGradient])

  return { titleGradient, loadTitleGradient, setTitleGradient }
}
