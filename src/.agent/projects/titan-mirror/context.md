# 📱 TitanMirror - Project Context

## Overview

| Field | Value |
|-------|-------|
| **Name** | TitanMirror |
| **Type** | PC-to-Phone Mirroring App |
| **Status** | ✅ Core Working (80%) |
| **Priority** | � High |
| **Last Updated** | 2026-01-13 |

---

## 🎯 Goals

- ✅ Mirror หน้าจอมือถือไป PC แบบ real-time
- 🔄 รองรับ touch input จาก PC (Accessibility Service - In Progress)
- ✅ Connection ผ่าน WiFi (Socket.IO)

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Desktop | Electron + Express + Socket.IO |
| Mobile | Android (Kotlin) |
| Protocol | Socket.IO over WiFi |
| Screen Capture | MediaProjection API |

---

## 📁 Key Files

### Desktop
| File | Purpose |
|------|---------|
| `TitanMirror-Desktop/main.js` | Electron main process + Socket.IO server |
| `TitanMirror-Desktop/renderer/renderer.js` | UI logic, canvas rendering |
| `TitanMirror-Desktop/renderer/index.html` | UI layout |
| `TitanMirror-Desktop/renderer/styles.css` | Styling |

### Android
| File | Purpose |
|------|---------|
| `ScreenCaptureService.kt` | MediaProjection capture + frame emission |
| `SocketManager.kt` | Socket.IO connection + device registration |
| `MirrorActivity.kt` | Mirror UI + service control |
| `MainActivity.kt` | Connection + QR scanning |

---

## ✅ Completed Features

- [x] QR code generation for connection
- [x] WiFi connection via Socket.IO
- [x] Screen capture with MediaProjection
- [x] Frame transmission (Base64 JPEG)
- [x] Real-time rendering on PC canvas
- [x] Presentation Mode (fullscreen, zoom, pan)
- [x] Android 14 compatibility fix
- [x] Remote logging (Android → PC console)

---

## 🔄 In Progress

- [ ] Remote control via Accessibility Service
- [ ] Touch/click events from PC to phone

---

## ❌ Known Issues (Resolved)

1. ~~**Black screen on Android 14**~~ → Fixed: startForeground timing + intent extraction
2. ~~**Low FPS (~7)**~~ → Fixed: Increased to ~25 FPS
3. ~~**QR timeout no feedback**~~ → Fixed: Added loading states

---

## 📊 Performance Settings

| Setting | Value |
|---------|-------|
| Resolution | 480p (stable) |
| FPS | ~25 |
| JPEG Quality | 50% |
| ImageReader Buffer | 5 |

---

## 🔑 Key Learnings

1. **Android 14**: Must call `startForeground()` immediately in `onStartCommand()`
2. **Intent Parcelable**: Use explicit class for API 33+ (`getParcelableExtra("key", Intent::class.java)`)
3. **MediaProjection timing**: Add 1.5s delay before starting capture loop

---

> 📝 Last major update: Fixed black screen, added Presentation Mode, increased FPS
