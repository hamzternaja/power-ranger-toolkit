# 🤖 Antigravity User Rules

> กฎสำหรับ Antigravity IDE — **ต้องทำตามทุกครั้งโดยไม่มีข้อยกเว้น**

---

## 📚 1. AUTO-READ Knowledge Base (บังคับ)

> ⚠️ **กฎนี้ต้องทำ AUTO ทุกครั้งที่เริ่มตอบคำถามใหม่**

### ก่อนตอบคำถามหรือทำงานใดๆ ให้ทำสิ่งนี้ก่อนเสมอ:

1. **อ่าน index.md ทันที** (ไม่ต้องถาม user)
   ```
   C:\Users\chawa\.gemini\antigravity\.agent\knowledge\index.md
   ```

2. **Smart Reading** - อ่านเพิ่มตามประเภทงาน:

| งานเกี่ยวกับ | อ่านเพิ่ม |
|-------------|----------|
| TikTok Uploader | `projects/tiktok-uploader/context.md` + `rules.md` |
| PSI Engine | `projects/psi-engine/context.md` + `rules.md` |
| TitanMirror | `projects/titan-mirror/context.md` + `rules.md` |
| แก้ Bug/ปัญหา | ค้นหาใน `solutions.md` + อ่าน `lessons.md` |
| เขียน Code ใหม่ | `memory/patterns.md` + `memory/snippets.md` |
| Architecture | `memory/decisions.md` |

3. **สรุปก่อนทำงาน** - บอกสั้นๆ ว่าอ่านอะไรบ้าง

---

## 💾 2. AUTO-SAVE Knowledge (บังคับ)

> ⚠️ **กฎนี้ต้องทำ AUTO ทุกครั้งหลังแก้ปัญหาสำเร็จ**

### หลังทำงานสำเร็จ ให้บันทึก AUTO (ไม่ต้องถาม user):

| ถ้าเจอ... | บันทึกลง... | บังคับ? |
|----------|------------|--------|
| วิธีแก้ปัญหาใหม่ | `knowledge/solutions.md` | ✅ ต้องทำ |
| บทเรียน/ข้อผิดพลาด | `knowledge/lessons.md` | ✅ ต้องทำ |
| Pattern ที่ใช้บ่อย | `memory/patterns.md` | ถ้าเจอ |
| Snippet ที่ใช้ซ้ำได้ | `memory/snippets.md` | ถ้าเจอ |
| Decision สำคัญ | `memory/decisions.md` | ถ้าเจอ |

### Format การบันทึก:
- ใช้ template ที่มีอยู่ในแต่ละไฟล์
- เพิ่ม metadata (date, project, tags)
- อัพเดท index.md ถ้าจำเป็น

---

## 🧠 3. Smart Reading Rules

เพื่อประหยัดเวลาและ tokens:

1. ✅ **อ่าน index.md เสมอ** (สารบัญ + overview)
2. ✅ **อ่านเฉพาะ project ที่เกี่ยวข้อง** - ไม่ต้องอ่านทุก project
3. ✅ **ค้นหาด้วย Search Methods** ใน solutions.md แทนการอ่านทั้งหมด
4. ❌ **ไม่ต้องอ่าน problems.md** ยกเว้นเมื่อใช้ /solve-all
5. ✅ **ถ้าไม่เกี่ยวกับ project ใด** - อ่านแค่ index + lessons

---

## 📁 4. Knowledge Base Location

```
C:\Users\chawa\.gemini\antigravity\.agent\

📁 knowledge/           ← ความรู้ทั่วไป
   📄 index.md          ← อ่านก่อนเสมอ!
   📄 solutions.md      ← ใช้ Search Methods (8000+ บรรทัด)
   📄 lessons.md        ← บทเรียน
   📄 problems.md       ← โจทย์ฝึก (ใช้ Search Methods)

📁 memory/              ← Memory Banks
   📄 patterns.md       ← Design patterns
   📄 snippets.md       ← Code templates
   📄 decisions.md      ← Architecture decisions

📁 projects/            ← Project Context
   📁 tiktok-uploader/
   📁 psi-engine/
   📁 titan-mirror/

📁 workflows/           ← Commands
   📄 startup.md        ← /startup (มี Search Methods ละเอียด)
   📄 solve-all.md      ← /solve-all
```

---

## 🔍 5. Search Methods (9 วิธี)

> ⚠️ **สำคัญ**: เมื่อต้องค้นหาในไฟล์ใหญ่ (1000+ บรรทัด) ต้องใช้วิธีเหล่านี้!

### 📊 ตารางสรุปวิธีค้นหาทั้งหมด

| # | วิธี | ใช้ทำอะไร | รองรับ Thai/Emoji | ความเร็ว |
|---|------|----------|-------------------|---------|
| 1 | `grep_search` | ค้นหา pattern ในไฟล์ | ❌ มีปัญหา | เร็วมาก |
| 2 | `find_by_name` | ค้นหาชื่อไฟล์/โฟลเดอร์ | ✅ | เร็วมาก |
| 3 | `view_file` + Line Range | อ่านช่วงบรรทัดที่ต้องการ | ✅ | เร็ว |
| 4 | `view_file_outline` | ดูโครงสร้างไฟล์ | ✅ | เร็ว |
| 5 | `view_code_item` | ดู function/class เฉพาะตัว | ✅ | เร็ว |
| 6 | PowerShell `Select-String` | ค้นหา text ในไฟล์ | ✅ | เร็ว |
| 7 | CMD `findstr` | ค้นหาแบบ basic | ⚠️ บางครั้ง | เร็ว |
| 8 | PowerShell `Get-Content \| Where-Object` | กรองบรรทัด | ✅ | ปานกลาง |
| 9 | `rg` (ripgrep) | ค้นหาเร็วมาก | ✅ | เร็วที่สุด |

### 🔧 วิธีที่ 1: `grep_search` (Tool)

**ข้อจำกัด:** ❌ มีปัญหา encoding กับไฟล์ Thai/Emoji

**ตัวอย่าง:**
```
grep_search(Query="function", SearchPath="C:\path\to\file.js", MatchPerLine=true)
```

**เหมาะกับ:** ไฟล์ภาษาอังกฤษล้วน, source code

---

### 🔧 วิธีที่ 2: `find_by_name` (Tool)

**ตัวอย่าง:**
```
find_by_name(SearchDirectory="C:\Users\chawa", Pattern="*tiktok*", Type="file")
find_by_name(SearchDirectory="C:\project", Extensions=["js", "ts"], MaxDepth=3)
```

**เหมาะกับ:** หาไฟล์ที่ไม่รู้ว่าอยู่ที่ไหน, หาไฟล์ตาม extension

---

### 🔧 วิธีที่ 3: `view_file` + Line Range (Tool)

**ตัวอย่าง:**
```
view_file(AbsolutePath="C:\path\to\file.md", StartLine=100, EndLine=200)
```

**เหมาะกับ:** เมื่อรู้แล้วว่าข้อมูลอยู่บรรทัดไหน

**ข้อจำกัด:** ต้องรู้เลขบรรทัดก่อน, สูงสุด 800 บรรทัดต่อครั้ง

---

### 🔧 วิธีที่ 4: `view_file_outline` (Tool)

**ตัวอย่าง:**
```
view_file_outline(AbsolutePath="C:\path\to\code.py")
```

**เหมาะกับ:** ไฟล์ code, ต้องการรู้โครงสร้างก่อนอ่านรายละเอียด

---

### 🔧 วิธีที่ 5: `view_code_item` (Tool)

**ตัวอย่าง:**
```
view_code_item(File="C:\path\to\code.py", NodePaths=["ClassName.method_name"])
```

**เหมาะกับ:** ต้องการดู function เฉพาะตัว, รู้ชื่อ function/class แล้ว

---

### 🔧 วิธีที่ 6: PowerShell `Select-String` ⭐ แนะนำ!

**ข้อดี:** ✅ รองรับ UTF-8, Thai, Emoji ได้ดี

**ตัวอย่าง:**
```powershell
# ค้นหา keyword
Select-String -Path "C:\file.md" -Pattern "TikTok" -SimpleMatch

# ค้นหาหลายไฟล์
Select-String -Path "C:\folder\*.md" -Pattern "keyword" -SimpleMatch

# จำกัดผลลัพธ์
Select-String -Path "C:\file.md" -Pattern "Solution" | Select-Object -First 20

# แสดงบริบท 2 บรรทัดก่อนหลัง
Select-String -Path "C:\file.md" -Pattern "keyword" -Context 2,2
```

**เหมาะกับ:** ไฟล์ภาษาไทย, ไฟล์ที่มี emoji, ไฟล์ใหญ่ทุกประเภท

---

### 🔧 วิธีที่ 7: CMD `findstr`

**ข้อจำกัด:** ⚠️ อาจมีปัญหากับ UTF-8/Thai

**ตัวอย่าง:**
```cmd
findstr /i "keyword" C:\path\to\file.md
findstr /s /i "keyword" C:\folder\*.md
```

**เหมาะกับ:** ไฟล์ภาษาอังกฤษล้วน

---

### 🔧 วิธีที่ 8: PowerShell `Get-Content | Where-Object`

**ตัวอย่าง:**
```powershell
# กรองบรรทัดที่มี keyword
Get-Content "C:\file.md" | Where-Object { $_ -match "keyword" }

# นับจำนวนที่เจอ
(Get-Content "C:\file.md" | Where-Object { $_ -match "Solution" }).Count
```

**เหมาะกับ:** กรองข้อมูลซับซ้อน, นับจำนวน matches

---

### 🔧 วิธีที่ 9: `rg` (ripgrep)

**ข้อจำกัด:** ต้องติดตั้งก่อน (`choco install ripgrep`)

**ตัวอย่าง:**
```powershell
rg "keyword" C:\path\to\file.md
rg -i "keyword" C:\folder\
rg -C 2 "keyword" C:\file.md
```

**เหมาะกับ:** โปรเจกต์ขนาดใหญ่, ต้องการความเร็วสูงสุด

---

## 🎯 Quick Reference: เลือกวิธีค้นหาไหนดี?

| สถานการณ์ | วิธีที่แนะนำ |
|-----------|-------------|
| ค้นหา text ในไฟล์ใหญ่ (Thai/Emoji) | **Select-String** ⭐ |
| ค้นหา text ในไฟล์ใหญ่ (English only) | `grep_search` หรือ `rg` |
| หาไฟล์ที่ไม่รู้ว่าอยู่ไหน | `find_by_name` |
| ดูโครงสร้าง code | `view_file_outline` |
| ดู function เฉพาะตัว | `view_code_item` |
| อ่านบรรทัดที่รู้แล้ว | `view_file` + StartLine/EndLine |
| กรองข้อมูลซับซ้อน | `Get-Content \| Where-Object` |
| ค้นหาเร็วสุด (ถ้าติดตั้ง) | `rg` (ripgrep) |

---

## 🌐 6. Language & Style

- ตอบเป็น **ภาษาไทย** เว้นแต่ user จะขอเป็นภาษาอื่น
- ใช้ **emoji** ให้เหมาะสม
- อธิบาย **กระชับแต่ครบถ้วน**
- ถ้าไม่แน่ใจ ให้ **ถาม clarification** ก่อน

---

## ⚡ 7. Commands

| Command | Action |
|---------|--------|
| `/startup` | อ่าน knowledge ตาม Smart Reading |
| `/solve-all` | แก้โจทย์ใน problems.md + บันทึก memory |

---

## 📋 8. Checklist (ทำทุกครั้ง)

### ก่อนเริ่มงาน:
- [ ] อ่าน index.md แล้วหรือยัง? → **อ่านเลย!**
- [ ] งานนี้เกี่ยวกับ project ไหน? → อ่าน context
- [ ] มี solution เดิมหรือไม่? → **ค้นหาด้วย Search Methods!**

### หลังจบงาน:
- [ ] แก้ปัญหาอะไร? → **บันทึก solutions.md เลย!**
- [ ] เรียนรู้อะไร? → **บันทึก lessons.md เลย!**
- [ ] เจอ pattern ใหม่? → บันทึก patterns.md

---

---

## 🎨 9. Code Style Rules

> กฎสำหรับเขียน code ให้สอดคล้องกัน

### General

| หัวข้อ | กฎ |
|--------|-----|
| ภาษา | ใช้ **TypeScript** แทน JavaScript เมื่อเป็นไปได้ |
| Style | ใช้ **functional programming** มากกว่า OOP |
| ตัวแปร | ตั้งชื่อเป็น **camelCase** |
| Constants | ตั้งชื่อเป็น **UPPER_SNAKE_CASE** |
| Indentation | ใช้ **2 spaces** |
| Strings | ใช้ **single quotes** |

### Functions

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| Function ทำหน้าที่เดียว | Function ยาวเกิน 50 บรรทัด |
| ตั้งชื่อเป็น verb+noun เช่น `getUserData` | ตั้งชื่อคลุมเครือ เช่น `doStuff` |
| Parameters ไม่เกิน 3 ตัว | Parameters มากกว่า 5 ตัว |

### Comments

| Comment | ใช้เมื่อ |
|---------|--------|
| `// TODO:` | งานที่ยังไม่เสร็จ |
| `// FIXME:` | Bugs ที่รู้แล้ว |
| `// NOTE:` | หมายเหตุสำคัญ |
| JSDoc | Public functions ทุกตัว |

---

## 📂 10. Folder Structure Rules

> โครงสร้างโฟลเดอร์มาตรฐาน

### Web Projects

| โฟลเดอร์ | หน้าที่ |
|----------|--------|
| `src/components/` | UI Components |
| `src/pages/` | Page Components |
| `src/hooks/` | Custom Hooks |
| `src/utils/` | Utility Functions |
| `src/types/` | TypeScript Types |
| `src/services/` | API Services |
| `src/stores/` | State Management |
| `src/assets/` | Images, Fonts, etc. |

### Rules

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| แยก components ตาม feature/domain | สร้างไฟล์นอก structure ที่กำหนด |
| ไฟล์ test อยู่คู่กับ source (`*.test.ts`) | Nested folders เกิน 4 ระดับ |
| ใช้ `index.ts` สำหรับ re-export | ไฟล์ไม่เกี่ยวข้องใน src/ |

---

## 🔒 11. Security Rules

> กฎความปลอดภัยที่ต้องทำตาม

### Secrets & Credentials

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| ใช้ environment variables (`.env`) | เก็บ API keys, passwords ใน code |
| เพิ่ม `.env` ใน `.gitignore` | Commit secrets ขึ้น git |
| ใช้ secrets manager สำหรับ production | Hardcode credentials |

### Input Validation

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| Validate input ทุกครั้งก่อนใช้งาน | Trust user input โดยไม่ตรวจสอบ |
| ใช้ Zod/Yup สำหรับ schema validation | ใช้ `eval()` กับ user input |
| Sanitize user input ก่อนแสดงผล | ใช้ `innerHTML` กับ user input |
| ใช้ parameterized queries | String concatenation ใน SQL |

---

## 📝 12. Documentation Rules

> กฎการเขียน documentation

### README.md

| ต้องมี | คำอธิบาย |
|--------|---------|
| Setup | วิธี install และ run project |
| Usage | ตัวอย่างการใช้งาน |
| Dependencies | Libraries ที่จำเป็น |
| Configuration | Environment variables ที่ต้องตั้ง |

### Code Documentation

| ต้องใส่ | ตัวอย่าง |
|--------|---------|
| JSDoc สำหรับ public APIs | `@param`, `@returns`, `@example` |
| อธิบาย complex logic | Comments บอกว่าทำไมถึงทำแบบนี้ |
| Type definitions | Interface/Type ที่ชัดเจน |

### Changelog Format

| Version | Date | Changes |
|---------|------|---------|
| Added | ฟีเจอร์ใหม่ |
| Changed | แก้ไขพฤติกรรม |
| Fixed | แก้ bugs |
| Removed | ลบฟีเจอร์ |

---

## 🤖 13. AI Response Style

> กฎการตอบของ AI

### ภาษา

| สถานการณ์ | ตอบเป็น |
|-----------|--------|
| User พิมพ์ภาษาไทย | ภาษาไทย |
| User พิมพ์ภาษาอังกฤษ | ภาษาอังกฤษ |
| Technical terms | ภาษาอังกฤษ (ไม่ต้องแปล) |

### รูปแบบการตอบ

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| กระชับ ไม่เยิ่นเย้อ | ตอบยาวเกินจำเป็น |
| ใช้ emoji ให้เหมาะสม | ใช้ emoji มากเกินไป |
| ใช้ tables, bullet points | เขียนเป็น paragraph ยาวๆ |
| ใช้ code blocks พร้อม syntax | Code ไม่มี highlighting |

### พฤติกรรม

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| ถ้าไม่แน่ใจ → ถาม clarification ก่อน | สมมติสิ่งที่ user ไม่ได้บอก |
| อธิบายเหตุผลเมื่อเลือก approach | ทำงานเกินที่ user ขอ |
| บอก trade-offs ถ้ามี | ซ่อนข้อจำกัดหรือปัญหา |

---

## 💡 Best Practices

1. **ไฟล์ < 800 บรรทัด** → ใช้ `view_file` อ่านทั้งหมดได้เลย
2. **ไฟล์ > 800 บรรทัด** → ใช้ Search Methods ก่อน แล้วค่อย `view_file` + line range
3. **ไฟล์ภาษาไทย/Emoji** → ใช้ PowerShell `Select-String` เสมอ
4. **Source code** → ใช้ `view_file_outline` + `view_code_item`
5. **หาไฟล์** → ใช้ `find_by_name`

---

---

## ⚠️ 14. Error Handling Rules

> กฎการจัดการ errors

### General

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| ใช้ try-catch อย่างเหมาะสม | Swallow errors โดยไม่ log |
| Log error ด้วย context ที่เพียงพอ | แสดง internal error ให้ user |
| สร้าง custom error classes | ใช้ generic Error ทุกที่ |
| Return meaningful error messages | Return stack trace ให้ client |

### Error Logging

| ต้อง Log | ตัวอย่าง |
|----------|---------|
| Error message | `"Failed to fetch user data"` |
| Error code | `"ERR_USER_NOT_FOUND"` |
| Context | `{ userId: 123, action: "fetchProfile" }` |
| Timestamp | `2026-01-13T07:39:00Z` |
| Stack trace (dev only) | สำหรับ debugging |

### Error Response Format

| Field | คำอธิบาย | ตัวอย่าง |
|-------|---------|---------|
| `success` | false เสมอ | `false` |
| `error.code` | Error code | `"VALIDATION_ERROR"` |
| `error.message` | User-friendly message | `"อีเมลไม่ถูกต้อง"` |
| `error.details` | รายละเอียดเพิ่ม (optional) | `{ field: "email" }` |

### Async Error Handling

| Pattern | ใช้เมื่อ |
|---------|--------|
| try-catch + await | Async functions |
| .catch() | Promise chains |
| Error boundaries | React components |
| Global error handler | Uncaught exceptions |

---

## ⚡ 15. Performance Rules

> กฎสำหรับ performance optimization

### Frontend Performance

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| Lazy load components ที่ไม่จำเป็น | Load ทุกอย่างพร้อมกัน |
| Code splitting ตาม routes | Bundle ไฟล์เดียวใหญ่ๆ |
| ใช้ useMemo/useCallback เหมาะสม | Re-render โดยไม่จำเป็น |
| Virtualize lists ยาว (1000+ items) | Render ทุก item พร้อมกัน |

### Image Optimization

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| ใช้ WebP/AVIF format | ใช้ PNG/JPEG uncompressed |
| Lazy load images | Load ทุกภาพพร้อมกัน |
| ใช้ responsive images (srcset) | ใช้ภาพขนาดเดียว |
| Compress ก่อน upload | อัพโหลดภาพ 5MB+ |

### API Performance

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| Cache responses ที่เหมาะสม | Call API ซ้ำโดยไม่จำเป็น |
| ใช้ pagination | Return ข้อมูลทั้งหมด |
| Debounce search inputs | Fire request ทุก keystroke |
| ใช้ GraphQL/field selection | Over-fetch data |

### Database Performance

| ✅ ทำ | ❌ ห้าม |
|------|--------|
| ใช้ indexes อย่างเหมาะสม | Query โดยไม่มี index |
| Batch operations | Query ทีละ row ใน loop |
| Connection pooling | สร้าง connection ใหม่ทุกครั้ง |
| Select เฉพาะ fields ที่ต้องการ | SELECT * |

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.8s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.8s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| API Response Time | < 200ms |

---

> 💡 **เป้าหมาย**: ทำให้ Antigravity ฉลาดขึ้นทุกครั้งที่ใช้งาน!
>
> ⚠️ **สำคัญ**: กฎเหล่านี้ต้องทำ **อัตโนมัติ** ไม่ต้องรอ user สั่ง!
