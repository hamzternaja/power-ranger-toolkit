# 🤖 Agent Definitions

> **Antigravity Agent System** — Specialized AI agents for different tasks

---

## 📊 Agent Overview

| Agent | Emoji | Expertise | Triggered By |
|-------|-------|-----------|--------------|
| **ui-builder** | 🎨 | UI/Components/Layout | vibe, ui tasks |
| **dev-builder** | ⚙️ | Logic/State/TypeScript | dev tasks |
| **design-reviewer** | ✨ | Design Polish/Aesthetics | design review |
| **backend-connector** | 🔌 | API/Database/Auth | backend tasks |
| **test-runner** | 🧪 | Testing/Auto-fix | testing tasks |
| **plan-orchestrator** | 📐 | Planning/Coordination | planning |
| **platform-adapter** | 📱 | Mobile/Desktop/Extension | platform tasks |

---

## 🔄 Agent Workflow

```
User Request
     │
     ▼
┌─────────────────┐
│ 📐 Orchestrator │ ← Analyze & plan
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│🎨 UI  │ │⚙️ Dev │ │🔌 API │ │📱 Plat│
└───────┘ └───────┘ └───────┘ └───────┘
    │         │        │        │
    └────┬────┴────────┴────────┘
         ▼
┌─────────────────┐
│ ✨ Design Review│ ← Polish
└────────┬────────┘
         ▼
┌─────────────────┐
│ 🧪 Test Runner  │ ← Verify
└────────┬────────┘
         ▼
      Done! ✅
```

---

## 📁 Agent Files

```
agents/
├── README.md           ← This file
├── ui-builder.md       ← UI specialist
├── dev-builder.md      ← Logic specialist
├── design-reviewer.md  ← Design specialist
├── backend-connector.md← Backend specialist
├── test-runner.md      ← Testing specialist
├── plan-orchestrator.md← Planning & coordination
└── platform-adapter.md ← Platform specialist
```

---

## 🧠 Agent Philosophy

### 1. Self-Sufficient (พึ่งตนเองได้)
- ทำงานได้โดยไม่ต้องถาม user ทุกขั้นตอน
- ตัดสินใจเรื่องเล็กน้อยเอง

### 2. Self-Correcting (แก้ไขตัวเองได้)
- ตรวจสอบงานตัวเองก่อนส่ง
- แก้ไขปัญหาอัตโนมัติถ้าทำได้

### 3. Expert-Level (ระดับผู้เชี่ยวชาญ)
- แต่ละ agent เชี่ยวชาญเฉพาะทาง
- รู้ best practices และ anti-patterns

---

## ⚡ Agent Announcements

เมื่อ Agent เริ่มและจบงาน:

```
[🎨 UI Builder] Starting: Create Dashboard Page
[🎨 UI Builder] ✅ Complete: Dashboard with 3 sections

[⚙️ Dev Builder] Starting: Add state management
[⚙️ Dev Builder] ✅ Complete: Zustand store created

[🧪 Test Runner] Starting: Run test suite
[🧪 Test Runner] ✅ Complete: 12/12 tests passed
```

---

> 💡 **Usage**: Read specific agent files when doing specialized tasks
