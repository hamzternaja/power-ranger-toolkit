---
description: อ่านความรู้และ context ก่อนเริ่มทำงาน (ใช้คำสั่ง /startup)
---

# 🧠 Startup Workflow

เมื่อผู้ใช้พิมพ์ `/startup` หรือเริ่มการสนทนาใหม่:

## ขั้นตอน:

### 1. อ่าน Knowledge Index (บังคับ)
อ่าน `C:\Users\chawa\.gemini\antigravity\.agent\knowledge\index.md`

### 2. อ่าน Lessons ทั้งหมด (บังคับ)
อ่าน `C:\Users\chawa\.gemini\antigravity\.agent\knowledge\lessons.md`
> ⚠️ ไฟล์นี้มีขนาดเล็ก อ่านทั้งหมดได้

### 3. Solutions - ใช้ Smart Search (บังคับ)
> ⚠️ `solutions.md` มี **8,000+ บรรทัด** ห้ามอ่านทั้งหมด! ใช้วิธีค้นหาแทน

**ขั้นตอน:**
1. ค้นหาด้วย project name หรือ keywords ที่เกี่ยวข้อง
2. ใช้วิธีค้นหาที่เหมาะสม (ดูหัวข้อ "🔍 Search Methods")
3. อ่านเฉพาะ solution ที่เจอจาก search results

### 4. ประเมินงาน
ดูว่างานที่ user ขอเกี่ยวข้องกับอะไร:

| งานเกี่ยวกับ | อ่านเพิ่ม |
|-------------|----------|
| TikTok Uploader | `projects/tiktok-uploader/context.md` + `rules.md` |
| PSI Engine | `projects/psi-engine/context.md` + `rules.md` |
| TitanMirror | `projects/titan-mirror/context.md` + `rules.md` |
| แก้ Bug | ค้นหาใน `solutions.md` + อ่าน `lessons.md` |
| เขียน Code | `memory/patterns.md` + `memory/snippets.md` |

### 5. Apply Knowledge
ถ้าพบ solution ที่เกี่ยวข้อง:
- อ้างอิง solution นั้น
- ปรับใช้กับปัญหาใหม่
- บอก user ว่าใช้ความรู้จากไหน

### 6. สรุปให้ User
- บอกว่าอ่านไฟล์อะไรบ้าง
- บอกจำนวน solutions ที่ค้นหาได้
- พร้อมทำงานโดยมี context ครบถ้วน

### 7. เปิด Auto-Accept (ถ้ายังไม่ได้เปิด)
> ⚠️ ถ้า Antigravity เปิดอยู่แล้ว ให้ paste code นี้ใน DevTools Console:

1. กด `Ctrl+Shift+P` → พิมพ์ `Toggle Developer Tools` → Enter
2. ไปที่ tab **Console**
3. Paste code นี้:

```javascript
(function(){if(window.AA5)return;window.AA5={c:0,run:function(){setInterval(function(){var btns=document.querySelectorAll("button.bg-ide-button-background");for(var i=0;i<btns.length;i++){var b=btns[i];if((b.textContent||"").indexOf("Accept")>=0&&b.textContent.indexOf("Reject")<0){b.click();b.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));b.dispatchEvent(new PointerEvent("pointerup",{bubbles:true}));this.c++;console.log("[AA5] Clicked Accept:",this.c);return}}var spans=document.querySelectorAll("span.bg-ide-button-background");for(var j=0;j<spans.length;j++){var s=spans[j];if(s.textContent.trim()==="Accept all"){s.click();s.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));s.dispatchEvent(new PointerEvent("pointerup",{bubbles:true}));this.c++;console.log("[AA5] Clicked Accept all:",this.c);return}}}.bind(this),1500)}};window.AA5.run();console.log("Auto Accept v5 Started!")})();
```

4. กด Enter → เห็น `Auto Accept v5 Started!` = พร้อมใช้งาน!

---

## 📖 File Reading Strategy

| ไฟล์ | ขนาด | วิธีอ่าน |
|------|------|---------|
| `index.md` | เล็ก | `view_file` ทั้งหมด ✅ |
| `lessons.md` | เล็ก | `view_file` ทั้งหมด ✅ |
| `patterns.md` | เล็ก | `view_file` ทั้งหมด ✅ |
| `snippets.md` | เล็ก | `view_file` ทั้งหมด ✅ |
| `solutions.md` | **ใหญ่ (8000+)** | ใช้ Search Methods ⚠️ |
| `problems.md` | **ใหญ่** | ใช้ Search Methods ⚠️ |

---

## 📁 Files Structure

```
.agent/
   knowledge/
      index.md        ← อ่านก่อนเสมอ (view_file)
      solutions.md    ← ใช้ Search Methods!
      lessons.md      ← อ่านทั้งหมด (view_file)
   memory/
      patterns.md     ← อ่านทั้งหมด (view_file)
      snippets.md     ← อ่านทั้งหมด (view_file)
   projects/
      {project}/
         context.md   ← อ่านทั้งหมด (view_file)
         rules.md     ← อ่านทั้งหมด (view_file)
```

---

## 🔍 Search Methods (9 วิธี)

> **สำคัญ**: เมื่อต้องค้นหาในไฟล์ใหญ่ (1000+ บรรทัด) ให้เลือกใช้วิธีที่เหมาะสม!

### 📊 ตารางสรุปวิธีค้นหาทั้งหมด

| # | วิธี | ใช้ทำอะไร | รองรับ Thai/Emoji | ความเร็ว |
|---|------|----------|-------------------|---------|
| 1 | `grep_search` | ค้นหา pattern ในไฟล์ | ❌ มีปัญหา | เร็วมาก |
| 2 | `find_by_name` | ค้นหาชื่อไฟล์/โฟลเดอร์ | ✅ | เร็วมาก |
| 3 | `view_file` + Line Range | อ่านช่วงบรรทัดที่ต้องการ | ✅ | เร็ว |
| 4 | `view_file_outline` | ดูโครงสร้างไฟล์ (functions, classes) | ✅ | เร็ว |
| 5 | `view_code_item` | ดู function/class เฉพาะตัว | ✅ | เร็ว |
| 6 | PowerShell `Select-String` | ค้นหา text ในไฟล์ | ✅ | เร็ว |
| 7 | CMD `findstr` | ค้นหาแบบ basic | ⚠️ บางครั้ง | เร็ว |
| 8 | PowerShell `Get-Content \| Where-Object` | กรองบรรทัด | ✅ | ปานกลาง |
| 9 | `rg` (ripgrep) | ค้นหาเร็วมาก (ถ้าติดตั้ง) | ✅ | เร็วที่สุด |

---

### 🔧 วิธีที่ 1: `grep_search` (Tool)

**ลักษณะ:** Tool ในตัวสำหรับค้นหา pattern

**ข้อจำกัด:** ❌ มีปัญหา encoding กับไฟล์ Thai/Emoji

**ตัวอย่าง:**
```
grep_search(Query="function", SearchPath="C:\path\to\file.js", MatchPerLine=true)
```

**เหมาะกับ:** ไฟล์ภาษาอังกฤษล้วน, source code

**ไม่เหมาะกับ:** ไฟล์ที่มีภาษาไทย, emoji, markdown ไทย

---

### 🔧 วิธีที่ 2: `find_by_name` (Tool)

**ลักษณะ:** ค้นหาไฟล์/โฟลเดอร์ตามชื่อ

**ตัวอย่าง:**
```
find_by_name(SearchDirectory="C:\Users\chawa", Pattern="*tiktok*", Type="file")
find_by_name(SearchDirectory="C:\project", Extensions=["js", "ts"], MaxDepth=3)
```

**เหมาะกับ:** 
- หาไฟล์ที่ไม่รู้ว่าอยู่ที่ไหน
- หาไฟล์ตาม extension
- สำรวจโครงสร้างโปรเจกต์

**ไม่เหมาะกับ:** ค้นหาเนื้อหาภายในไฟล์

---

### 🔧 วิธีที่ 3: `view_file` + Line Range (Tool)

**ลักษณะ:** อ่านเฉพาะบรรทัดที่ต้องการ

**ตัวอย่าง:**
```
view_file(AbsolutePath="C:\path\to\file.md", StartLine=100, EndLine=200)
```

**เหมาะกับ:**
- เมื่อรู้แล้วว่าข้อมูลอยู่บรรทัดไหน
- อ่านต่อจากผลการค้นหา
- อ่านไฟล์ใหญ่เป็นส่วนๆ

**ข้อจำกัด:** ต้องรู้เลขบรรทัดก่อน, สูงสุด 800 บรรทัดต่อครั้ง

---

### 🔧 วิธีที่ 4: `view_file_outline` (Tool)

**ลักษณะ:** ดูโครงสร้างของไฟล์ (functions, classes, sections)

**ตัวอย่าง:**
```
view_file_outline(AbsolutePath="C:\path\to\code.py")
```

**ผลลัพธ์:** แสดงรายการ functions/classes พร้อมเลขบรรทัด

**เหมาะกับ:**
- ไฟล์ code (Python, JavaScript, TypeScript, etc.)
- ต้องการรู้โครงสร้างก่อนอ่านรายละเอียด
- หา function ที่ต้องการแก้ไข

**ไม่เหมาะกับ:** ไฟล์ markdown, text ธรรมดา

---

### 🔧 วิธีที่ 5: `view_code_item` (Tool)

**ลักษณะ:** ดู function หรือ class เฉพาะตัว

**ตัวอย่าง:**
```
view_code_item(File="C:\path\to\code.py", NodePaths=["ClassName.method_name"])
view_code_item(File="C:\path\to\code.js", NodePaths=["functionName"])
```

**เหมาะกับ:**
- ต้องการดู function เฉพาะตัว
- ไม่ต้องการเห็น code ทั้งไฟล์
- รู้ชื่อ function/class แล้ว

**ข้อจำกัด:** ต้องรู้ชื่อ function/class ก่อน

---

### 🔧 วิธีที่ 6: PowerShell `Select-String` (Command) ⭐ แนะนำ!

**ลักษณะ:** ค้นหา text ในไฟล์ด้วย PowerShell

**ข้อดี:** ✅ รองรับ UTF-8, Thai, Emoji ได้ดี

**ตัวอย่าง:**
```powershell
# ค้นหา keyword (SimpleMatch = exact match)
Select-String -Path "C:\path\to\file.md" -Pattern "TikTok" -SimpleMatch

# ค้นหา pattern (Regex)
Select-String -Path "C:\path\to\file.md" -Pattern "def \w+" 

# ค้นหาหลายไฟล์
Select-String -Path "C:\folder\*.md" -Pattern "keyword" -SimpleMatch

# จำกัดผลลัพธ์
Select-String -Path "C:\file.md" -Pattern "Solution" | Select-Object -First 20

# ค้นหาแบบ case-insensitive (default)
Select-String -Path "C:\file.md" -Pattern "tiktok" -SimpleMatch

# ค้นหาแบบ case-sensitive
Select-String -Path "C:\file.md" -Pattern "TikTok" -SimpleMatch -CaseSensitive

# แสดงบริบท (context) 2 บรรทัดก่อนหลัง
Select-String -Path "C:\file.md" -Pattern "keyword" -Context 2,2
```

**เหมาะกับ:**
- ไฟล์ภาษาไทย
- ไฟล์ที่มี emoji
- ไฟล์ markdown
- ไฟล์ใหญ่ทุกประเภท

---

### 🔧 วิธีที่ 7: CMD `findstr` (Command)

**ลักษณะ:** ค้นหาแบบ basic ด้วย Command Prompt

**ข้อจำกัด:** ⚠️ อาจมีปัญหากับ UTF-8/Thai

**ตัวอย่าง:**
```cmd
# ค้นหาแบบ case-insensitive
findstr /i "keyword" C:\path\to\file.md

# ค้นหาใน subdirectories
findstr /s /i "keyword" C:\folder\*.md

# ค้นหาหลาย keywords (OR)
findstr /i "keyword1 keyword2" C:\file.md
```

**เหมาะกับ:** ไฟล์ภาษาอังกฤษล้วน, การค้นหาเร็วๆ

**ไม่เหมาะกับ:** ไฟล์ภาษาไทย

---

### 🔧 วิธีที่ 8: PowerShell `Get-Content | Where-Object` (Command)

**ลักษณะ:** อ่านไฟล์แล้วกรองบรรทัด

**ตัวอย่าง:**
```powershell
# กรองบรรทัดที่มี keyword
Get-Content "C:\file.md" | Where-Object { $_ -match "keyword" }

# กรองบรรทัดที่ขึ้นต้นด้วย ##
Get-Content "C:\file.md" | Where-Object { $_ -match "^##" }

# นับจำนวนที่เจอ
(Get-Content "C:\file.md" | Where-Object { $_ -match "Solution" }).Count

# แสดงเลขบรรทัดด้วย
Get-Content "C:\file.md" | Select-String "keyword"

# กรองแล้วบันทึกเป็นไฟล์ใหม่
Get-Content "C:\file.md" | Where-Object { $_ -match "keyword" } | Out-File "C:\filtered.txt"
```

**เหมาะกับ:**
- กรองข้อมูลซับซ้อน
- ต้องการ post-process ผลลัพธ์
- นับจำนวน matches

**ข้อจำกัด:** ช้ากว่า Select-String สำหรับไฟล์ใหญ่มาก

---

### 🔧 วิธีที่ 9: `rg` (ripgrep) (Command)

**ลักษณะ:** เครื่องมือค้นหาที่เร็วที่สุด

**ข้อจำกัด:** ต้องติดตั้งก่อน (`choco install ripgrep` หรือ `winget install BurntSushi.ripgrep`)

**ตัวอย่าง:**
```powershell
# ค้นหาพื้นฐาน
rg "keyword" C:\path\to\file.md

# ค้นหา case-insensitive
rg -i "keyword" C:\folder\

# ค้นหาเฉพาะไฟล์ .md
rg "keyword" -g "*.md" C:\folder\

# แสดง context
rg -C 2 "keyword" C:\file.md

# นับจำนวน matches
rg -c "keyword" C:\folder\

# แสดงเลขบรรทัด
rg -n "keyword" C:\file.md
```

**เหมาะกับ:**
- โปรเจกต์ขนาดใหญ่
- ค้นหาในหลายไฟล์พร้อมกัน
- ต้องการความเร็วสูงสุด

---

## 🎯 Quick Reference: เลือกวิธีไหนดี?

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

## 💡 Best Practices

1. **ไฟล์ < 800 บรรทัด** → ใช้ `view_file` อ่านทั้งหมดได้เลย
2. **ไฟล์ > 800 บรรทัด** → ใช้ Search Methods ก่อน แล้วค่อย `view_file` + line range
3. **ไฟล์ภาษาไทย/Emoji** → ใช้ PowerShell `Select-String` เสมอ
4. **Source code** → ใช้ `view_file_outline` + `view_code_item`
5. **หาไฟล์** → ใช้ `find_by_name`

