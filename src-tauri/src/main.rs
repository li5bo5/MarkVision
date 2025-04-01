#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::path::PathBuf;
use std::fs;

// 检查是否为便携模式（当前目录是否有config文件夹）
fn is_portable_mode() -> bool {
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|path| path.parent().map(|p| p.to_path_buf()));
    
    if let Some(dir) = exe_dir {
        let config_dir = dir.join("config");
        return config_dir.exists() && config_dir.is_dir();
    }
    
    false
}

// 获取便携模式下的配置目录
fn get_portable_config_dir() -> Option<PathBuf> {
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|path| path.parent().map(|p| p.to_path_buf()))?;
    
    let config_dir = exe_dir.join("config");
    
    // 如果目录不存在，尝试创建
    if !config_dir.exists() {
        if let Err(_) = fs::create_dir_all(&config_dir) {
            return None;
        }
    }
    
    Some(config_dir)
}

// 获取便携模式下的数据目录
fn get_portable_data_dir() -> Option<PathBuf> {
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|path| path.parent().map(|p| p.to_path_buf()))?;
    
    let data_dir = exe_dir.join("data");
    
    // 如果目录不存在，尝试创建
    if !data_dir.exists() {
        if let Err(_) = fs::create_dir_all(&data_dir) {
            return None;
        }
    }
    
    Some(data_dir)
}

// 检查便携模式状态
#[tauri::command]
fn check_portable_mode() -> bool {
    is_portable_mode()
}

// 获取数据目录路径
#[tauri::command]
fn get_data_dir() -> String {
    if is_portable_mode() {
        get_portable_data_dir()
            .map(|path| path.to_string_lossy().to_string())
            .unwrap_or_else(|| "".to_string())
    } else {
        tauri::api::path::data_dir()
            .map(|path| path.to_string_lossy().to_string())
            .unwrap_or_else(|| "".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            check_portable_mode,
            get_data_dir
        ])
        .run(tauri::generate_context!())
        .expect("错误: 无法启动应用");
}