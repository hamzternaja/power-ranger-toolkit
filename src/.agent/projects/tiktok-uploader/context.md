# 📱 TikTok Auto-Uploader - Project Context

## Overview

| Field | Value |
|-------|-------|
| **Name** | TikTok Auto-Uploader |
| **Type** | Chrome Extension + Node.js Server |
| **Status** | 🔄 In Progress (70%) |
| **Priority** | 🔴 High |

---

## 🎯 Goals

- Upload วิดีโอ TikTok อัตโนมัติ
- Round-robin upload จากหลาย folders
- Track upload status

---

## 🛠️ Tech Stack

```
Extension: Chrome Manifest V3
Server:    Node.js + Express
Storage:   Local file system
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `extension/sidepanel.js` | UI logic |
| `extension/background.js` | Service worker |
| `file-server/server.js` | Main server |

---

## ✅ Completed Features

- [x] Basic upload functionality
- [x] Multiple folder support
- [x] Exclude Uploaded folder from scan

---

## 🔄 In Progress

- [ ] pendingCount refresh after upload
- [ ] Better error handling

---

## ❌ Known Issues

1. **Round-robin ไม่สมบูรณ์** - บางครั้ง upload จาก folder เดียวซ้ำๆ
2. **UI ไม่ refresh** - ต้อง refresh manual

---

> 📝 อัพเดทไฟล์นี้เมื่อ status เปลี่ยน
