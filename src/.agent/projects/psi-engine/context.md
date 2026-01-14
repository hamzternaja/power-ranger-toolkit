# 🤖 PSI Engine - Project Context

## Overview

| Field | Value |
|-------|-------|
| **Name** | Self-Improvement Engine (PSI) |
| **Type** | Multi-Agent AI System |
| **Status** | 🔄 In Progress (60%) |
| **Priority** | 🟡 Medium |

---

## 🎯 Goals

- AI agents ที่สามารถเรียนรู้และพัฒนาตัวเองได้
- Multi-agent collaboration
- Knowledge harvesting จาก completed missions

---

## 🛠️ Tech Stack

```
Backend:   Python + Flask
Database:  ChromaDB (Vector DB)
Frontend:  HTML/CSS/JS
Terminal:  PTY (pseudo-terminal)
AI:        Claude CLI
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app.py` | Flask main |
| `pty_manager.py` | Terminal management |
| `tools/search.py` | RAG search |

---

## ✅ Completed Features

- [x] Basic multi-agent spawning
- [x] Terminal management
- [x] ChromaDB integration

---

## 🔄 In Progress

- [ ] Agent 3 bug fix
- [ ] Learning loop debugging
- [ ] Knowledge harvesting

---

## ❌ Known Issues

1. **Agent 3 malfunction** - ต้องตรวจสอบ pty_manager
2. **Terminal blank** - บางครั้งไม่แสดง output
3. **Busy false positive** - บอกว่า busy ทั้งที่ยังไม่เริ่ม

---

> 📝 อัพเดทไฟล์นี้เมื่อ status เปลี่ยน
