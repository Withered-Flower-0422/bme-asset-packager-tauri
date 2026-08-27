import { open } from "@tauri-apps/plugin-dialog"
import t from "../locales"
import { categories, suffixes } from "./bme"
import { warning } from "./msg"
import { root, sep } from "./sys"

const iconRoot = [root, "Scripts", "_Editor", "Icons"].join(sep)

const _addFolders = (sources: string[]) => {
  let warn = false

  const res: string[] = []
  for (let path of sources) {
    if (!path.startsWith(root)) {
      warn = true
      continue
    }

    path = path.replace(root + sep, "")

    if (
      !categories.some(
        category => path.startsWith(category) && path.split(sep).length === 2,
      )
    ) {
      warn = true
      continue
    }

    res.push(path)
  }

  if (warn) warning(t("wrongFolderPathWarning"))

  return res
}

const _addAssets = (sources: string[]) => {
  let warn = false

  const res: string[] = []
  for (let path of sources) {
    if (!path.startsWith(root)) {
      warn = true
      continue
    }

    path = path.replace(root + sep, "")

    if (
      !categories.some(
        category => path.startsWith(category) && path.split(sep).length === 3,
      )
    ) {
      warn = true
      continue
    }

    res.push(path)
  }

  if (warn) warning(t("wrongAssetPathWarning"))

  return res
}

const _addIcons = (sources: string[]) => {
  let warn = false

  const res: string[] = []

  for (const path of sources) {
    if (!path.startsWith(iconRoot)) {
      warn = true
      continue
    }
    res.push(path.split(sep).at(-1)!.replace(".tex", ""))
  }

  if (warn) warning(t("wrongIconPathWarning"))

  return res
}

export const addFolders = async () =>
  _addFolders(
    (await open({
      multiple: true,
      directory: true,
      defaultPath: root,
    })) ?? [],
  )

export const addAssets = async () =>
  _addAssets(
    (await open({
      multiple: true,
      directory: false,
      defaultPath: root,
      filters: [{ name: "BME Assets", extensions: suffixes }],
    })) ?? [],
  )

export const addIcons = async () =>
  _addIcons(
    (await open({
      multiple: true,
      directory: false,
      defaultPath: iconRoot,
      filters: [{ name: "BME Icons", extensions: ["tex"] }],
    })) ?? [],
  )

export const onDropFolders = _addFolders

export const onDropAssets = _addAssets

export const onDropIcons = _addIcons
