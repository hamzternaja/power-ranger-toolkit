# 🤖 Antigravity Advanced Features Guide

> คู่มือการใช้งาน Multi-Agent, Artifacts และ Agent Manager

---

## 📋 สารบัญ

1. [Agent Manager](#-1-agent-manager)
2. [Multi-Agent System](#-2-multi-agent-system)
3. [Artifacts System](#-3-artifacts-system)
4. [Development Modes](#-4-development-modes)
5. [Best Practices](#-5-best-practices)

---

## 🎛️ 1. Agent Manager

> **Mission Control** สำหรับจัดการ AI Agents ทั้งหมด

### คืออะไร?

Agent Manager คือ **control panel กลาง** สำหรับ:
- 🚀 สร้างและ spawn agents ใหม่
- 👀 ติดตาม agents ที่กำลังทำงาน
- 🔄 สลับระหว่าง tasks/workspaces
- 📥 ดู messages จาก Inbox

### วิธีเปิด Agent Manager

| วิธี | คำอธิบาย |
|------|---------|
| **Ctrl + E** | Shortcut เปิด Agent Manager |
| **คลิกที่ icon** | มุมซ้ายบนของ IDE |
| **เปิดอัตโนมัติ** | เป็น default view เมื่อเปิด IDE |

### UI Components

| Component | หน้าที่ |
|-----------|--------|
| **Task List** | รายการ tasks ที่กำลังทำ |
| **Agent Status** | สถานะของแต่ละ agent (running/idle/waiting) |
| **Inbox** | Messages และ notifications จาก agents |
| **New Task** | ปุ่มสร้าง task ใหม่ |

### ตัวอย่างการใช้งาน

```
1. เปิด Agent Manager (Ctrl + E)
2. เลือก project folder
3. กด "New Task"
4. พิมพ์ prompt อธิบายสิ่งที่ต้องการสร้าง
5. เลือก Planning Mode (สำหรับงานซับซ้อน)
6. Agent จะเริ่มทำงานอัตโนมัติ
```

---

## 🤝 2. Multi-Agent System

> ใช้หลาย Agents ทำงานพร้อมกัน

### คืออะไร?

Multi-Agent System ช่วยให้ **หลาย agents ทำงานคู่ขนาน**:
- 🔨 Agent 1: เขียน code
- 🧪 Agent 2: เขียน tests
- 📝 Agent 3: เขียน documentation

### ประโยชน์

| ประโยชน์ | คำอธิบาย |
|----------|---------|
| **เร็วขึ้น** | ทำหลายงานพร้อมกัน |
| **แยกหน้าที่** | แต่ละ agent เชี่ยวชาญงานต่างกัน |
| **ลด bottleneck** | ไม่ต้องรอ agent เดียวทำทุกอย่าง |

### วิธีใช้ Multi-Agent

| ขั้นตอน | คำอธิบาย |
|---------|---------|
| 1. เปิด Agent Manager | Ctrl + E |
| 2. สร้าง Task แรก | กด New Task |
| 3. สร้าง Agent เพิ่ม | กด + หรือ New Agent |
| 4. มอบหมายงาน | แต่ละ agent ทำงานต่างกัน |
| 5. ติดตามผ่าน Inbox | ดู messages จากทุก agents |

### Patterns สำหรับ Multi-Agent

| Pattern | ใช้เมื่อ |
|---------|--------|
| **Parallel Tasks** | ทำ 2+ งานที่ไม่เกี่ยวข้องกัน |
| **Pipeline** | Agent 1 ส่งผลให้ Agent 2 ต่อ |
| **Review Pattern** | Agent 1 code, Agent 2 review |
| **Test Pattern** | Agent 1 code, Agent 2 test |

---

## 📦 3. Artifacts System

> เอกสารที่ Agent สร้างเพื่อ **สร้างความเชื่อมั่น**

### Artifacts คืออะไร?

Artifacts คือ **deliverables ที่ agent สร้าง** เพื่อให้ user ตรวจสอบ:
- 📋 **task.md** - รายการงานที่ต้องทำ
- 📝 **implementation_plan.md** - แผนการ implement
- 📖 **walkthrough.md** - สรุปสิ่งที่ทำเสร็จแล้ว
- 📸 **Screenshots** - รูปหน้าจอ
- 🎬 **Browser Recordings** - วิดีโอการทดสอบ

### ประเภทของ Artifacts

| Artifact | เมื่อไหร่ | หน้าที่ |
|----------|---------|--------|
| **task.md** | เริ่มงาน | Checklist ของงานที่ต้องทำ |
| **implementation_plan.md** | Planning Mode | รายละเอียดวิธีการ implement |
| **walkthrough.md** | จบงาน | สรุปสิ่งที่ทำ + proof of work |
| **Screenshots** | Testing | หลักฐานว่า UI ถูกต้อง |
| **Browser Recordings** | Testing | วิดีโอการทดสอบ |

### ตำแหน่งไฟล์ Artifacts

```
.gemini/antigravity/brain/<conversation-id>/
├── task.md                  ← Checklist
├── implementation_plan.md   ← แผนการ implement
├── walkthrough.md           ← สรุปงาน
├── screenshots/             ← รูปภาพ
└── browser_recordings/      ← วิดีโอ
```

### task.md Format

```markdown
# Task: สร้าง Login Page

## Checklist
- [x] สร้าง UI Component
- [x] เพิ่ม validation
- [/] เชื่อมต่อ API (กำลังทำ)
- [ ] เขียน tests

## Notes
- ใช้ React Hook Form
- Validate ด้วย Zod
```

### implementation_plan.md Format

```markdown
# Implementation Plan: Login System

## Goal
สร้างระบบ login ด้วย OAuth

## Proposed Changes

### Component: Auth
- [NEW] `src/auth/LoginPage.tsx`
- [MODIFY] `src/App.tsx` - เพิ่ม routes

### Component: API
- [NEW] `src/api/auth.ts`

## Verification Plan
1. Run tests: `npm test`
2. Test login flow ใน browser
```

### walkthrough.md Format

```markdown
# Walkthrough: Login System

## What Was Done
- สร้าง LoginPage component
- เพิ่ม OAuth integration
- เขียน unit tests

## Testing Results
- ✅ All tests passed
- ✅ Login flow works

## Screenshots
![Login Page](/path/to/screenshot.png)
```

---

## 🎯 4. Development Modes

> เลือก mode ตามความซับซ้อนของงาน

### 3 Modes หลัก

| Mode | คำอธิบาย | ใช้เมื่อ |
|------|---------|---------|
| **Agent-Driven (Autopilot)** | AI ทำทุกอย่างเอง | งาน routine, prototype |
| **Agent-Assisted** ⭐ | AI ช่วย, user ควบคุม | งานทั่วไป (แนะนำ!) |
| **Review-Driven** | AI ถาม permission ก่อนทำ | งานสำคัญ, production |

### Planning Mode vs Fast Mode

| Mode | คำอธิบาย | ใช้เมื่อ |
|------|---------|---------|
| **Planning Mode** | สร้าง implementation plan ก่อน | งานซับซ้อน, หลาย files |
| **Fast Mode** | ทำเลยไม่ต้อง plan | งานง่าย, แก้ไขเล็กน้อย |

---

## 💡 5. Best Practices

### Agent Manager

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| ใช้ Inbox ติดตาม agents | ปล่อยให้ agents ทำโดยไม่ดู |
| ตั้งชื่อ task ให้ชัดเจน | ใช้ชื่อคลุมเครือ |
| Review artifacts ก่อน approve | Approve โดยไม่อ่าน |

### Multi-Agent

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| แบ่งงานที่ไม่ overlap | ให้ agents แก้ไฟล์เดียวกัน |
| ใช้ 2-3 agents สำหรับงานใหญ่ | Spawn agents มากเกินไป |
| ตรวจสอบผลงานทุก agent | สมมติว่าทุก agent ถูกต้อง |

### Artifacts

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| อ่าน implementation plan ก่อน | ข้าม planning ไป coding เลย |
| ดู screenshots/recordings | เชื่อว่า test ผ่านโดยไม่ดู |
| ให้ feedback ถ้าไม่ตรงใจ | Approve ทั้งที่ไม่พอใจ |

---

## 🔑 Quick Reference

### Shortcuts

| Shortcut | หน้าที่ |
|----------|--------|
| **Ctrl + E** | เปิด Agent Manager |
| **Ctrl + Shift + P** | Command Palette |
| **Ctrl + I** | Inline Command |

### Files ที่ควรรู้

| File | ตำแหน่ง | หน้าที่ |
|------|---------|--------|
| `task.md` | brain/ | Checklist |
| `implementation_plan.md` | brain/ | แผนการ |
| `walkthrough.md` | brain/ | สรุปงาน |
| `GEMINI.md` | .gemini/ | Global Rules |
| `CLAUDE.md` | project root | Project Rules |

---

> 📅 **Last Updated**: 2026-01-13
>
> 💡 **Tip**: เริ่มจาก Planning Mode สำหรับงานใหม่ เพื่อให้ agent สร้าง artifacts ที่ตรวจสอบได้!
