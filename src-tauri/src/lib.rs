// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use enigo::{Enigo, Keyboard, Settings};
use serde::Serialize;
use tauri::Emitter;
use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

#[derive(Serialize, Clone)]
struct PermissionMessage {
    title: String,
    message: String,
}

pub const SPOTLIGHT_LABEL: &str = "spotlight";

#[tauri::command]
fn my_custom_command(str: &str) -> Result<(), String> {
    match Enigo::new(&Settings::default()) {
        Ok(mut enigo) => {
            let _ = enigo.text(str);
            println!("Inserted: {:}", str);
            Ok(())
        }
        Err(e) => Err(format!(
            "Failed to create Enigo: {:?}. Please check if your app has Accessibility permissions.",
            e
        )),
    }
}

#[tauri::command]
fn hide_spotlight(app_handle: tauri::AppHandle) -> Result<(), String> {
    // Try to get the spotlight window directly
    if let Some(spotlight_window) = app_handle.get_webview_window(SPOTLIGHT_LABEL) {
        // Hide the spotlight window programmatically instead of using keyboard shortcuts
        spotlight_window.hide().unwrap_or_default();
        println!("Spotlight window hidden programmatically");
        
        // Try to focus the main window if it exists
        if let Some(main_window) = app_handle.get_webview_window("main") {
            main_window.show().unwrap_or_default();
            main_window.set_focus().unwrap_or_default();
            println!("Main window focused after hiding spotlight");
        }
        
        // Create a payload (empty for now, we'll use it from the AppLayout side)
        let payload = serde_json::json!({});
        
        // Emit an event when spotlight is hidden (the AppLayout component will listen for this)
        if let Err(e) = app_handle.emit("spotlight-hidden", payload) {
            eprintln!("Failed to emit spotlight-hidden event: {:?}", e);
        } else {
            println!("Spotlight-hidden event emitted successfully");
        }
        
        Ok(())
    } else {
        // If we can't find the spotlight window, return an error
        Err("Spotlight window not found".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![my_custom_command, hide_spotlight])
        .setup(|app| {
            // Removed unused handle variable
            
            // Create the spotlight window
            let webview_url = tauri::WebviewUrl::App("spotlight".into());
            let win_builder = tauri::WebviewWindowBuilder::new(app, SPOTLIGHT_LABEL, webview_url)
                .title("Spotlight")
                .inner_size(2600.0, 2600.0)
                .decorations(false)
                .transparent(true)
                .focused(false);

            let window = win_builder.build().unwrap();
            let spotlight_window = window.clone();
            
            #[cfg(desktop)]
            {
                // Check for macOS Accessibility permissions
                if cfg!(target_os = "macos") {
                    match Enigo::new(&Settings::default()) {
                        Ok(_) => {
                            println!("Accessibility permissions are granted. Application can simulate keyboard input.");
                        },
                        Err(_) => {
                            // Instead of using dialog API, emit an event to the frontend
                            if let Some(window) = app.get_webview_window(SPOTLIGHT_LABEL) {
                                // Emit an event that the frontend can listen to
                                let message = PermissionMessage {
                                    title: "Accessibility Permissions Required".to_string(),
                                    message: "This app requires Accessibility permissions to simulate keyboard input.\n\nPlease go to System Preferences > Security & Privacy > Privacy > Accessibility and enable this app.".to_string(),
                                };
                                let _ = window.emit("accessibility-permission-required", message);
                            }
                            
                            println!("\n==========================================================");
                            println!("IMPORTANT: This app requires Accessibility permissions.");
                            println!("Please go to System Preferences > Security & Privacy > Privacy > Accessibility");
                            println!("and enable the app to allow keyboard simulation.");
                            println!("==========================================================\n");
                        }
                    }
                }
                
                let ctrl_k_shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyK);
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |app_handle, shortcut, event| {
                            if shortcut == &ctrl_k_shortcut {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        // Try to get the main window if it exists
                                        let main_window = app_handle.get_webview_window("main");
                                        let mut main_window_was_focused = false;
                                        
                                        if let Some(main_window_ref) = &main_window {
                                            main_window_was_focused = main_window_ref.is_focused().unwrap_or(false);
                                        }
                                        
                                        if spotlight_window.is_focused().unwrap_or(false) {
                                            // Hide spotlight if it's focused
                                            spotlight_window.hide().unwrap_or_default();
                                            
                                            // Create payload for the event
                                            let payload = serde_json::json!({});
                                            
                                            // Emit a spotlight-hidden event
                                            if let Err(e) = app_handle.emit("spotlight-hidden", payload) {
                                                eprintln!("Failed to emit spotlight-hidden event from shortcut handler: {:?}", e);
                                            } else {
                                                println!("Spotlight-hidden event emitted from shortcut handler");
                                            }
                                            
                                            // After hiding spotlight, we want to make sure the main app stays visible
                                            // Focus the main window if it exists to ensure the app stays in the foreground
                                            if let Some(main_window_ref) = &main_window {
                                                // Make sure the main window is visible and focused
                                                main_window_ref.show().unwrap_or_default();
                                                main_window_ref.set_focus().unwrap_or_default();
                                                println!("Main window focused after hiding spotlight");
                                            } else {
                                                println!("No main window found to focus after hiding spotlight");
                                            }
                                        } else {
                                            // Show and focus spotlight if it's not focused
                                            spotlight_window.show().unwrap_or_default();
                                            spotlight_window.set_focus().unwrap_or_default();
                                        }
                                    }
                                    ShortcutState::Released => {
                                        // No action needed on release
                                    }
                                }
                            }
                        })
                        .build(),
                )?;

                app.global_shortcut().register(ctrl_k_shortcut)?;
            }
            
            // Initially hide the spotlight window
            window.hide().unwrap_or_default();
            
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
