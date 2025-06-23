# Tauri Integration Guide

Advanced Tauri v2 integration for design tokens, security, auto-updates, and CSP configuration for desktop delivery.

## Overview

This guide covers Tauri desktop app integration with design tokens, security best practices, auto-updater configuration,
and Content Security Policy (CSP) implementation for the Mimic design system.

## Table of Contents

- [CSP and Security Configuration](#csp-and-security-configuration)
- [Auto-Updater Plugin](#auto-updater-plugin)
- [Frontend Folder Configuration](#frontend-folder-configuration)
- [Token Integration](#token-integration)
- [Security Checklist](#security-checklist)
- [Advanced Configuration](#advanced-configuration)

## CSP and Security Configuration

### Strict CSP with Script Hashes

Tauri automatically injects strict CSP with script hashes. Keep HTML meta tag blank to enforce default policy:

```html
<!-- src/index.html - Keep CSP meta tag empty for auto-injection -->
<!DOCTYPE html>
<html>
<head>
  <!-- ❌ Don't manually set CSP - let Tauri handle it -->
  <!-- <meta http-equiv="Content-Security-Policy" content="..."> -->
  
  <!-- ✅ Let Tauri inject CSP automatically -->
  <meta http-equiv="Content-Security-Policy" content="">
  
  <title>Mimic Design System</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

Configure CSP in Tauri configuration:

```json
{
  "tauri": {
    "security": {
      "csp": {
        "default-src": "'self'",
        "style-src": "'self' 'unsafe-inline'",
        "script-src": "'self' 'wasm-unsafe-eval'",
        "img-src": "'self' data: blob:",
        "font-src": "'self' data:",
        "connect-src": "'self' https://api.mimic.design wss://api.mimic.design",
        "media-src": "'self'",
        "object-src": "'none'",
        "base-uri": "'self'",
        "frame-ancestors": "'none'",
        "form-action": "'self'"
      },
      "dangerousDisableAssetCspModification": false,
      "assetProtocol": {
        "enable": true,
        "scope": ["**"]
      },
      "allowlist": {
        "all": false,
        "shell": {
          "all": false,
          "open": true,
          "scope": [
            {
              "name": "browser",
              "cmd": "open",
              "args": {
                "url": {
                  "validator": "^https://github\\.com/.*|^https://design\\.penpot\\.app/.*"
                }
              }
            }
          ]
        },
        "fs": {
          "all": false,
          "readFile": true,
          "writeFile": true,
          "scope": [
            "$APPDATA/mimic/**",
            "$DOCUMENT/mimic/**",
            "$APPCONFIG/mimic/**"
          ]
        },
        "http": {
          "all": false,
          "request": true,
          "scope": [
            "https://api.mimic.design/**",
            "https://cdn.mimic.design/**",
            "https://github.com/IAmJonoBo/mimic/**"
          ]
        },
        "notification": {
          "all": true
        },
        "dialog": {
          "all": false,
          "ask": true,
          "confirm": true,
          "message": true,
          "open": true,
          "save": true
        },
        "updater": {
          "active": true
        }
      }
    }
  }
}
```

## Auto-Updater Plugin

### Plugin Installation and Configuration

Add the updater plugin to Cargo.toml:

```toml
# src-tauri/Cargo.toml
[dependencies]
tauri = { version = "2.0", features = ["updater"] }
tauri-plugin-updater = "2.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1", features = ["full"] }
```

Configure updater in main.rs:

```rust
// src-tauri/src/main.rs
use tauri::Manager;
use tauri_plugin_updater::UpdaterExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            // Auto-check for updates on startup
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = check_for_updates(handle).await {
                    eprintln!("Failed to check for updates: {}", e);
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            check_for_updates_command,
            install_update_command,
            get_app_version
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn check_for_updates(app: tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let updater = app.updater()?;
    
    if let Some(update) = updater.check().await? {
        println!("Update available: {}", update.version);
        
        // Notify frontend about available update
        app.emit_all("update-available", &update.version)?;
        
        // Optional: Auto-download update
        let mut downloaded = 0;
        update.download_and_install(
            |chunk_length, content_length| {
                downloaded += chunk_length;
                let progress = (downloaded as f64 / content_length.unwrap_or(1) as f64) * 100.0;
                println!("Download progress: {:.2}%", progress);
            },
            || {
                println!("Update downloaded, restarting...");
            }
        ).await?;
    } else {
        println!("No updates available");
    }
    
    Ok(())
}

#[tauri::command]
async fn check_for_updates_command(app: tauri::AppHandle) -> Result<String, String> {
    match check_for_updates(app).await {
        Ok(_) => Ok("Update check completed".to_string()),
        Err(e) => Err(format!("Update check failed: {}", e))
    }
}

#[tauri::command]
async fn install_update_command(app: tauri::AppHandle) -> Result<(), String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    
    if let Some(update) = updater.check().await.map_err(|e| e.to_string())? {
        update.download_and_install(
            |_chunk_length, _content_length| {
                // Progress callback
            },
            || {
                // Download completed callback
            }
        ).await.map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
```

### Update Manifest Configuration

Configure updater endpoints in tauri.conf.json:

```json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://github.com/IAmJonoBo/mimic/releases/latest/download/mimic-updater.json",
        "https://cdn.mimic.design/releases/latest/mimic-updater.json"
      ],
      "dialog": true,
      "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmljIGFwcCBwdWJsaWMga2V5CkZDUUZBUEh2MzJMdWJ5Z..."
    }
  }
}
```

Create update manifest for GitHub Releases:

```json
{
  "version": "v1.0.1",
  "notes": "Bug fixes and performance improvements",
  "pub_date": "2025-06-23T10:30:00Z",
  "platforms": {
    "darwin-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkK...",
      "url": "https://github.com/IAmJonoBo/mimic/releases/download/v1.0.1/mimic_1.0.1_x64.dmg"
    },
    "darwin-aarch64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkK...",
      "url": "https://github.com/IAmJonoBo/mimic/releases/download/v1.0.1/mimic_1.0.1_aarch64.dmg"
    },
    "linux-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkK...",
      "url": "https://github.com/IAmJonoBo/mimic/releases/download/v1.0.1/mimic_1.0.1_amd64.AppImage"
    },
    "windows-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkK...",
      "url": "https://github.com/IAmJonoBo/mimic/releases/download/v1.0.1/mimic_1.0.1_x64-setup.exe"
    }
  }
}
```

### Frontend Updater Integration

Implement updater UI in the frontend:

```typescript
// src/lib/updater.ts
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { ask, message } from '@tauri-apps/api/dialog';

export interface UpdateInfo {
  version: string;
  notes: string;
  available: boolean;
}

export class UpdateManager {
  private static instance: UpdateManager;
  
  static getInstance(): UpdateManager {
    if (!UpdateManager.instance) {
      UpdateManager.instance = new UpdateManager();
    }
    return UpdateManager.instance;
  }
  
  async initialize() {
    // Listen for update events
    await listen('update-available', async (event) => {
      const version = event.payload as string;
      const shouldUpdate = await ask(
        `A new version (${version}) is available. Would you like to update now?`,
        { title: 'Update Available', type: 'info' }
      );
      
      if (shouldUpdate) {
        await this.installUpdate();
      }
    });
    
    // Check for updates on app startup
    await this.checkForUpdates();
  }
  
  async checkForUpdates(): Promise<void> {
    try {
      await invoke('check_for_updates_command');
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }
  
  async installUpdate(): Promise<void> {
    try {
      await message('Update will be downloaded and installed. The app will restart automatically.', {
        title: 'Installing Update',
        type: 'info'
      });
      
      await invoke('install_update_command');
    } catch (error) {
      console.error('Failed to install update:', error);
      await message(`Failed to install update: ${error}`, {
        title: 'Update Error',
        type: 'error'
      });
    }
  }
  
  async getAppVersion(): Promise<string> {
    return await invoke('get_app_version');
  }
}

// Auto-initialize updater
if (typeof window !== 'undefined') {
  UpdateManager.getInstance().initialize();
}
```

## Frontend Folder Configuration

### Development and Build Configuration

Point Tauri to Qwik build output in tauri.conf.json:

```json
{
  "build": {
    "beforeDevCommand": "nx run web:serve",
    "beforeBuildCommand": "nx run web:build",
    "devPath": "http://localhost:5173",
    "distDir": "../../../dist/apps/web",
    "withGlobalTauri": false
  },
  "package": {
    "productName": "Mimic Design System",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "app.mimic.design",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "resources": [
        "tokens/**",
        "assets/**"
      ],
      "externalBin": [],
      "copyright": "",
      "category": "DeveloperTool",
      "shortDescription": "Open-source design system",
      "longDescription": "Mimic is an open-source design system built with design tokens for consistent, scalable UI development."
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "Mimic Design System",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

### Nx Integration for Tauri Build

Configure Nx to work with Tauri builds:

```json
{
  "name": "build-tauri",
  "executor": "@nx/run-commands:run-commands",
  "options": {
    "command": "tauri build",
    "cwd": "apps/desktop/src-tauri"
  },
  "dependsOn": ["build"]
}
```

Tauri development script:

```json
{
  "name": "dev-tauri",
  "executor": "@nx/run-commands:run-commands",
  "options": {
    "command": "tauri dev",
    "cwd": "apps/desktop/src-tauri"
  },
  "dependsOn": ["serve"]
}
```
