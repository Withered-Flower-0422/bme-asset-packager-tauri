import { FolderViewOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { root } from "../../utils/sys"
import styles from "./index.module.scss"
import { openPath } from "@tauri-apps/plugin-opener"

export default function OpenAssetFolder() {
  return (
    <Button
      color="purple"
      variant="link"
      className={styles.self}
      onClick={() => openPath(root)}
      icon={<FolderViewOutlined />}
    />
  )
}
