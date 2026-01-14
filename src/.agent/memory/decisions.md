# 🏛️ Architectural Decisions

> การตัดสินใจสำคัญด้าน architecture — เพื่อความสอดคล้องในอนาคต

---

## Decision #1: File-based Knowledge Storage

**Date**: 2026-01-11
**Context**: ต้องการเก็บ knowledge ให้ Antigravity อ่านได้

**Options Considered**:
1. ❌ Database (SQLite, ChromaDB) - ซับซ้อน, ต้อง setup
2. ❌ External API - ต้อง internet, latency
3. ✅ **Markdown Files** - อ่านง่าย, version control ได้, ไม่ต้อง setup

**Decision**: ใช้ Markdown files ใน `.agent/` folder

**Consequences**:
- ✅ ง่ายต่อการแก้ไขด้วยมือ
- ✅ Git-friendly
- ❌ ค้นหายากถ้ามีข้อมูลเยอะ (ต้อง manual search)

---

## Decision #2: Flat Folder Structure

**Date**: 2026-01-11
**Context**: จัด organize knowledge files

**Options Considered**:
1. ❌ Deeply nested folders - ยากต่อการ navigate
2. ✅ **Flat structure with prefixes** - หาง่าย, clear

**Decision**: ใช้โครงสร้างแบน ระดับลึกไม่เกิน 2

```
.agent/
   knowledge/    ← Level 1
      *.md       ← Level 2 (max)
   memory/
      *.md
   projects/
      project-name/
         *.md
```

---

## Decision #3: Status Emoji Convention

**Date**: 2026-01-11
**Context**: แสดง status ใน markdown files

**Decision**: ใช้ emoji convention

| Emoji | Meaning |
|-------|---------|
| ⬜ | Pending |
| 🔄 | In Progress |
| ✅ | Done/Solved |
| ❌ | Failed/Blocked |
| 🟢 | Easy |
| 🟡 | Medium |
| 🔴 | Hard |

---

## Decision #4: User Rules via GEMINI.md

**Date**: 2026-01-11
**Context**: ต้องการให้ Antigravity อ่าน knowledge อัตโนมัติ

**Decision**: ใช้ GEMINI.md เป็น global user rules

**Location**: `C:\Users\chawa\.gemini\GEMINI.md`

---

## 📝 Template

```markdown
## Decision #N: [Title]

**Date**: YYYY-MM-DD
**Context**: [why this decision was needed]

**Options Considered**:
1. ❌ Option A - reason
2. ✅ **Option B** - reason (chosen)

**Decision**: [what was decided]

**Consequences**:
- ✅ Pro
- ❌ Con
```

---

> 💡 บันทึกทุก decision สำคัญเพื่อ reference ในอนาคต

---

## 📱 TikTok Uploader Decisions

---

## Decision #5: Chrome Extension + Local Server Architecture

**Date**: 2026-01-10
**Context**: ต้องการ upload วิดีโอ TikTok อัตโนมัติ

**Options Considered**:
1. ❌ Pure Extension - ไม่สามารถอ่านไฟล์จาก local disk ได้
2. ❌ Desktop App (Electron) - Heavy, ต้อง install
3. ✅ **Extension + Node.js Server** - Extension ทำ UI, Server ให้ไฟล์

**Decision**: ใช้ Chrome Extension (Manifest V3) + Node.js Express Server

**Consequences**:
- ✅ Extension อ่านไฟล์จาก server ได้
- ✅ Lightweight ไม่ต้อง install มาก
- ❌ ต้องรัน server แยก

---

## Decision #6: Round-Robin Folder Selection

**Date**: 2026-01-10
**Context**: ต้องการ upload จากหลาย folders อย่างเท่าเทียม

**Options Considered**:
1. ❌ Random - อาจได้ folder เดิมซ้ำๆ
2. ❌ Sequential - folder แรกหมดก่อนถึงจะไป folder ถัดไป
3. ✅ **Round-Robin** - สลับ folder ทีละตัว

**Decision**: ใช้ round-robin algorithm สลับ folder

**Consequences**:
- ✅ ทุก folder ได้รับการ upload เท่าเทียม
- ❌ ต้อง track current folder index

---

## 🤖 PSI Engine Decisions

---

## Decision #7: ChromaDB for Vector Storage

**Date**: 2026-01-09
**Context**: ต้องการเก็บ knowledge ให้ AI ค้นหาได้

**Options Considered**:
1. ❌ PostgreSQL + pgvector - ต้อง setup database
2. ❌ Pinecone - Cloud-based, มีค่าใช้จ่าย
3. ✅ **ChromaDB** - Local, ฟรี, Python native

**Decision**: ใช้ ChromaDB เป็น Vector Database

**Consequences**:
- ✅ Local, ไม่ต้อง internet
- ✅ ฟรี, ง่ายต่อการ setup
- ❌ Performance อาจไม่ดีเท่า cloud solutions สำหรับ data ขนาดใหญ่

---

## Decision #8: PTY for Terminal Management

**Date**: 2026-01-08
**Context**: ต้องการให้ AI agents รัน commands และดู output

**Options Considered**:
1. ❌ subprocess.run() - Blocking, ไม่เห็น output real-time
2. ❌ asyncio subprocess - Complex, หา bugs ยาก
3. ✅ **PTY (pseudo-terminal)** - เหมือน terminal จริง

**Decision**: ใช้ PTY สำหรับ terminal management

**Consequences**:
- ✅ เห็น output real-time
- ✅ รองรับ interactive commands
- ❌ Platform-specific (Linux/Mac vs Windows)
- ❌ ต้อง handle buffering อย่างระวัง

---

## 📱 TitanMirror Decisions

---

## Decision #9: Socket.IO over WebSocket

**Date**: 2026-01-10
**Context**: ต้องการ real-time communication ระหว่าง PC และ Android

**Options Considered**:
1. ❌ Raw WebSocket - ต้อง handle reconnection, events เอง
2. ❌ gRPC - Complex setup, overkill
3. ✅ **Socket.IO** - Built-in reconnection, rooms, events

**Decision**: ใช้ Socket.IO สำหรับ communication

**Consequences**:
- ✅ Auto reconnection
- ✅ Event-based architecture
- ✅ มี client libraries ทุก platform
- ❌ Overhead มากกว่า raw WebSocket

---

## Decision #10: Base64 JPEG for Frame Transmission

**Date**: 2026-01-10
**Context**: ต้องการส่ง screen frames จาก Android ไป PC

**Options Considered**:
1. ❌ Raw bitmap - ใหญ่มาก (~5MB/frame)
2. ❌ PNG - Lossless แต่ช้าในการ encode
3. ✅ **JPEG (50% quality) + Base64** - เล็ก, encode เร็ว

**Decision**: ใช้ JPEG quality 50% แล้ว encode เป็น Base64

**Consequences**:
- ✅ ขนาดเล็ก (~30-50KB/frame)
- ✅ Encode เร็ว
- ❌ Lossy compression
- ❌ Base64 เพิ่มขนาด ~33%

---

## 🔧 General Decisions

---

## Decision #11: TypeScript over JavaScript

**Date**: 2026-01-11
**Context**: เลือกภาษาสำหรับ frontend/extension development

**Options Considered**:
1. ❌ JavaScript - ไม่มี type safety
2. ✅ **TypeScript** - Type safety, better IDE support

**Decision**: ใช้ TypeScript เป็น default สำหรับ new projects

**Consequences**:
- ✅ Type safety, fewer runtime errors
- ✅ Better autocomplete, refactoring
- ❌ Build step required
- ❌ Learning curve สำหรับ beginners

---

## Decision #12: Functional over OOP

**Date**: 2026-01-11
**Context**: เลือก programming paradigm

**Options Considered**:
1. ❌ Pure OOP - Verbose, inheritance issues
2. ✅ **Functional with Classes for State** - Best of both worlds

**Decision**: ใช้ functional programming เป็นหลัก ใช้ classes เมื่อต้อง manage state

**Consequences**:
- ✅ Pure functions ง่ายต่อการ test
- ✅ Immutability ลด bugs
- ✅ Classes สำหรับ complex state management
- ❌ อาจ mix paradigms ทำให้ code ไม่สม่ำเสมอ
