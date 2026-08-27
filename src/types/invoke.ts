import type { BMEFolder, BMEIconPath, BMEPath } from "../utils/bme"

declare module "@tauri-apps/api/core" {
  type Apis = {
    pack: [
      {
        output: string
        root: string
        folders: BMEFolder[]
        extras: BMEPath[]
        icons: string[]
      },
      {
        assets: (BMEPath | BMEIconPath)[]
        not_found: (BMEPath | BMEIconPath)[]
        zip_size: number
      },
    ]
  }

  export function invoke<T extends keyof Apis>(
    ...args: keyof Apis[T][0] extends never
      ? [cmd: T]
      : [cmd: T, args: Apis[T][0]]
  ): Promise<Apis[T][1]>
}
