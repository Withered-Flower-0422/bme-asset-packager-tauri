import { CloseOutlined, DeleteOutlined } from "@ant-design/icons"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { Button, Card } from "antd"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { v4 } from "uuid"
import { sep } from "../../utils/sys"
import styles from "./index.module.scss"

export interface FixedListBoxRef {
  getItems: () => string[]
  setItems: (data: string[]) => void
}

interface FixedListBoxProps {
  width: number
  height: number
  buttonText: string
  buttonIcon: ReactNode
  addContent: () => Promise<string[]>
  initialData?: string[]
  onDropFiles?: (files: string[]) => string[]
  disableDirectories?: boolean
  disableFiles?: boolean
}

export default forwardRef<FixedListBoxRef, FixedListBoxProps>(
  function FixedListBox(
    {
      width,
      height,
      buttonText,
      buttonIcon,
      addContent,
      initialData = [],
      onDropFiles = files => files,
      disableDirectories = false,
      disableFiles = false,
    },
    ref,
  ) {
    const cardRef = useRef<HTMLDivElement>(null!)
    const [items, setItems] = useState<{ id: string; content: string }[]>(
      initialData.map(content => ({ id: v4(), content })),
    )
    const [dragging, setDragging] = useState(false)

    const addItems = (newContents: string[]) =>
      setItems(prev => [
        ...prev.filter(({ content }) => !newContents.includes(content)),
        ...newContents.map(content => ({ id: v4(), content })),
      ])

    useEffect(() => {
      let subscribed = true
      let unlisten: (() => void) | undefined

      getCurrentWindow()
        .onDragDropEvent(({ payload }) => {
          const { type } = payload

          if (type === "enter" || type === "leave") return

          const {
            position: { x, y },
          } = payload
          const { left, right, top, bottom } =
            cardRef.current.getBoundingClientRect()

          const inside = x >= left && x <= right && y >= top && y <= bottom

          if (type === "over") setDragging(inside)
          else if (inside) {
            const { paths } = payload

            setDragging(false)
            addItems(
              onDropFiles(
                paths.filter(path => {
                  const isFile = path.split(sep).at(-1)!.includes(".")
                  return (
                    (!disableDirectories && !isFile) ||
                    (!disableFiles && isFile)
                  )
                }),
              ),
            )
          }
        })
        .then(f => (subscribed ? (unlisten = f) : f()))

      return () => {
        subscribed = false
        unlisten?.()
      }
    }, [])

    useImperativeHandle(ref, () => ({
      getItems: () => items.map(({ content }) => content),
      setItems: (data: string[]) =>
        setItems(data.map(content => ({ id: v4(), content }))),
    }))

    return (
      <div>
        <Card
          ref={cardRef}
          size="small"
          className={`${styles.self} ${dragging ? styles.dragging : ""} `}
          style={{ width, height }}
        >
          {items.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemContent}>{item.content}</div>
              <Button
                danger
                type="text"
                icon={<CloseOutlined />}
                onClick={() =>
                  setItems(prev => prev.filter(({ id }) => id !== item.id))
                }
              />
            </div>
          ))}
        </Card>

        <div className={styles.buttons}>
          <Button
            ghost
            danger
            icon={<DeleteOutlined />}
            onClick={() => setItems([])}
            style={{ width: "12.5%" }}
          />
          <Button
            ghost
            color="cyan"
            variant="outlined"
            icon={buttonIcon}
            onClick={async () => addItems(await addContent())}
            style={{ width: "85%" }}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    )
  },
)
