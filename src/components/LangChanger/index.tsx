import { Button } from "antd"
import type useLang from "../../hooks/useLang"
import t from "../../locales"
import styles from "./index.module.scss"

export default function LangChanger({
  lang,
  setLang,
}: {
  lang: ReturnType<typeof useLang>["lang"]
  setLang: ReturnType<typeof useLang>["setLang"]
}) {
  const setToNextLang = (step = 1) =>
    setLang(t.langs.at((t.langs.indexOf(lang) + step) % t.langs.length)!)

  return (
    <Button
      color="gold"
      variant="link"
      className={styles.self}
      onClick={() => setToNextLang()}
      onWheel={({ deltaY }) => setToNextLang(Math.sign(deltaY))}
    >
      {t("abbr")}
    </Button>
  )
}
