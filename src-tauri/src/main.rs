// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Listener, Manager, TitleBarStyle};
use tauri_nspanel::{
    cocoa::{self, appkit::NSWindowCollectionBehavior, base::id},
    objc::msg_send,
    panel_delegate, WebviewWindowExt,
};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
pub const SPOTLIGHT_LABEL: &str = "spotlight";

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.app_handle();

            let webview_url = tauri::WebviewUrl::App("../../src/spotlight/index.html".into());
            let win_builder = tauri::WebviewWindowBuilder::new(app, SPOTLIGHT_LABEL, webview_url)
                .title("Spotlight")
                .inner_size(800.0, 600.0)
                .decorations(false)
                .transparent(true)
                .focused(false);

            let window = win_builder.build().unwrap();

            let spotlight_window = window.clone();

            #[cfg(desktop)]
            {
                let ctrl_n_shortcut = Shortcut::new(Some(Modifiers::CONTROL), Code::KeyK);
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |app_handle, shortcut, event| {
                            let main_window = app_handle.get_webview_window("main").unwrap();
                            let mut main_window_was_focused: bool = false;
                            if shortcut == &ctrl_n_shortcut {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        if spotlight_window.is_focused().unwrap() {
                                            main_window_was_focused =
                                                main_window.is_focused().unwrap();
                                            spotlight_window.hide().unwrap();
                                            if !main_window_was_focused {
                                                if main_window.is_visible().unwrap() {
                                                    main_window.hide().unwrap();
                                                    main_window.minimize().unwrap();
                                                }
                                            }
                                        } else {
                                            spotlight_window.show().unwrap();
                                            spotlight_window.set_focus().unwrap();
                                        }
                                    }
                                    ShortcutState::Released => {}
                                }
                            }
                        })
                        .build(),
                )?;
                app.global_shortcut().register(ctrl_n_shortcut)?;
            }
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
