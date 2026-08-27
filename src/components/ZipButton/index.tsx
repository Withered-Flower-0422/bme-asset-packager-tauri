import { FileZipOutlined } from "@ant-design/icons"
import { invoke } from "@tauri-apps/api/core"
import { open } from "@tauri-apps/plugin-dialog"
import { Button, Modal, message } from "antd"
import { type RefObject } from "react"
import { v4 } from "uuid"
import type { FixedListBoxRef } from "../../components/FixedListBox"
import t from "../../locales"
import type { BMEFolder, BMEPath } from "../../utils/bme"
import { root, sep, userProfile } from "../../utils/sys"
import styles from "./index.module.scss"

export default function ZipButton({
  folderRef,
  assetRef,
  iconRef,
}: {
  folderRef: RefObject<FixedListBoxRef>
  assetRef: RefObject<FixedListBoxRef>
  iconRef: RefObject<FixedListBoxRef>
}) {
  return (
    <Button
      ghost
      color="orange"
      variant="outlined"
      className={styles.self}
      size="large"
      icon={<FileZipOutlined />}
      onClick={async () => {
        const output = await open({
          directory: true,
          defaultPath: `${userProfile}${sep}Desktop`,
        })
        if (!output) return
        const folders = folderRef.current.getItems() as BMEFolder[]
        const extras = assetRef.current.getItems() as BMEPath[]
        const icons = iconRef.current.getItems()

        message.loading(t("packing"), Infinity)
        const { not_found: notFound, zip_size: zipSize } = await invoke(
          "pack",
          {
            output,
            root,
            folders,
            extras,
            icons,
          },
        )
        message.destroy()

        Modal.success({
          title: t("packSuccessTitle"),
          okText: t("ok"),
          content: t("packSuccessMessage", zipSize),
          onOk: () => {
            if (!notFound.length) return

            Modal.warning({
              title: t("notFoundAssetWarningTitle"),
              okText: t("ok"),
              content: (
                <div>
                  <div className={styles.warningContainer}>
                    {[...notFound].map(p => (
                      <div key={v4()}>{p}</div>
                    ))}
                  </div>
                  <div className={styles.warningFooter}>
                    {t("notFoundAssetWarningFooter")}
                  </div>
                </div>
              ),
            })
          },
        })
      }}
    >
      {t("zip")}
    </Button>
  )
}
