use std::{
    collections::{HashSet, VecDeque},
    fs, io,
    path::{Path, PathBuf},
};

use regex::Regex;

use crate::{
    builtin::{is_builtin, is_hybrid_asset, is_icon, is_script_asset},
    reg::{asset_regexes, garble_regex, imported_path_regex},
};

#[derive(Debug)]
pub struct AssetsResult {
    pub assets: HashSet<String>,
    pub not_founds: HashSet<String>,
}

pub struct BmeAssetsGetter {
    pub root: PathBuf,
    pub folders: Vec<String>,
    pub extras: Vec<String>,
    pub icons: Vec<String>,

    asset_regexes: Vec<Regex>,
    imported_path_regex: Regex,
    garble_regex: Regex,
}

impl BmeAssetsGetter {
    pub fn new(
        root: impl Into<PathBuf>,
        folders: Vec<String>,
        extras: Vec<String>,
        icons: Vec<String>,
    ) -> io::Result<Self> {
        let root = root.into();

        if !root.exists() {
            return Err(io::Error::new(
                io::ErrorKind::NotFound,
                format!("Root does not exist: {}", root.display()),
            ));
        }

        Ok(Self {
            root,
            folders,
            extras,
            icons,

            asset_regexes: asset_regexes(),
            imported_path_regex: imported_path_regex(),
            garble_regex: garble_regex(),
        })
    }

    pub fn all_initial_assets(&self) -> HashSet<String> {
        let mut result = HashSet::new();

        for folder in &self.folders {
            if is_builtin(folder) {
                continue;
            }

            let dir = self.root.join(folder);

            if !dir.exists() {
                continue;
            }

            let entries = match fs::read_dir(&dir) {
                Ok(entries) => entries,
                Err(_) => continue,
            };

            for entry in entries.flatten() {
                let name = entry.file_name();

                let name = name.to_string_lossy();

                result.insert(format!("{}/{}", folder, name));
            }
        }

        for extra in &self.extras {
            if is_builtin(extra) {
                continue;
            }

            result.insert(normalize_path(extra));
        }

        for icon in &self.icons {
            result.insert(format!("Scripts/_Editor/Icons/{}.tex", icon));
        }

        result
    }

    pub fn all_assets(&self) -> AssetsResult {
        let mut assets = HashSet::new();
        let mut not_founds = HashSet::new();

        let mut queue: VecDeque<String> = self.all_initial_assets().into_iter().collect();

        while let Some(asset) = queue.pop_front() {
            let asset = normalize_path(&asset);

            if is_builtin(&asset) || assets.contains(&asset) {
                continue;
            }

            let path = self.root.join(&asset);

            if !path.exists() {
                not_founds.insert(asset);
                continue;
            }

            assets.insert(asset.clone());

            if is_icon(&asset) {
                continue;
            }
            if is_hybrid_asset(&asset) {
                self.collect_hybrid_dependencies(&path, &mut queue);
            } else if is_script_asset(&asset) {
                self.collect_script_dependencies(&path, &mut queue);
            }
        }

        AssetsResult { assets, not_founds }
    }

    fn collect_hybrid_dependencies(&self, path: &Path, queue: &mut VecDeque<String>) {
        let Ok(bytes) = fs::read(path) else {
            return;
        };

        let content = String::from_utf8_lossy(&bytes);
        let content = self.garble_regex.replace_all(&content, "");

        for regex in &self.asset_regexes {
            for m in regex.find_iter(&content) {
                queue.push_back(m.as_str().to_string());
            }
        }
    }

    fn collect_script_dependencies(&self, path: &Path, queue: &mut VecDeque<String>) {
        let Ok(content) = fs::read_to_string(path) else {
            return;
        };

        for captures in self.imported_path_regex.captures_iter(&content) {
            if let Some(path) = captures.get(1) {
                queue.push_back(path.as_str().to_string());
            }
        }
    }
}

fn normalize_path(path: &str) -> String {
    path.replace('\\', "/")
}
