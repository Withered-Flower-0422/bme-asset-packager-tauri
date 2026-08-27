pub fn is_builtin(asset: &str) -> bool {
    let asset = asset.replace('\\', "/");

    let mut parts = asset.split('/');

    let category = match parts.next() {
        Some(v) => v,
        None => return false,
    };

    let folder = match parts.next() {
        Some(v) => v,
        None => return false,
    };

    match category {
        "Audios" => matches!(folder, "Balls"),

        "Items" => matches!(
            folder,
            "Arches"
                | "Ballustrades"
                | "Bridge"
                | "CheckPoint"
                | "Cliff"
                | "Columns"
                | "DoorsAndKeys"
                | "Floors"
                | "FortressWalls"
                | "Machinery"
                | "Misc"
                | "Pool"
                | "RailBlock"
                | "Rails"
                | "Rigidbody"
                | "RoundTowers"
                | "Space"
                | "Stairs"
                | "Switcher"
                | "Trims"
                | "Vegetation"
                | "Volcano"
                | "Walls"
                | "WoodenObjects"
        ),

        "Materials" => matches!(
            folder,
            "Balls" | "Cliff" | "Machinery" | "Space" | "Utility"
        ),

        "Meshes" => matches!(folder, "Balls" | "Space"),

        "Scripts" | "Textures" | "Scenes" => false,

        _ => false,
    }
}

pub fn is_hybrid_asset(asset: &str) -> bool {
    asset.starts_with("Items/") || asset.starts_with("Materials/") || asset.starts_with("Scenes/")
}

// pub fn is_pure_asset(asset: &str) -> bool {
//     asset.starts_with("Audios/") || asset.starts_with("Meshes/") || asset.starts_with("Textures/")
// }

pub fn is_icon(asset: &str) -> bool {
    asset.starts_with("Scripts/_Editor/Icons/")
}

pub fn is_script_asset(asset: &str) -> bool {
    asset.starts_with("Scripts/")
}
