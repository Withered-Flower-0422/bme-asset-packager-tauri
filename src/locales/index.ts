export interface Locale {
  abbr: string
  missingFormulaNameWarning: string
  saveFormulaSuccess: (inputValue: string) => string
  overwriteWarningTitle: string
  overwriteWarningMessage: (inputValue: string) => string
  noSelectedFormulaWarning: string
  loadFormulaSuccess: (selectedValue: string) => string
  addFolders: string
  wrongFolderPathWarning: string
  addAssets: string
  wrongAssetPathWarning: string
  addIcons: string
  wrongIconPathWarning: string
  formulaName: string
  save: string
  selectFormula: string
  deleteWarningTitle: string
  deleteWarningMessage: (label: string) => string
  import: string
  packing: string
  zip: string
  ok: string
  cancel: string
  packSuccessTitle: string
  packSuccessMessage: (zipSize: number) => string
  notFoundAssetWarningTitle: string
  notFoundAssetWarningFooter: string
  bmeAssetPackager: string
  author: (author: string) => string
  version: (version: string) => string
  license: (license: string) => string
  mushQuote: (index?: number) => string
}

import en from "./en"
import zh from "./zh"
import zhTW from "./zh-TW"
import jp from "./jp"
import es from "./es"

const locales = { en, zh, zhTW, jp, es }

const t: {
  <T extends keyof Locale>(
    msg: T,
    ...args: Locale[T] extends (...args: infer P) => string ? P : []
  ): string
  lang: Lang
  langs: Lang[]
} = (msg, ...args) => {
  let content: string | ((...args: any[]) => string) = locales[t.lang][msg]
  if (typeof content === "function") content = content(...args)
  return content
}
t.lang = "en"
t.langs = Object.keys(locales) as Lang[]

export default t
export type Lang = keyof typeof locales
