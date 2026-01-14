---
name: debugging
description: Systematic debugging workflow to find and fix bugs efficiently. Use this skill when troubleshooting errors, investigating issues, or when code doesn't work as expected.
---

# 🐛 Debugging Skill

## Workflow

### Step 1: Reproduce 🔄
```
- [ ] ทำซ้ำปัญหาให้ได้
- [ ] บันทึกขั้นตอนที่ทำให้เกิด error
- [ ] ตรวจสอบ error message/stack trace
```

### Step 2: Isolate 🎯
```
- [ ] หาไฟล์/function ที่เกี่ยวข้อง
- [ ] ใช้ console.log หรือ debugger
- [ ] ตัด code ออกทีละส่วนจนหาจุดที่พัง
```

### Step 3: Root Cause Analysis 🔬
```
- [ ] ถาม "ทำไม" 5 ครั้ง (5 Whys)
- [ ] ดู git blame/history
- [ ] ตรวจ dependencies versions
```

### Step 4: Fix 🔧
```
- [ ] แก้ไขที่ root cause ไม่ใช่ symptom
- [ ] ทำให้ fix เล็กที่สุดเท่าที่จะทำได้
- [ ] ไม่ทำให้อย่างอื่นพัง
```

### Step 5: Verify ✅
```
- [ ] ทดสอบว่า bug หายแล้ว
- [ ] ทดสอบ edge cases
- [ ] Run existing tests
```

### Step 6: Document 📝
```
- [ ] บันทึกลง solutions.md
- [ ] บันทึกลง lessons.md (ถ้าเรียนรู้อะไรใหม่)
- [ ] Update changelog
```

## Common Debugging Commands

```powershell
# Check process
Get-Process | Where-Object { $_.Name -like "*node*" }

# Check ports
netstat -ano | findstr ":3000"

# Kill process
Stop-Process -Name "node" -Force
```

## Decision Tree

```
Error occurred
├── Has error message? → Google it first
├── Works locally but not in prod? → Check env variables
├── Works yesterday? → Check git diff
└── Random/intermittent? → Check async/race conditions
```

---

## 🤖 AI-Assisted Debugging

### Auto Root Cause Analysis
| Error Pattern | Likely Cause | Fix Suggestion |
|--------------|--------------|----------------|
| `Cannot read property of undefined` | Missing null check | Add optional chaining `?.` |
| `ECONNREFUSED` | Service not running | Start the service |
| `CORS error` | Missing headers | Add CORS middleware |
| `Module not found` | Missing dependency | `npm install` |
| `Maximum call stack` | Infinite recursion | Check recursion base case |

### AI Debug Patterns
```javascript
// Pattern: Add context to errors
try {
  await processData(input);
} catch (error) {
  console.error('processData failed:', {
    input,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  throw error;
}
```

### Quick Fix Commands
```bash
# Clear caches
npm cache clean --force
rm -rf node_modules && npm install

# Reset DB
npx prisma migrate reset

# Check environment
node -e "console.log(process.env)"
```

---

## 🔧 Auto-Fix Suggestions

### Common Fixes
| Issue | Auto-Fix |
|-------|----------|
| TypeScript errors | Regenerate types |
| Build failures | Clear build cache |
| Test failures | Update snapshots |
| Lock file conflicts | Delete & regenerate |

### Debug Logging Template
```javascript
const DEBUG = process.env.DEBUG === 'true';

function log(...args) {
  if (DEBUG) console.log('[DEBUG]', new Date().toISOString(), ...args);
}
```
