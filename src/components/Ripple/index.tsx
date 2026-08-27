import { useEffect, useState } from "react"
import { v4 } from "uuid"
import styles from "./index.module.scss"

export default function Ripple() {
  const [ripples, setRipples] = useState<
    {
      id: string
      x: number
      y: number
    }[]
  >([])

  useEffect(() => {
    const handleClick = ({ clientX: x, clientY: y }: MouseEvent) => {
      const id = v4()
      setRipples(prev => [...prev, { id, x, y }])
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return (
    <>
      {ripples.map(({ id, x: left, y: top }) => (
        <span key={id} className={styles.ripple} style={{ left, top }} />
      ))}
    </>
  )
}
