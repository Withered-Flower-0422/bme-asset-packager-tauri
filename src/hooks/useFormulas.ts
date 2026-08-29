import { useEffect, useState } from "react"
import store, { type Formula, type Formulas } from "../stores"

export default () => {
  const [formulas, setFormulas] = useState<Formulas>({})

  useEffect(() => void store.get("formulas").then(setFormulas), [])

  return {
    formulas,
    deleteFormula: (name: string) => {
      const { [name]: _, ...rest } = formulas
      store.set("formulas", rest)
      setFormulas(rest)
    },
    saveFormula: (name: string, formula: Formula) => {
      const newFormulas = { ...formulas, [name]: formula }
      store.set("formulas", newFormulas)
      setFormulas(newFormulas)
    },
  }
}
