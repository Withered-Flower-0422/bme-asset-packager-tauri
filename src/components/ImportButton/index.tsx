import { CloseOutlined, ImportOutlined } from "@ant-design/icons"
import { Button, Modal, Select } from "antd"
import { useState, type RefObject } from "react"
import type { FixedListBoxRef } from "../../components/FixedListBox"
import type useFormulas from "../../hooks/useFormulas"
import t from "../../locales"
import { success, warning } from "../../utils/msg"
import styles from "./index.module.scss"

export default function ImportButton({
  folderRef,
  assetRef,
  iconRef,
  formulas,
  deleteFormula,
}: {
  folderRef: RefObject<FixedListBoxRef>
  assetRef: RefObject<FixedListBoxRef>
  iconRef: RefObject<FixedListBoxRef>
  formulas: ReturnType<typeof useFormulas>["formulas"]
  deleteFormula: ReturnType<typeof useFormulas>["deleteFormula"]
}) {
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string>()

  return (
    <>
      <Button
        ghost
        color="lime"
        variant="outlined"
        className={styles.self}
        size="large"
        icon={<ImportOutlined />}
        onClick={async () => {
          setIsSelectOpen(true)
          setSelectedValue(undefined)
        }}
      >
        {t("import")}
      </Button>
      <Modal
        title={t("selectFormula")}
        open={isSelectOpen}
        okText={t("ok")}
        cancelText={t("cancel")}
        onOk={async () => {
          if (!selectedValue) {
            warning(t("noSelectedFormulaWarning"))
            return
          }
          const { folders, extras, icons } = formulas[selectedValue]
          folderRef.current.setItems(folders)
          assetRef.current.setItems(extras)
          iconRef.current.setItems(icons)
          success(t("loadFormulaSuccess", selectedValue))
          setIsSelectOpen(false)
        }}
        onCancel={() => setIsSelectOpen(false)}
      >
        <Select
          style={{ width: "100%" }}
          value={selectedValue}
          onChange={setSelectedValue}
          size="large"
          allowClear
          showSearch
          options={Object.keys(formulas).map(k => ({ label: k, value: k }))}
          optionRender={({ data: { label, value } }) => (
            <div className={styles.item}>
              <span>{label}</span>
              <CloseOutlined
                className={styles.deleteIcon}
                onClick={e => {
                  e.stopPropagation()
                  Modal.confirm({
                    title: t("deleteWarningTitle"),
                    content: t("deleteWarningMessage", label),
                    okText: t("ok"),
                    cancelText: t("cancel"),
                    onOk: () => {
                      deleteFormula(value)
                      if (selectedValue === value) setSelectedValue(undefined)
                    },
                  })
                }}
              />
            </div>
          )}
        ></Select>
      </Modal>
    </>
  )
}
