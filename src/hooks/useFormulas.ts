import { load } from "@tauri-apps/plugin-store"
import { useCallback, useEffect, useState } from "react"

interface Formula {
  folders: string[]
  extras: string[]
  icons: string[]
}

type Formulas = Record<string, Formula>

const store = await load("store.json")

const getFormulas = async () => (await store.get<Formulas>("formulas")) ?? {}

export default function () {
  const [formulas, setFormulas] = useState<Formulas>({})

  const loadFormulas = useCallback(
    async () => setFormulas(await getFormulas()),
    [],
  )

  const deleteFormula = useCallback(
    async (name: string) => {
      const _formulas = await getFormulas()
      delete _formulas[name]
      await store.set("formulas", _formulas)
      await loadFormulas()
    },
    [loadFormulas],
  )

  const saveFormula = useCallback(
    async (name: string, formula: Formula) => {
      await store.set("formulas", {
        ...(await getFormulas()),
        [name]: formula,
      })
      await loadFormulas()
    },
    [loadFormulas],
  )

  useEffect(() => void loadFormulas(), [loadFormulas])

  return { formulas, deleteFormula, saveFormula, loadFormulas }
}
