# 🧠 Knowledge Base Index

> **สารบัญความรู้หลักของ Antigravity** — อ่านไฟล์นี้ก่อนเสมอ!

---

## 🎯 Quick Reference

| ต้องการทำอะไร | อ่านไฟล์ไหน | วิธีอ่าน |
|--------------|-------------|---------|
| ดูโปรเจกต์ที่กำลังทำ | → `projects/{project}/context.md` | `view_file` ✅ |
| หาวิธีแก้ปัญหาเดิม | → `knowledge/solutions.md` | `grep_search` ⚠️ **8000+ lines** |
| เรียนรู้จากความผิดพลาด | → `knowledge/lessons.md` | `view_file` ✅ |
| ดูโจทย์ที่ต้องแก้ | → `knowledge/problems.md` | `grep_search` ⚠️ **Large** |
| หา Design Pattern | → `memory/patterns.md` | `view_file` ✅ |
| หา Code Snippet | → `memory/snippets.md` | `view_file` ✅ |
| ดู Decisions | → `memory/decisions.md` | `view_file` ✅ |
| **🔌 สร้าง Chrome Extension** | → `knowledge/chrome-extension-*.md` | `view_file` ✅ |

> ⚠️ **สำคัญ**: ไฟล์ที่มี `grep_search` ห้ามใช้ `view_file` อ่านทั้งหมด! ใช้ค้นหาตาม keywords เท่านั้น

---

## 🧠 Smart Reading Rules

**เมื่อ user ถามเกี่ยวกับ:**

| หัวข้อ | อ่านไฟล์เหล่านี้โดยอัตโนมัติ |
|--------|----------------------------|
| Chrome Extension | `extension-guide.md` + `chrome-extension-complete.md` + `chrome-extension-secrets.md` |
| TikTok Uploader | `projects/tiktok-uploader/context.md` |
| PSI Engine | `projects/psi-engine/context.md` |
| แก้ Bug/ปัญหา | ค้นหาใน `solutions.md` + อ่าน `lessons.md` |
| เขียน Code ใหม่ | `patterns.md` + `snippets.md` |

---

## 📁 โครงสร้างไฟล์

```
📁 .agent/
   📁 knowledge/           ← ความรู้ทั่วไป
      📄 index.md          ← คุณอยู่ที่นี่
      📄 solutions.md      ← 11648 solutions
      📄 lessons.md        ← 30 lessons
      📄 problems.md       ← 10612 โจทย์
      📄 extension-guide.md         ← 🆕 Extension basics
      📄 chrome-extension-complete.md ← 🆕 Full techniques
      📄 chrome-extension-secrets.md  ← 🆕 Advanced & bypasses
   📁 memory/              ← Memory Banks
      📄 patterns.md       ← 30+ patterns
      📄 snippets.md       ← 40+ snippets
      📄 decisions.md      ← 12 decisions ✨
   📁 projects/            ← Project Context (Enhanced!)
      📁 tiktok-uploader/  ← context + rules + architecture + changelog
      📁 psi-engine/       ← context + rules + architecture + changelog
      📁 titan-mirror/     ← context + rules + architecture + changelog
   📁 workflows/
      📄 startup.md        ← /startup
      📄 solve-all.md      ← /solve-all
```

---

## 🔌 Extension Knowledge (NEW!)

| ไฟล์ | เนื้อหา | บรรทัด |
|------|--------|--------|
| `extension-guide.md` | พื้นฐาน Extension, Lessons, Patterns, Snippets | ~300 |
| `chrome-extension-complete.md` | เทคนิคครบถ้วน, Manifest V1-V3, Popular Extensions | ~700 |
| `chrome-extension-secrets.md` | ⚠️ CSP Bypass, Service Worker Hacks, Anti-Detection | ~680 |

---

## 🤖 Advanced Antigravity Features (NEW!)

| ไฟล์ | เนื้อหา | บรรทัด |
|------|--------|--------|
| `antigravity-advanced-guide.md` | Multi-Agent, Artifacts, Agent Manager | ~300 |

---


## 🚀 Active Projects

| Project | Status | Priority |
|---------|--------|----------|
| 📤 TikTok Uploader | 70% 🔄 | 🔴 High | [Docs](file:///C:/Users/chawa/.gemini/antigravity/.agent/projects/tiktok-uploader/) |
| 🤖 PSI Engine | 60% 🔄 | 🟡 Medium | [Docs](file:///C:/Users/chawa/.gemini/antigravity/.agent/projects/psi-engine/) |
| 📱 TitanMirror | 80% 🔄 | 🔴 High | [Docs](file:///C:/Users/chawa/.gemini/antigravity/.agent/projects/titan-mirror/) |

---

## 📊 Knowledge Stats

| Category | Count |
|----------|-------|
| Solutions | 11648 |
| Lessons | 30 |
| Patterns | 30+ |
| Snippets | 40+ |
| Decisions | 12 ✨ |
| Extension Guides | 3 (~1700 lines) |
| Advanced Guide | 1 (~300 lines) |
| Problems (MBPP/HumanEval) | 1001 ✅ |
| Problems (APPS - Synced) | 9608/10000 ✅ |


---

## 🔧 Commands

| Command | Action |
|---------|--------|
| `/startup` | อ่าน knowledge ทั้งหมด |
| `/solve-all` | แก้โจทย์ใน problems.md |

---

> 💡 **Last Updated**: 2026-01-14
