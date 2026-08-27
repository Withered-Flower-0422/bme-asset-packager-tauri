import {
  FileAddOutlined,
  FolderAddOutlined,
  PictureOutlined,
} from "@ant-design/icons"
import { useRef } from "react"
import styles from "./App.module.scss"
import FixedListBox, { type FixedListBoxRef } from "./components/FixedListBox"
import ImportButton from "./components/ImportButton"
import Info from "./components/Info"
import LangChanger from "./components/LangChanger"
import Mush from "./components/Mush"
import OpenAssetFolder from "./components/OpenAssetFolder"
import Ripple from "./components/Ripple"
import SaveButton from "./components/SaveButton"
import Title from "./components/Title"
import ZipButton from "./components/ZipButton"
import useFormulas from "./hooks/useFormulas"
import useLang from "./hooks/useLang"
import t from "./locales"
import {
  addAssets,
  addFolders,
  addIcons,
  onDropAssets,
  onDropFolders,
  onDropIcons,
} from "./utils/add"

export default function App() {
  const folderRef = useRef<FixedListBoxRef>(null!)
  const assetRef = useRef<FixedListBoxRef>(null!)
  const iconRef = useRef<FixedListBoxRef>(null!)

  const { formulas, saveFormula, deleteFormula } = useFormulas()
  const { lang, setLang } = useLang()

  return (
    <>
      <Ripple />

      <div>
        <Title>{t("bmeAssetPackager")}</Title>

        <OpenAssetFolder />
        <Mush />

        <div className={styles.listboxes}>
          <FixedListBox
            ref={folderRef}
            width={300}
            height={400}
            buttonText={t("addFolders")}
            buttonIcon={<FolderAddOutlined />}
            addContent={addFolders}
            onDropFiles={onDropFolders}
            disableFiles
          />
          <FixedListBox
            ref={assetRef}
            width={300}
            height={400}
            buttonText={t("addAssets")}
            buttonIcon={<FileAddOutlined />}
            addContent={addAssets}
            onDropFiles={onDropAssets}
            disableDirectories
          />
          <FixedListBox
            ref={iconRef}
            width={300}
            height={400}
            buttonText={t("addIcons")}
            buttonIcon={<PictureOutlined />}
            addContent={addIcons}
            onDropFiles={onDropIcons}
            disableDirectories
          />
        </div>

        <div className={styles.buttons}>
          <SaveButton
            folderRef={folderRef}
            assetRef={assetRef}
            iconRef={iconRef}
            formulas={formulas}
            saveFormula={saveFormula}
          />
          <ImportButton
            folderRef={folderRef}
            assetRef={assetRef}
            iconRef={iconRef}
            formulas={formulas}
            deleteFormula={deleteFormula}
          />
          <ZipButton
            folderRef={folderRef}
            assetRef={assetRef}
            iconRef={iconRef}
          />
        </div>

        <LangChanger lang={lang} setLang={setLang} />
        <Info />
      </div>
    </>
  )
}
