import { load, type Store as S } from "@tauri-apps/plugin-store"
import type { Lang } from "../locales"

type Override<A, B> = Omit<A, keyof B> & B

type Store<T = {}> = Override<
  S,
  {
    get<K extends keyof T>(key: K): Promise<T[K]>
    set<K extends keyof T>(key: K, value: T[K]): Promise<void>
  }
>

export interface Formula {
  folders: string[]
  extras: string[]
  icons: string[]
}

export type Formulas = Record<string, Formula>

export interface StoreType {
  lang: Lang
  titleGradient: boolean
  formulas: Formulas
}

export default (await load("store.json", {
  defaults: {
    lang: "en",
    titleGradient: false,
    formulas: {},
  } satisfies StoreType,
})) as Store<StoreType>
