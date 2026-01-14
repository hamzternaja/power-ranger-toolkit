# 📋 Code Snippets Library

> โค้ดสำเร็จรูปที่ใช้บ่อย — Copy ไปใช้ได้เลย

---

## 📂 Categories

| Category | Snippets |
|----------|----------|
| File Operations | #1, #2 |
| String Manipulation | #3, #4 |
| Array/List | #5, #6 |
| Validation | #7 |

---

## Snippet #1: Read/Write JSON (Python)

```python
import json

# Read
def read_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

# Write
def write_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
```

---

## Snippet #2: Read/Write JSON (JavaScript)

```javascript
const fs = require('fs');

// Read
const readJSON = (filepath) => JSON.parse(fs.readFileSync(filepath, 'utf8'));

// Write
const writeJSON = (filepath, data) => 
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
```

---

## Snippet #3: Slugify String (Python)

```python
import re

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text
```

---

## Snippet #4: Truncate String

```javascript
const truncate = (str, length, ending = '...') => 
    str.length > length ? str.slice(0, length - ending.length) + ending : str;
```

---

## Snippet #5: Chunk Array

```javascript
const chunk = (arr, size) => 
    Array.from({length: Math.ceil(arr.length / size)}, (_, i) => 
        arr.slice(i * size, i * size + size)
    );
```

```python
def chunk(lst, size):
    return [lst[i:i + size] for i in range(0, len(lst), size)]
```

---

## Snippet #6: Remove Duplicates

```javascript
const unique = (arr) => [...new Set(arr)];
```

```python
def unique(lst):
    return list(dict.fromkeys(lst))  # Preserves order
```

---

## Snippet #7: Email Validation

```javascript
const isValidEmail = (email) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

```python
import re

def is_valid_email(email):
    pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return bool(re.match(pattern, email))
```

---

## Snippet #8: Async Sleep/Delay

```javascript
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Usage
await sleep(1000); // Wait 1 second
```

```python
import asyncio

async def main():
    await asyncio.sleep(1)  # Wait 1 second
```

---

## Snippet #9: Deep Clone Object

```javascript
// Simple (no functions/dates)
const clone = obj => JSON.parse(JSON.stringify(obj));

// Better (handles more types)
const deepClone = obj => structuredClone(obj);
```

```python
import copy
clone = copy.deepcopy(original)
```

---

## Snippet #10: Date Formatting

```javascript
const formatDate = (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    const pad = n => String(n).padStart(2, '0');
    
    return format
        .replace('YYYY', d.getFullYear())
        .replace('MM', pad(d.getMonth() + 1))
        .replace('DD', pad(d.getDate()))
        .replace('HH', pad(d.getHours()))
        .replace('mm', pad(d.getMinutes()));
};

formatDate(new Date(), 'YYYY-MM-DD HH:mm'); // "2024-01-15 14:30"
```

```python
from datetime import datetime

date = datetime.now()
formatted = date.strftime('%Y-%m-%d %H:%M')  # "2024-01-15 14:30"
```

---

## Snippet #11: Fetch with Timeout

```javascript
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(id);
    }
}
```

---

## Snippet #12: Safe Object Access

```javascript
const get = (obj, path, defaultValue = undefined) => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        result = result?.[key];
        if (result === undefined) return defaultValue;
    }
    
    return result;
};

// Usage
get(user, 'profile.address.city', 'Unknown'); // Safe access
```

---

## Snippet #13: Debounced Input Handler

```javascript
function createDebouncedSearch(searchFn, delay = 300) {
    let timer;
    return function(query) {
        clearTimeout(timer);
        timer = setTimeout(() => searchFn(query), delay);
    };
}

// Usage
input.addEventListener('input', createDebouncedSearch(query => {
    fetch(`/api/search?q=${query}`);
}, 500));
```

---

## Snippet #14: File Size Formatter

```javascript
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

formatBytes(1234567); // "1.18 MB"
```

---

## Snippet #15: Random String Generator

```javascript
const randomString = (length = 10) => 
    Array.from({length}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        .charAt(Math.floor(Math.random() * 62))).join('');
```

```python
import secrets
import string

def random_string(length=10):
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))
```

---

## Snippet #16: Parallel Promise Execution with Limit

```javascript
async function parallelLimit(tasks, limit = 3) {
    const results = [];
    const executing = [];
    
    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        
        if (tasks.length >= limit) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= limit) await Promise.race(executing);
        }
    }
    
    return Promise.all(results);
}
```

---

## Snippet #17: Group Array by Key

```javascript
const groupBy = (arr, key) => arr.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
}, {});

// Usage
groupBy(users, 'role'); // { admin: [...], user: [...] }
```

```python
from itertools import groupby
from operator import itemgetter

def group_by(items, key):
    sorted_items = sorted(items, key=itemgetter(key))
    return {k: list(v) for k, v in groupby(sorted_items, key=itemgetter(key))}
```

---

## Snippet #18: URL Query String Builder

```javascript
const buildQueryString = params => 
    Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');

buildQueryString({ page: 1, limit: 10, search: 'hello' }); 
// "page=1&limit=10&search=hello"
```

---

## Snippet #19: Local Storage with Expiry

```javascript
const storage = {
    set(key, value, expireMinutes = 60) {
        const item = {
            value,
            expiry: Date.now() + expireMinutes * 60 * 1000
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    get(key) {
        const item = JSON.parse(localStorage.getItem(key));
        if (!item) return null;
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    }
};

// Usage
storage.set('token', 'abc123', 30); // Expires in 30 minutes
storage.get('token'); // 'abc123' or null if expired
```

---

## Snippet #20: Try-Catch Wrapper

```javascript
const tryCatch = async (fn, fallback = null) => {
    try {
        return await fn();
    } catch (e) {
        console.error(e);
        return fallback;
    }
};

// Usage
const data = await tryCatch(() => fetch('/api').then(r => r.json()), []);
```

---

## 📝 Template

```markdown
## Snippet #N: [Name]

\`\`\`language
// code
\`\`\`
```

---

> 💡 เพิ่ม snippet ใหม่เมื่อเจอโค้ดที่ใช้บ่อย


---

## Snippet #21: HTTP Status Check

```javascript
const isSuccess = status => status >= 200 && status < 300;
const isClientError = status => status >= 400 && status < 500;
const isServerError = status => status >= 500;
```

---

## Snippet #22: Array Shuffle

```javascript
const shuffle = arr => arr.sort(() => Math.random() - 0.5);
```

---

## Snippet #23: Object Pick/Omit

```javascript
const pick = (obj, keys) => 
    Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));

const omit = (obj, keys) => 
    Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
```

---

## Snippet #24: Retry Until Success

```javascript
async function retryUntil(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try { return await fn(); } 
        catch (e) { if (i === maxRetries - 1) throw e; }
    }
}
```

---

## Snippet #25: Parse Query String

```javascript
const parseQuery = str => 
    Object.fromEntries(new URLSearchParams(str));

parseQuery('?page=1&limit=10'); // { page: '1', limit: '10' }
```

---

## Snippet #26: Capitalize First Letter

```javascript
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
```

---

## Snippet #27: Convert to Camel Case

```javascript
const camelCase = str => str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
```

---

## Snippet #28: Wait for Element

```javascript
async function waitForElement(selector, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const el = document.querySelector(selector);
        if (el) return el;
        await new Promise(r => setTimeout(r, 100));
    }
    throw new Error('Element not found');
}
```

---

## Snippet #29: Copy to Clipboard

```javascript
async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text);
}
```

---

## Snippet #30: Download File

```javascript
function downloadFile(data, filename, type = 'application/json') {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
```

---

## Snippet #31: Format Number with Commas

```javascript
const formatNumber = n => n.toLocaleString();
formatNumber(1234567); // "1,234,567"
```

---

## Snippet #32: Pluralize Word

```javascript
const pluralize = (count, singular, plural = singular + 's') =>
    count === 1 ? singular : plural;

pluralize(5, 'item'); // "items"
```

---

## Snippet #33: Is Mobile Device

```javascript
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
```

---

## Snippet #34: Color Hex to RGB

```javascript
const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
```

---

## Snippet #35: Escape HTML

```javascript
const escapeHtml = str => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
```

---

## 📦 Artifact Templates (Antigravity)

> Templates สำหรับสร้าง Artifacts ใน Antigravity IDE

---

## Snippet #36: task.md Template

```markdown
# Task: [ชื่อ Task]

> [คำอธิบายสั้นๆ]

---

## 📋 Checklist

### Phase 1: Setup
- [ ] สร้าง project structure
- [ ] ติดตั้ง dependencies
- [ ] ตั้งค่า environment

### Phase 2: Implementation
- [ ] สร้าง component หลัก
- [ ] เพิ่ม logic/functionality
- [ ] เชื่อมต่อ API

### Phase 3: Testing & Polish
- [ ] เขียน tests
- [ ] ทดสอบ edge cases
- [ ] Refactor & cleanup

---

## 📝 Notes

- **Dependencies**: [list]
- **Assumptions**: [list]
- **Blockers**: [if any]

---

## 📊 Progress

| Phase | Status | Progress |
|-------|--------|----------|
| Setup | ✅ Done | 100% |
| Implementation | 🔄 In Progress | 50% |
| Testing | ⬜ Pending | 0% |
```

---

## Snippet #37: implementation_plan.md Template

```markdown
# Implementation Plan: [ชื่อ Feature]

> [คำอธิบายเป้าหมาย]

---

## 🎯 Goal

[อธิบายว่าต้องการทำอะไร และทำไปทำไม]

---

## ⚠️ User Review Required

> [!IMPORTANT]
> กรุณาตรวจสอบ:
> - [รายการที่ต้อง review]
> - [Breaking changes ถ้ามี]

---

## 📁 Proposed Changes

### Component: [ชื่อ Component 1]

#### [NEW] `path/to/new-file.ts`
- สร้างไฟล์ใหม่สำหรับ [หน้าที่]
- ประกอบด้วย: [functions/classes]

#### [MODIFY] `path/to/existing-file.ts`
- เพิ่ม [feature]
- แก้ไข [logic]

#### [DELETE] `path/to/old-file.ts`
- ลบเนื่องจาก [เหตุผล]

---

### Component: [ชื่อ Component 2]

#### [MODIFY] `path/to/file.ts`
- [รายละเอียดการแก้ไข]

---

## ✅ Verification Plan

### Automated Tests
```bash
npm test
npm run test:e2e
```

### Manual Verification
1. [ ] ทดสอบ [scenario 1]
2. [ ] ทดสอบ [scenario 2]
3. [ ] ตรวจสอบ UI บน browser

---

## 📊 Impact Analysis

| Area | Impact | Risk |
|------|--------|------|
| Performance | Low | 🟢 |
| Security | None | 🟢 |
| Breaking Changes | None | 🟢 |
```

---

## Snippet #38: walkthrough.md Template

```markdown
# Walkthrough: [ชื่อ Feature]

> สรุปสิ่งที่ทำเสร็จแล้ว

---

## ✅ What Was Done

### Changes Made
1. **[Component 1]**: [สิ่งที่ทำ]
2. **[Component 2]**: [สิ่งที่ทำ]
3. **[Component 3]**: [สิ่งที่ทำ]

### Files Changed
| File | Change |
|------|--------|
| `path/to/file1.ts` | Added [feature] |
| `path/to/file2.ts` | Modified [logic] |
| `path/to/file3.ts` | Deleted |

---

## 🧪 Testing Results

### Automated Tests
```
✅ All tests passed (25/25)
✅ Coverage: 85%
```

### Manual Testing
- [x] Tested [scenario 1] - ✅ Works
- [x] Tested [scenario 2] - ✅ Works
- [x] Tested edge cases - ✅ Works

---

## 📸 Screenshots

![Feature Demo](/path/to/screenshot.png)

---

## 🎬 Browser Recording

![Demo Video](/path/to/recording.webp)

---

## 📝 Notes

- **Known Issues**: [if any]
- **Future Improvements**: [suggestions]
- **Dependencies Added**: [list]

---

## 🔗 Related

- Implementation Plan: [link]
- Task: [link]
- PR: [link]
```

---

## Snippet #39: Quick task.md (Minimal)

```markdown
# Task: [Name]

## Checklist
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

## Notes
- [Note 1]
```

---

## Snippet #40: Quick implementation_plan.md (Minimal)

```markdown
# Plan: [Name]

## Goal
[What to achieve]

## Changes
- [NEW] `file1.ts` - [purpose]
- [MODIFY] `file2.ts` - [changes]

## Verification
- [ ] Run tests
- [ ] Manual check
```

---

> 💡 **Tip**: ใช้ Quick templates สำหรับงานเล็ก, Full templates สำหรับงานซับซ้อน
