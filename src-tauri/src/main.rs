// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time;
use enigo::{Direction, Enigo, Key, Keyboard, Settings};
use tauri::{Listener, Manager, TitleBarStyle};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
pub const SPOTLIGHT_LABEL: &str = "spotlight";

#[tauri::command]
fn my_custom_command() {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    enigo.text("ok");
    println!("I was invoked from JavaScript!");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![my_custom_command])
        .setup(|app| {
            let handle = app.app_handle();

            let webview_url = tauri::WebviewUrl::App("spotlight".into());
            let win_builder = tauri::WebviewWindowBuilder::new(app, SPOTLIGHT_LABEL, webview_url)
                .title("Spotlight")
                .inner_size(2600.0, 2600.0)
                .decorations(false)
                .transparent(true)
                .focused(false);

            let window = win_builder.build().unwrap();

            let spotlight_window = window.clone();

            // Define your custom panel type
            // tauri_panel! {
            //     panel!(ConvertedPanel {
            //         config: {
            //             canBecomeKeyWindow: false,
            //             isFloatingPanel: true
            //         }
            //     })
            // }

            // // Convert existing window to your custom panel type
            // // let window = app.get_webview_window(SPOTLIGHT_LABEL).unwrap();
            // let spotlight_window = window.to_panel::<ConvertedPanel>()?;
            // panel.show();

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
                                            let mut enigo =
                                                Enigo::new(&Settings::default()).unwrap();
                                            enigo.key(Key::Meta, Direction::Press);
                                            enigo.key(Key::Tab, Direction::Click);
                                            enigo.key(Key::Meta, Direction::Release);
                                            std::thread::sleep(std::time::Duration::from_secs(1));
                                            enigo.text("it's over");
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
            window.hide();
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
