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
fn bring_to_foreground(app_handle: tauri::AppHandle) -> Result<(), String> {
    if let Some(main_window) = app_handle.get_webview_window("main") {
        println!("Bringing main window to foreground...");
        
        #[cfg(target_os = "windows")]
        {
            // Windows specific - more aggressive approach
            main_window.unminimize().unwrap_or_default();
            main_window.show().unwrap_or_default();
            
            // Try multiple times with different approaches
            for i in 0..3 {
                println!("Windows focus attempt {}", i + 1);
                main_window.set_focus().unwrap_or_default();
                main_window.set_always_on_top(true).unwrap_or_default();
                std::thread::sleep(std::time::Duration::from_millis(100));
                main_window.set_always_on_top(false).unwrap_or_default();
                main_window.set_focus().unwrap_or_default();
                std::thread::sleep(std::time::Duration::from_millis(50));
            }
        }
        
        #[cfg(target_os = "macos")]
        {
            // macOS specific - use NSApplication activation
            main_window.unminimize().unwrap_or_default();
            main_window.show().unwrap_or_default();
            
            // Try multiple focus attempts
            for i in 0..3 {
                println!("macOS focus attempt {}", i + 1);
                main_window.set_focus().unwrap_or_default();
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
            
            // Force to front with always on top
            main_window.set_always_on_top(true).unwrap_or_default();
            std::thread::sleep(std::time::Duration::from_millis(200));
            main_window.set_always_on_top(false).unwrap_or_default();
            main_window.set_focus().unwrap_or_default();
        }
        
        #[cfg(target_os = "linux")]
        {
            main_window.unminimize().unwrap_or_default();
            main_window.show().unwrap_or_default();
            main_window.set_focus().unwrap_or_default();
            std::thread::sleep(std::time::Duration::from_millis(100));
            main_window.set_focus().unwrap_or_default();
        }
        
        println!("Main window brought to foreground");
        Ok(())
    } else {
        Err("Main window not found".to_string())
    }
}

#[tauri::command]
fn activate_app(app_handle: tauri::AppHandle) -> Result<(), String> {
    println!("Activating app...");
    
    // Try to get the main window
    let main_window = app_handle.get_webview_window("main");
    
    if let Some(window) = main_window {
        // Main window exists, just bring it to front
        println!("Main window exists, bringing to foreground...");
        window.unminimize().unwrap_or_default();
        window.show().unwrap_or_default();
        window.request_user_attention(Some(tauri::UserAttentionType::Informational)).unwrap_or_default();
        
        #[cfg(target_os = "macos")]
        {
            window.set_focus().unwrap_or_default();
            std::thread::sleep(std::time::Duration::from_millis(100));
            window.set_focus().unwrap_or_default();
        }
        
        #[cfg(target_os = "windows")]
        {
            window.set_focus().unwrap_or_default();
            window.set_always_on_top(true).unwrap_or_default();
            std::thread::sleep(std::time::Duration::from_millis(200));
            window.set_always_on_top(false).unwrap_or_default();
        }
        
        #[cfg(target_os = "linux")]
        {
            window.set_focus().unwrap_or_default();
        }
        
        println!("Existing main window activated");
    } else {
        // No main window exists, create a new one
        println!("No main window found, creating new main window...");
        
        let webview_url = tauri::WebviewUrl::App("index.html".into());
        match tauri::WebviewWindowBuilder::new(&app_handle, "main", webview_url)
            .title("E-Prompt Assistant")
            .inner_size(1200.0, 800.0)
            .center()
            .build() 
        {
            Ok(new_window) => {
                new_window.show().unwrap_or_default();
                new_window.set_focus().unwrap_or_default();
                println!("New main window created and focused");
            }
            Err(e) => {
                eprintln!("Failed to create new main window: {:?}", e);
                return Err(format!("Failed to create new main window: {:?}", e));
            }
        }
    }
    
    println!("App activation completed");
    Ok(())
}

#[tauri::command]
fn ensure_main_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    println!("Ensuring main window exists...");
    
    if app_handle.get_webview_window("main").is_none() {
        println!("Creating new main window...");
        let webview_url = tauri::WebviewUrl::App("index.html".into());
        match tauri::WebviewWindowBuilder::new(&app_handle, "main", webview_url)
            .title("E-Prompt Assistant")
            .inner_size(1200.0, 800.0)
            .center()
            .build() 
        {
            Ok(new_window) => {
                new_window.show().unwrap_or_default();
                new_window.set_focus().unwrap_or_default();
                println!("New main window created successfully");
                Ok(())
            }
            Err(e) => {
                eprintln!("Failed to create main window: {:?}", e);
                Err(format!("Failed to create main window: {:?}", e))
            }
        }
    } else {
        println!("Main window already exists");
        Ok(())
    }
}

#[tauri::command]
fn hide_spotlight(app_handle: tauri::AppHandle) -> Result<(), String> {
    // Try to get the spotlight window directly
    if let Some(spotlight_window) = app_handle.get_webview_window(SPOTLIGHT_LABEL) {
        // Hide the spotlight window
        spotlight_window.hide().unwrap_or_default();
        println!("Spotlight window hidden programmatically");
        
        // Emit the event first, then try to activate the main window
        let payload = serde_json::json!({});
        if let Err(e) = app_handle.emit("spotlight-hidden", payload) {
            eprintln!("Failed to emit spotlight-hidden event: {:?}", e);
        } else {
            println!("Spotlight-hidden event emitted successfully");
        }
        
        // Try to activate or create the main window after a short delay
        let app_handle_clone = app_handle.clone();
        std::thread::spawn(move || {
            std::thread::sleep(std::time::Duration::from_millis(200)); // Back to shorter delay
            
            if let Some(main_window) = app_handle_clone.get_webview_window("main") {
                // Main window exists, activate it
                main_window.unminimize().unwrap_or_default();
                main_window.show().unwrap_or_default();
                main_window.set_focus().unwrap_or_default();
                
                // Try the always-on-top trick
                main_window.set_always_on_top(true).unwrap_or_default();
                std::thread::sleep(std::time::Duration::from_millis(150));
                main_window.set_always_on_top(false).unwrap_or_default();
                main_window.set_focus().unwrap_or_default();
                
                println!("Existing main window activated in background thread");
            } else {
                // No main window exists, create a new one
                println!("No main window found in background thread, creating new one...");
                let webview_url = tauri::WebviewUrl::App("index.html".into());
                if let Ok(new_window) = tauri::WebviewWindowBuilder::new(&app_handle_clone, "main", webview_url)
                    .title("E-Prompt Assistant")
                    .inner_size(1200.0, 800.0)
                    .center()
                    .build() 
                {
                    new_window.show().unwrap_or_default();
                    new_window.set_focus().unwrap_or_default();
                    println!("New main window created in background thread");
                    
                    // Give the new window extra time to fully initialize
                    std::thread::sleep(std::time::Duration::from_millis(1000));
                    new_window.set_focus().unwrap_or_default();
                    
                    // IMPORTANT: Emit the spotlight-hidden event again for the new window
                    // This is crucial when the main window was recreated after being closed
                    let payload = serde_json::json!({});
                    if let Err(e) = app_handle_clone.emit("spotlight-hidden", payload) {
                        eprintln!("Failed to emit spotlight-hidden event for new window: {:?}", e);
                    } else {
                        println!("Spotlight-hidden event emitted for new main window");
                    }
                }
            }
        });
        
        Ok(())
    } else {
        Err("Spotlight window not found".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![my_custom_command, hide_spotlight, bring_to_foreground, activate_app, ensure_main_window])
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
                                                // Cross-platform window focusing with better foreground handling
                                                #[cfg(target_os = "windows")]
                                                {
                                                    // On Windows, we might need to unminimize first
                                                    main_window_ref.unminimize().unwrap_or_default();
                                                    // Then show the window
                                                    main_window_ref.show().unwrap_or_default();
                                                    // Request focus
                                                    main_window_ref.set_focus().unwrap_or_default();
                                                    // Additional Windows-specific focus attempt
                                                    main_window_ref.set_always_on_top(true).unwrap_or_default();
                                                    std::thread::sleep(std::time::Duration::from_millis(50));
                                                    main_window_ref.set_always_on_top(false).unwrap_or_default();
                                                    // Force window to foreground
                                                    main_window_ref.set_focus().unwrap_or_default();
                                                }
                                                
                                                #[cfg(target_os = "macos")]
                                                {
                                                    // For macOS, we need to properly activate the application
                                                    main_window_ref.unminimize().unwrap_or_default();
                                                    main_window_ref.show().unwrap_or_default();
                                                    // Set focus multiple times to ensure it works
                                                    main_window_ref.set_focus().unwrap_or_default();
                                                    std::thread::sleep(std::time::Duration::from_millis(50));
                                                    main_window_ref.set_focus().unwrap_or_default();
                                                    // On macOS, we might need to use set_always_on_top briefly to bring to front
                                                    main_window_ref.set_always_on_top(true).unwrap_or_default();
                                                    std::thread::sleep(std::time::Duration::from_millis(100));
                                                    main_window_ref.set_always_on_top(false).unwrap_or_default();
                                                }
                                                
                                                #[cfg(target_os = "linux")]
                                                {
                                                    // For Linux
                                                    main_window_ref.unminimize().unwrap_or_default();
                                                    main_window_ref.show().unwrap_or_default();
                                                    main_window_ref.set_focus().unwrap_or_default();
                                                }
                                                
                                                println!("Main window focused after hiding spotlight");
                                            } else {
                                                println!("No main window found to focus after hiding spotlight");
                                            }
                                        } else {
                                            // Show and focus spotlight if it's not focused
                                            // Don't create main window here - only create it when needed (when hiding spotlight with selection)
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
