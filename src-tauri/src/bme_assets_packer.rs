use serde::Serialize;
use std::{
    fs::{self, File},
    io::{self, Read, Write},
    path::{Path, PathBuf},
};

use zip::{write::SimpleFileOptions, CompressionMethod, ZipWriter};

use crate::bme_assets_getter::{AssetsResult, BmeAssetsGetter};

#[derive(Debug, Serialize)]
pub struct PackResult {
    pub assets: Vec<String>,
    pub not_found: Vec<String>,
    pub zip_size: u64,
}

pub struct BmeAssetsPacker {
    pub output_dir: PathBuf,
    pub zip_name: String,
    pub assets_getter: BmeAssetsGetter,
}

impl BmeAssetsPacker {
    pub fn new(
        output_dir: impl Into<PathBuf>,
        root: impl Into<PathBuf>,
        folders: Vec<String>,
        extras: Vec<String>,
        icons: Vec<String>,
    ) -> io::Result<Self> {
        let assets_getter = BmeAssetsGetter::new(root, folders, extras, icons)?;

        Ok(Self {
            output_dir: output_dir.into(),
            zip_name: "Assets.zip".to_string(),
            assets_getter,
        })
    }

    pub fn pack(&self) -> io::Result<PackResult> {
        fs::create_dir_all(&self.output_dir)?;

        let zip_path = self.output_dir.join(&self.zip_name);

        let file = File::create(&zip_path)?;
        let mut archive = ZipWriter::new(file);

        let options = SimpleFileOptions::default()
            .compression_method(CompressionMethod::Deflated)
            .compression_level(Some(9));

        let AssetsResult { assets, not_founds } = self.assets_getter.all_assets();

        let mut not_found = not_founds;

        let zip_dir = self.assets_getter.root.parent().unwrap_or(Path::new("."));

        for asset in &assets {
            let asset_path = self.assets_getter.root.join(asset);

            if !asset_path.exists() {
                not_found.insert(asset.clone());
                continue;
            }

            let zip_name = relative_path(zip_dir, &asset_path);

            if asset_path
                .extension()
                .map(|ext| ext == "js")
                .unwrap_or(false)
            {
                const TS_NOCHECK: &str = "// @ts-nocheck\n";

                let mut content = fs::read_to_string(&asset_path)?;

                if !content.starts_with(TS_NOCHECK) {
                    content = format!("{}{}", TS_NOCHECK, content);
                }

                archive.start_file(&zip_name, options)?;
                archive.write_all(content.as_bytes())?;
            } else {
                archive.start_file(&zip_name, options)?;

                let mut input = File::open(&asset_path)?;
                let mut buffer = Vec::new();

                input.read_to_end(&mut buffer)?;
                archive.write_all(&buffer)?;
            }
        }

        let file = archive.finish()?;
        let zip_size = file.metadata()?.len();

        Ok(PackResult {
            assets: assets.into_iter().collect(),
            not_found: not_found.into_iter().collect(),
            zip_size,
        })
    }
}

fn relative_path(base: &Path, path: &Path) -> String {
    match path.strip_prefix(base) {
        Ok(relative) => relative.to_string_lossy().replace('\\', "/"),

        Err(_) => path.to_string_lossy().replace('\\', "/"),
    }
}
