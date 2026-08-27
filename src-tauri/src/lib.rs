// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod bme_assets_getter;
mod bme_assets_packer;
mod builtin;
mod reg;

use bme_assets_packer::{BmeAssetsPacker, PackResult};

#[tauri::command]
fn pack(
    output: String,
    root: String,
    folders: Vec<String>,
    extras: Vec<String>,
    icons: Vec<String>,
) -> PackResult {
    let packer = BmeAssetsPacker::new(output, root, folders, extras, icons)
        .expect("Failed to create BME assets packer");

    packer.pack().expect("Failed to pack assets")
}

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let window = app.get_webview_window("main").expect("no main window");
            let _ = window.unminimize();
            let _ = window.set_focus();
        }))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![pack])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
