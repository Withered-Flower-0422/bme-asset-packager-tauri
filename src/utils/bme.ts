export type PrefixToSuffix = {
  Audios: "audio"
  Items: "item"
  Scenes: "scene"
  Scripts: "js"
  Materials: "mat"
  Meshes: "mesh"
  Textures: "tex"
}

export type SuffixToPrefix = {
  audio: "Audios"
  item: "Items"
  scene: "Scenes"
  js: "Scripts"
  mat: "Materials"
  mesh: "Meshes"
  tex: "Textures"
}

export type AssetPrefix = keyof PrefixToSuffix
export type AssetSuffix = keyof SuffixToPrefix

export type BMEFolder<T extends AssetPrefix = AssetPrefix> = `${T}/${string}`
export type BMEPath<T extends AssetPrefix = AssetPrefix> = {
  [K in T]: `${K}/${string}/${string}.${PrefixToSuffix[K]}`
}[T]
export type BMEIconPath = `Scripts/_Editor/Icons/${string}.tex`

export const assetsPreToSux = {
  Audios: "audio",
  Items: "item",
  Scenes: "scene",
  Scripts: "js",
  Materials: "mat",
  Meshes: "mesh",
  Textures: "tex",
} as const

export const categories = Object.keys(assetsPreToSux) as AssetPrefix[]
export const suffixes = Object.values(assetsPreToSux) as AssetSuffix[]
