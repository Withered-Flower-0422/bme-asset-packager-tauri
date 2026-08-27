import { sep as s, homeDir, join } from "@tauri-apps/api/path"

export const sep = s() as "/" | "\\"
export const userProfile = await homeDir()
export const root = await join(
  userProfile,
  "AppData",
  "LocalLow",
  "Mushreb",
  "BME Pro HDRP",
  "Assets",
)
