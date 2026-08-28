import { Modal } from "antd"
import packageJson from "../../../package.json"
import t from "../../locales"
import styles from "./index.module.scss"

export default function Info() {
  return (
    <div
      className={styles.self}
      onClick={() => {
        Modal.info({
          title: (
            <a
              href="https://github.com/Withered-Flower-0422/bme-asset-packager-tauri"
              target="_blank"
            >
              {t("bmeAssetPackager")}
            </a>
          ),
          content: (
            <div className={styles.links}>
              <a href="https://github.com/Withered-Flower-0422" target="_blank">
                {t("author", packageJson.author)}
              </a>
              <a
                href="https://github.com/Withered-Flower-0422/bme-asset-packager-tauri/releases"
                target="_blank"
              >
                {t("version", packageJson.version)} (tauri)
              </a>
              <a
                href="https://github.com/Withered-Flower-0422/bme-asset-packager-tauri/blob/main/LICENSE"
                target="_blank"
              >
                {t("license", packageJson.license)}
              </a>
            </div>
          ),
          okText: t("ok"),
        })
      }}
    >
      {"Ver. " + packageJson.version}
    </div>
  )
}
