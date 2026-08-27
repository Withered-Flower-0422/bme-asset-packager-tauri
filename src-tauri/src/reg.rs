use regex::Regex;

pub fn asset_regexes() -> Vec<Regex> {
    vec![
        Regex::new(r"Audios/[^/]+/[^/]+\.audio").unwrap(),
        Regex::new(r"Items/[^/]+/[^/]+\.item").unwrap(),
        Regex::new(r"Materials/[^/]+/[^/]+\.mat").unwrap(),
        Regex::new(r"Meshes/[^/]+/[^/]+\.mesh").unwrap(),
        Regex::new(r"Scripts/[^/]+/[^/]+\.js").unwrap(),
        Regex::new(r"Textures/[^/]+/[^/]+\.tex").unwrap(),
        Regex::new(r"Scenes/[^/]+/[^/]+\.scene").unwrap(),
    ]
}

pub fn imported_path_regex() -> Regex {
    Regex::new(r#"(?:import|from)\s*["'](Scripts/[^"']*?\.js)["']"#).unwrap()
}

pub fn garble_regex() -> Regex {
    Regex::new(r"[^ \P{C}\s]").unwrap()
}
