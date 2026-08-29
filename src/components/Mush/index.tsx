import { Tooltip } from "antd"
import { useState } from "react"
import memes from "../../assets/memes"
import mush from "../../assets/mush/mush.png"
import t from "../../locales"
import { cssNamedColors, type CssNamedColor } from "../../utils/css"
import { getRandomItem, getRandomItems } from "../../utils/rnd"
import styles from "./index.module.scss"

const defaultColors: CssNamedColor[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "wheat",
]

export default function Mush() {
  const [colors, setColors] = useState(defaultColors)
  const [colorIndex, setColorIndex] = useState(0)

  return (
    <a href="https://store.steampowered.com/app/1383570/" target="_blank">
      <Tooltip
        placement="leftTop"
        color="#333"
        title={() =>
          /* eslint-disable-next-line */
          Math.random() > 0.1 ? (
            <span className={styles.quote}>{t("mushQuote")}</span>
          ) : (
            <img className={styles.meme} src={getRandomItem(memes)} />
          )
        }
      >
        <img
          className={`${styles.self} ${styles[colors.at(colorIndex)!]}`}
          src={mush}
          alt="Mush"
          onMouseUp={e => {
            e.preventDefault()
            setColorIndex(0)
            switch (e.button) {
              case 1:
                setColors([...defaultColors])
                break
              case 2:
                setColors(getRandomItems(cssNamedColors, 8))
                break
            }
          }}
          onWheel={({ deltaY }) =>
            setColorIndex(prev => (prev + Math.sign(deltaY)) % colors.length)
          }
        />
      </Tooltip>
    </a>
  )
}
