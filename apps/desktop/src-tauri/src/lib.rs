use tauri::Builder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
