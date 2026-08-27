import { PlusOutlined } from "@ant-design/icons"
import { Button, Input, Modal } from "antd"
import { useState, type RefObject } from "react"
import type { FixedListBoxRef } from "../../components/FixedListBox"
import type useFormulas from "../../hooks/useFormulas"
import t from "../../locales"
import { success, warning } from "../../utils/msg"
import styles from "./index.module.scss"

export default function SaveButton({
  folderRef,
  assetRef,
  iconRef,
  formulas,
  saveFormula,
}: {
  folderRef: RefObject<FixedListBoxRef>
  assetRef: RefObject<FixedListBoxRef>
  iconRef: RefObject<FixedListBoxRef>
  formulas: ReturnType<typeof useFormulas>["formulas"]
  saveFormula: ReturnType<typeof useFormulas>["saveFormula"]
}) {
  const [isInputOpen, setIsInputOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const saveFormulaWithCheck = async () => {
    const name = inputValue.trim()
    if (!name) {
      warning(t("missingFormulaNameWarning"))
      return
    }

    const _saveFormula = async () => {
      await saveFormula(name, {
        folders: folderRef.current.getItems(),
        extras: assetRef.current.getItems(),
        icons: iconRef.current.getItems(),
      })
      success(t("saveFormulaSuccess", inputValue))
      setIsInputOpen(false)
    }

    const exists = Object.keys(formulas)
    if (exists.includes(name))
      Modal.confirm({
        title: t("overwriteWarningTitle"),
        content: t("overwriteWarningMessage", inputValue),
        okText: t("ok"),
        cancelText: t("cancel"),
        onOk: _saveFormula,
      })
    else _saveFormula()
  }

  return (
    <>
      <Button
        ghost
        color="magenta"
        variant="outlined"
        className={styles.self}
        size="large"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsInputOpen(true)
          setInputValue("")
        }}
      >
        {t("save")}
      </Button>
      <Modal
        title={t("formulaName")}
        open={isInputOpen}
        okText={t("ok")}
        cancelText={t("cancel")}
        onOk={saveFormulaWithCheck}
        onCancel={() => setIsInputOpen(false)}
      >
        <Input
          value={inputValue}
          size="large"
          onChange={e => setInputValue(e.target.value)}
          onPressEnter={saveFormulaWithCheck}
        />
      </Modal>
    </>
  )
}
