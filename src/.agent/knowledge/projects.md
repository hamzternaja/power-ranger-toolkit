# 📁 Project Database

> รายละเอียดโปรเจกต์ทั้งหมด — ใช้อ้างอิงเมื่อทำงาน

---

## 1. TitanMirror 📱➡️🖥️

### Overview
| Field | Value |
|-------|-------|
| **สถานะ** | 🔄 In Progress |
| **ประเภท** | Desktop + Mobile App |
| **เป้าหมาย** | Mirror หน้าจอมือถือไป PC แบบ real-time |

### Tech Stack
```
Desktop:  Electron (JavaScript)
Mobile:   Android (Kotlin/Java)
Protocol: WebUSB / ADB / WiFi
```

### File Structure
```
📁 TitanMirror/
   📁 desktop/          ← Electron app
   📁 android/          ← Android app
   📁 shared/           ← Shared utilities
```

### Known Issues
| Issue | Status | Solution |
|-------|--------|----------|
| PC-to-phone connection ไม่ทำงาน | ❌ Open | กำลังหาทาง |
| QR connection timeout | ❌ Open | - |

### Key Files to Check
- Desktop main: `desktop/src/main.js`
- Connection handler: `desktop/src/connection/`
- Android service: `android/app/src/main/java/.../MirrorService.kt`

---

## 2. TikTok Auto-Uploader 📤

### Overview
| Field | Value |
|-------|-------|
| **สถานะ** | 🔄 In Progress |
| **ประเภท** | Chrome Extension + Local Server |
| **เป้าหมาย** | Upload วิดีโอ TikTok อัตโนมัติแบบ round-robin |

### Tech Stack
```
Extension:  Chrome Extension (Manifest V3)
Backend:    Node.js Express server
Storage:    Local file system
```

### File Structure
```
📁 tiktok-uploader/
   📁 extension/
      📄 manifest.json
      📄 sidepanel.js     ← UI logic
      📄 background.js    ← Service worker
   📁 file-server/
      📄 server.js        ← ⚠️ Main server file
```

### Known Issues
| Issue | Status | Solution |
|-------|--------|----------|
| Round-robin ไม่ทำงาน | ✅ Fixed | Track index per folder |
| นับไฟล์ใน Uploaded/ ซ้ำ | ✅ Fixed | Exclude `Uploaded/` in scanFolder |
| pendingCount ไม่ update | 🔄 Testing | Refresh after file move |

### Key Functions
```javascript
// file-server/server.js
scanFolder()        // Scan videos in folder
moveToUploaded()    // Move file after upload
getNextVideo()      // Round-robin selection
```

---

## 3. Self-Improvement Engine (PSI) 🤖

### Overview
| Field | Value |
|-------|-------|
| **สถานะ** | 🔄 In Progress |
| **ประเภท** | Multi-Agent AI System |
| **เป้าหมาย** | AI agents ที่เรียนรู้และพัฒนาตัวเองได้ |

### Tech Stack
```
Backend:    Python (Flask)
Database:   ChromaDB (Vector DB for RAG)
Frontend:   HTML/CSS/JS
Terminal:   PTY (pseudo-terminal)
AI:         Claude CLI
```

### File Structure
```
📁 psi/
   📄 app.py              ← Flask main
   📄 pty_manager.py      ← Terminal management
   📁 tools/
      📄 search.py        ← RAG search tool
   📁 memory/
      📄 projects.json
      📄 chromadb/        ← Vector database
```

### Known Issues
| Issue | Status | Solution |
|-------|--------|----------|
| Terminal แสดงหน้าจอว่าง | ✅ Fixed | Check PTY output buffering |
| Agent 3 bug | 🔄 Investigating | Check pty_manager |
| Agent busy false positive | ✅ Fixed | Handle "not found" as idle |
| Learning loop stuck | 🔄 Testing | Debug harvest_completed_missions |

### Key Concepts
```
RAG System:
- Index: เก็บ code จาก solved missions
- Query: ค้นหา relevant past solutions
- Inject: ใช้ knowledge ช่วย agent ใหม่

Multi-Agent:
- Orchestrator: แจกงานให้ workers
- Workers: Claude CLI instances
- Spawner: สร้าง agent ใหม่ตามต้องการ
```

---

## 📊 Project Status Summary

| Project | Progress | Priority |
|---------|----------|----------|
| TitanMirror | 40% | 🟡 Medium |
| TikTok Uploader | 70% | 🔴 High |
| PSI Engine | 60% | 🟡 Medium |

---

> 💡 **อัพเดทไฟล์นี้เมื่อ**:
> - เพิ่มโปรเจกต์ใหม่
> - แก้ปัญหาสำเร็จ (เปลี่ยน status)
> - ค้นพบ issue ใหม่
