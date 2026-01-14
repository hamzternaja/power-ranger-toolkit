# 📚 Lessons Learned

> บทเรียนจากประสบการณ์ — อ่านเพื่อหลีกเลี่ยงความผิดพลาดเดิม!

---

## 🏷️ Categories

| Category | Lessons |
|----------|---------|
| 🗂️ File System | #1 |
| 🖥️ Terminal/PTY | #2, #3 |
| 🔌 Connections | #4, #24 |
| 🧪 Testing | #5 |
| 🎨 UI/UX | #6 |
| 📸 Image Detection | #7 |

---

## Lesson #1: Always Check Nested Folders 🗂️

### 📋 Context
- **Project**: TikTok Auto-Uploader
- **Date**: 2026-01-10

### ❌ What Went Wrong
ไม่ได้คิดถึง nested `Uploaded/` folder เมื่อ scan for video files

### ✅ What I Learned
> เมื่อ scan directory ต้องพิจารณา:
> 1. Subdirectories ที่ควร include/exclude
> 2. Recursive vs non-recursive scan
> 3. Special folders (hidden, system, output folders)

### 🛡️ Prevention
```javascript
// Always define explicit exclusions
const EXCLUDED_DIRS = ['Uploaded', 'Archive', 'Temp', 'node_modules'];

function scanWithExclusions(dir) {
    return fs.readdirSync(dir).filter(item => 
        !EXCLUDED_DIRS.includes(item)
    );
}
```

---

## Lesson #2: Non-Existent ≠ Busy 🖥️

### 📋 Context
- **Project**: Self-Improvement Engine
- **Date**: 2026-01-09

### ❌ What Went Wrong
`get_idle_seconds()` return 0 สำหรับ terminal ที่ยังไม่มี → ถูกตีความว่า busy

### ✅ What I Learned
> Handle "not found" cases แยกจาก "exists but X" cases:
> - Not found = unknown state → มักจะ = available
> - Exists but idle = available
> - Exists but busy = unavailable

### 🛡️ Prevention
```python
def get_resource_state(resource_id):
    resource = self.resources.get(resource_id)
    
    if resource is None:
        return "NOT_FOUND"  # Don't return "BUSY"!
    elif resource.is_busy():
        return "BUSY"
    else:
        return "AVAILABLE"
```

---

## Lesson #3: Buffer PTY Output Properly 🖥️

### 📋 Context
- **Project**: Self-Improvement Engine
- **Date**: 2026-01-08

### ❌ What Went Wrong
Terminal output หายไป เพราะ read เร็วเกินไป ก่อนที่ data จะมา

### ✅ What I Learned
> PTY/Terminal I/O ต้อง:
> 1. Use non-blocking reads
> 2. Implement proper polling/select
> 3. Handle partial reads
> 4. Buffer output for later retrieval

### 🛡️ Prevention
```python
import select

def safe_read(fd, timeout=0.1):
    readable, _, _ = select.select([fd], [], [], timeout)
    if readable:
        return os.read(fd, 4096)
    return b''
```

---

## Lesson #4: Connection Timeouts Need Feedback 🔌

### 📋 Context
- **Project**: TitanMirror
- **Date**: 2026-01-10

### ❌ What Went Wrong
QR code connection timeout โดยไม่มี feedback ให้ user

### ✅ What I Learned
> Long-running operations ต้อง:
> 1. Show progress indicator
> 2. Provide timeout feedback
> 3. Allow cancellation
> 4. Explain what's happening

### 🛡️ Prevention
```javascript
async function connectWithFeedback(timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        updateUI(`Connecting... ${Math.round((Date.now() - startTime) / 1000)}s`);
        
        if (await tryConnect()) {
            return true;
        }
        await sleep(1000);
    }
    
    showError("Connection timed out. Please try again.");
    return false;
}
```

---

## Lesson #5: Test Edge Cases First 🧪

### 📋 Context
- **Project**: All
- **Date**: Ongoing

### ❌ What Went Wrong
มักจะลืม test edge cases เช่น:
- Empty arrays/objects
- Null/undefined values
- Very long strings
- Special characters

### ✅ What I Learned
> ก่อน implement logic ให้คิด edge cases ก่อน:
> 1. What if input is empty?
> 2. What if input is null?
> 3. What if input is huge?
> 4. What if input has special chars?

### 🛡️ Prevention
```javascript
// Always validate input first
function processInput(input) {
    // Edge case checks FIRST
    if (!input) return { error: "No input" };
    if (!Array.isArray(input)) input = [input];
    if (input.length === 0) return { result: [] };
    if (input.length > MAX_ITEMS) return { error: "Too many items" };
    
    // Then normal processing
    return input.map(item => process(item));
}
```

---

## Lesson #6: Show Loading States 🎨

### 📋 Context
- **Project**: All UI projects
- **Date**: Ongoing

### ❌ What Went Wrong
UI freeze ระหว่าง async operations โดยไม่มี loading indicator

### ✅ What I Learned
> ทุก async operation ควรมี:
> 1. Loading state
> 2. Success state
> 3. Error state
> 4. Disabled buttons during loading

### 🛡️ Prevention
```javascript
async function handleClick() {
    setLoading(true);
    setError(null);
    
    try {
        const result = await doAsyncWork();
        setSuccess(result);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
}
```

---

## Lesson #7: Template Matching Needs Location & Color Validation 📸

### 📋 Context
- **Project**: AI Watchdog Extension
- **Date**: 2026-01-11

### ❌ What Went Wrong
Template matching หา Stop button ได้ที่ taskbar และ UI elements อื่นๆ 
ทำให้ระบบคิดว่า AI กำลังทำงานตลอด (false positive)

### ✅ What I Learned
> Template matching อย่างเดียวไม่พอ! ต้อง:
> 1. **Validate location** - ต้องอยู่ในพื้นที่ที่คาดหวัง (ไม่ใช่ taskbar, ขอบจอ)
> 2. **Validate color** - ตรวจสอบสีจริงที่ตำแหน่งที่พบ
> 3. **Set high threshold** - ใช้ threshold สูง (>0.85) เพื่อลด false positives
> 4. **Disable fallback methods** ที่มี false positives สูง

### 🛡️ Prevention
```python
def detect_with_validation(screenshot, template, threshold=0.85):
    # Template matching
    result = cv2.matchTemplate(screenshot, template, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, max_loc = cv2.minMaxLoc(result)
    
    if max_val < threshold:
        return False, None
    
    x, y = max_loc
    screen_h, screen_w = screenshot.shape[:2]
    
    # Location validation
    if y > screen_h - 50:  # Taskbar area
        return False, None
    if x > screen_w - 100:  # Right edge
        return False, None
    
    # Color validation
    pixel = screenshot[y + template.shape[0]//2, x + template.shape[1]//2]
    if not is_expected_color(pixel):
        return False, None
    
    return True, max_loc
```

---

## 📝 Lesson Template

```markdown
## Lesson #N: [Short Title] [Emoji]

### 📋 Context
- **Project**: [Name]
- **Date**: YYYY-MM-DD

### ❌ What Went Wrong
[อธิบายความผิดพลาด]

### ✅ What I Learned
> [บทเรียนสำคัญ - ใช้ quote block]

### 🛡️ Prevention
\`\`\`language
// code ป้องกัน
\`\`\`
```

---

> 💡 **เพิ่มบทเรียนใหม่ทุกครั้งที่เจอปัญหา!** อนาคตจะได้ไม่ต้องเจอซ้ำ

---

## Lesson #8: DOM click() Doesn't Work on Custom Buttons 🖱️

### 📋 Context
- **Project**: Antigravity Auto-Accept Extension
- **Date**: 2026-01-11

### ❌ What Went Wrong
1. JavaScript `element.click()` และ `MouseEvent` ไม่สามารถกดปุ่ม Accept ได้
2. VBS background service inject code ไม่สม่ำเสมอ - บางครั้งทำงาน บางครั้งไม่ทำงาน

### 🔍 Root Cause Analysis

**ปัญหาที่ 1: DOM Event ไม่ถูก capture**
- Custom UI frameworks (Antigravity/VS Code) ใช้ event system พิเศษ
- `click()` อย่างเดียวไม่พอ ต้องใช้ `PointerEvent` ด้วย

**ปัญหาที่ 2: VBS/PowerShell CDP injection ไม่เสถียร**
- Timing issues: PowerShell WebSocket มี timeout 5 วินาที
- ถ้า Antigravity ยังไม่พร้อม → WebSocket fail silently
- `window.AA5` check ป้องกัน re-injection แต่ถ้า first injection fail → code ไม่เคยถูก inject
- PowerShell `$ErrorActionPreference = "SilentlyContinue"` ซ่อน error ทั้งหมด

**ปัญหาที่ 3: Multiple pages**
- Antigravity มีหลาย pages (DevTools, Launchpad, Main workbench)
- Script อาจ inject ไปที่ page ผิด (เช่น Launchpad แทน Main)

### ✅ What I Learned
> 1. `click()` + `PointerEvent` (pointerdown + pointerup) รวมกันถึงจะ work
> 2. ต้อง target ด้วย class ที่ specific เช่น `bg-ide-button-background`
> 3. Background CDP injection via PowerShell **ไม่เสถียร** เท่า manual Console paste
> 4. ต้อง inject ไปที่ page ที่ถูกต้อง (title มี "Antigravity" และ type เป็น "page")

### 🛡️ Prevention
```javascript
// สำหรับ custom buttons ให้ใช้ทั้ง click และ PointerEvent
function clickCustomButton(element) {
    element.click();
    element.dispatchEvent(new PointerEvent("pointerdown", {bubbles: true}));
    element.dispatchEvent(new PointerEvent("pointerup", {bubbles: true}));
}

// Target ด้วย class ที่ specific
var btns = document.querySelectorAll("button.bg-ide-button-background");
```

### 📝 Working Code (Auto-Accept v5) - **RELIABLE: Console Paste**
```javascript
(function(){if(window.AA5)return;window.AA5={c:0,run:function(){setInterval(function(){var btns=document.querySelectorAll("button.bg-ide-button-background");for(var i=0;i<btns.length;i++){var b=btns[i];if((b.textContent||"").indexOf("Accept")>=0&&b.textContent.indexOf("Reject")<0){b.click();b.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));b.dispatchEvent(new PointerEvent("pointerup",{bubbles:true}));this.c++;console.log("[AA5] Clicked Accept:",this.c);return}}var spans=document.querySelectorAll("span.bg-ide-button-background");for(var j=0;j<spans.length;j++){var s=spans[j];if(s.textContent.trim()==="Accept all"){s.click();s.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));s.dispatchEvent(new PointerEvent("pointerup",{bubbles:true}));this.c++;console.log("[AA5] Clicked Accept all:",this.c);return}}}.bind(this),1500)}};window.AA5.run();console.log("Auto Accept v5 Started!")})();
```

### 📊 Method Comparison
| Method | Reliability | Ease of Use |
|--------|-------------|-------------|
| Console Paste | ⭐⭐⭐⭐⭐ 100% | ต้อง paste ทุกครั้ง |
| VBS + PowerShell CDP | ⭐⭐ ~50% | Automatic แต่ไม่เสถียร |
| AutoHotkey | ⭐⭐⭐⭐ 90% | ต้อง install AHK |

### 💡 Recommendation
**ใช้ Console Paste** เพราะ reliable ที่สุด หรือถ้าต้องการ automatic ใช้ **AutoHotkey** ส่ง Alt+Enter แทน

---

## Lesson #9: Large Files Need Streaming 📁

### 📋 Context
- **Project**: Knowledge Base Sync
- **Date**: 2026-01-12

### ❌ What Went Wrong
ใช้ `re.findall()` บนไฟล์ 1.2GB ทำให้ใช้ memory สูงมากและ regex timeout

### ✅ What I Learned
> ไฟล์ใหญ่ (>100MB) ต้อง:
> 1. อ่านแบบ streaming (line by line)
> 2. Process ทีละส่วน ไม่โหลดทั้งหมดเข้า memory
> 3. ใช้ state machine แทน regex บนทั้ง file

### 🛡️ Prevention
```python
# ❌ Bad: Load entire file
content = open(huge_file).read()
matches = re.findall(pattern, content)

# ✅ Good: Stream line by line
with open(huge_file) as f:
    for line in f:
        process_line(line)
```

---

## Lesson #10: Double-Check Status Sync 🔄

### 📋 Context
- **Project**: Knowledge Base Management
- **Date**: 2026-01-12

### ❌ What Went Wrong
`problems.md` บอกว่ามี 436 Pending แต่ `solutions.md` มี solutions ครบทั้ง 1000 ข้อแล้ว

### ✅ What I Learned
> เมื่อมี data ซ้ำกันหลายที่ ต้อง:
> 1. กำหนดแหล่ง "source of truth" เดียว
> 2. Sync status ไปที่เดียวกัน
> 3. ตรวจสอบความสอดคล้อง periodically

### 🛡️ Prevention
```python
# ตรวจสอบความสอดคล้อง
def verify_sync():
    solved_in_problems = count_solved("problems.md")
    total_solutions = count_solutions("solutions.md")
    
    if solved_in_problems != total_solutions:
        log_warning(f"Mismatch! Problems: {solved_in_problems}, Solutions: {total_solutions}")
        sync_status()
```

---

## Lesson #11: localStorage is Per-Origin 🌐

### 📋 Context
- **Project**: Auto-Accept Console Script
- **Date**: 2026-01-11

### ❌ What Went Wrong
Script ถูก inject ที่หลาย pages และ localStorage ไม่ share ระหว่าง origins

### ✅ What I Learned
> `localStorage` ถูกแยกตาม origin (protocol + domain + port):
> - `http://localhost:8000` ≠ `http://localhost:3000`
> - Settings ที่ save ใน page หนึ่งจะไม่เห็นใน page อื่น

### 🛡️ Prevention
```javascript
// ตรวจสอบ origin ก่อน save
const EXPECTED_ORIGIN = 'http://localhost:8000';

function saveSettings(settings) {
    if (window.location.origin !== EXPECTED_ORIGIN) {
        console.warn('Saving to different origin!');
    }
    localStorage.setItem('settings', JSON.stringify(settings));
}
```

---

## Lesson #12: Async Loop Pitfalls 🔁

### 📋 Context
- **Project**: TikTok Auto-Uploader
- **Date**: 2026-01-10

### ❌ What Went Wrong
`forEach` กับ async function ไม่ทำงานตามที่คาด - ลูปจบก่อน async work เสร็จ

### ✅ What I Learned
> `forEach` ไม่รอ async! ต้องใช้:
> - `for...of` กับ `await`
> - `Promise.all()` กับ `map()`

### 🛡️ Prevention
```javascript
// ❌ Bad: forEach doesn't wait
items.forEach(async (item) => {
    await processAsync(item);  // Won't wait!
});

// ✅ Good: for...of waits
for (const item of items) {
    await processAsync(item);
}

// ✅ Good: Parallel with Promise.all
await Promise.all(items.map(item => processAsync(item)));
```

---

## Lesson #13: Webhook Rate Limits 📡

### 📋 Context
- **Project**: Discord Notification Integration
- **Date**: 2026-01-11

### ❌ What Went Wrong
Discord webhook ถูก rate limit เพราะส่ง notification ทุกครั้งที่ AI ทำงาน

### ✅ What I Learned
> Webhooks มักมี rate limits:
> - Discord: 30 requests per minute
> - Slack: 1 request per second
> ต้อง debounce หรือ batch notifications

### 🛡️ Prevention
```javascript
let lastNotification = 0;
const COOLDOWN_MS = 60000; // 1 minute

function sendNotification(message) {
    const now = Date.now();
    if (now - lastNotification < COOLDOWN_MS) {
        console.log('Skipping notification (cooldown)');
        return;
    }
    
    lastNotification = now;
    fetch(webhookUrl, { method: 'POST', body: JSON.stringify({ content: message }) });
}
```

---

## Lesson #14: iframe Content Access 🖼️

### 📋 Context
- **Project**: Auto-Accept Extension
- **Date**: 2026-01-11

### ❌ What Went Wrong
Script ไม่สามารถเข้าถึง elements ใน iframe ได้เนื่องจาก Same-Origin Policy

### ✅ What I Learned
> Cross-origin iframes ถูก block โดย browser security:
> - ใช้ `contentDocument` ได้เฉพาะ same-origin
> - ต้อง inject script เข้า iframe โดยตรง หรือใช้ postMessage

### 🛡️ Prevention
```javascript
function findInAllFrames(selector) {
    // Main document
    let element = document.querySelector(selector);
    if (element) return element;
    
    // Try iframes (same-origin only)
    const frames = document.querySelectorAll('iframe');
    for (const frame of frames) {
        try {
            element = frame.contentDocument?.querySelector(selector);
            if (element) return element;
        } catch (e) {
            // Cross-origin - can't access
            console.log('Cross-origin iframe, skipping');
        }
    }
    return null;
}
```

---

## Lesson #15: Environment Variables Casing 🔤

### 📋 Context
- **Project**: Node.js Config
- **Date**: General

### ❌ What Went Wrong
`process.env.NODE_ENV` ไม่ตรงกับ `"Production"` เพราะเป็น `"production"` (lowercase)

### ✅ What I Learned
> Environment variables:
> - Windows: case-insensitive
> - Linux/Mac: case-sensitive
> ควร normalize ก่อนเปรียบเทียบ

### 🛡️ Prevention
```javascript
const env = (process.env.NODE_ENV || 'development').toLowerCase();

if (env === 'production') {
    // Safe comparison
}
```

---

## Lesson #16: Git Large File Handling 📦

### 📋 Context
- **Project**: Knowledge Base
- **Date**: 2026-01-12

### ❌ What Went Wrong
พยายาม commit ไฟล์ 1.2GB ทำให้ git ช้ามากและ push fail

### ✅ What I Learned
> ไฟล์ใหญ่ใน git:
> - GitHub limit: 100MB per file
> - ใช้ Git LFS สำหรับไฟล์ใหญ่
> - หรือเก็บนอก repo

### 🛡️ Prevention
```bash
# .gitignore
*.log
*.zip
large-data/

# Or use Git LFS
git lfs install
git lfs track "*.bin" "*.csv"
```

---

## Lesson #17: PowerShell Special Characters 💻

### 📋 Context
- **Project**: Automation Scripts
- **Date**: 2026-01-12

### ❌ What Went Wrong
PowerShell command มี `$` และ `|` ทำให้ string interpolation ผิดพลาด

### ✅ What I Learned
> PowerShell ใช้ `$` สำหรับ variables และ `|` สำหรับ pipe:
> - ใช้ single quotes `'text'` เพื่อ literal string
> - หรือ escape ด้วย backtick `` ` ``

### 🛡️ Prevention
```powershell
# ❌ Bad: $content gets interpolated
"Replace $content with new"

# ✅ Good: Single quotes for literal
'Replace $content with new'

# ✅ Good: Escape with backtick
"Replace `$content with new"
```

---

## Lesson #18: API Pagination 📄

### 📋 Context
- **Project**: Data Fetching
- **Date**: General

### ❌ What Went Wrong
API return เพียง 100 items แต่มีข้อมูล 5000+ ทำให้ได้ข้อมูลไม่ครบ

### ✅ What I Learned
> APIs มักมี pagination:
> - `limit` / `offset`
> - `page` / `per_page`
> - `cursor` / `next_token`
> ต้อง loop จนกว่าจะได้ข้อมูลครบ

### 🛡️ Prevention
```javascript
async function fetchAllPages(url) {
    let allData = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        const response = await fetch(`${url}?page=${page}&limit=100`);
        const data = await response.json();
        
        allData = allData.concat(data.items);
        hasMore = data.hasMore;
        page++;
    }
    
    return allData;
}
```

---

## Lesson #19: Browser DevTools Execution Context 🔧

### 📋 Context
- **Project**: Auto-Accept Console Script
- **Date**: 2026-01-11

### ❌ What Went Wrong
Script ถูก inject ผ่าน CDP แต่ run ที่ context ผิด (DevTools page แทน main page)

### ✅ What I Learned
> เมื่อใช้ CDP (Chrome DevTools Protocol):
> - เลือก target page ที่ถูกต้อง
> - ตรวจสอบ `type: "page"` ไม่ใช่ `"other"`
> - Check title ให้ตรงกับ app ที่ต้องการ

### 🛡️ Prevention
```python
def find_correct_page(pages):
    for page in pages:
        if page.get('type') == 'page' and 'Antigravity' in page.get('title', ''):
            return page['webSocketDebuggerUrl']
    return None
```

---

## Lesson #20: Regex Greediness .*

### 📋 Context
- **Project**: Text Parsing
- **Date**: 2026-01-12

### ❌ What Went Wrong
`.*` กิน text มากเกินไป ทำให้ match ข้ามหลาย sections

### ✅ What I Learned
> `.*` เป็น greedy - จะ match มากที่สุดเท่าที่ได้
> ใช้ `.*?` (non-greedy) เพื่อ match น้อยที่สุด

### 🛡️ Prevention
```python
import re

text = "Start...End Start...End"

# ❌ Greedy: matches everything
re.findall(r'Start(.*)End', text)  # ['...End Start...']

# ✅ Non-greedy: matches shortest
re.findall(r'Start(.*?)End', text)  # ['...', '...']
```

---

## 📝 Lesson Template

```markdown
## Lesson #N: [Short Title] [Emoji]

### 📋 Context
- **Project**: [Name]
- **Date**: YYYY-MM-DD

### ❌ What Went Wrong
[อธิบายความผิดพลาด]

### ✅ What I Learned
> [บทเรียนสำคัญ - ใช้ quote block]

### 🛡️ Prevention
\`\`\`language
// code ป้องกัน
\`\`\`
```

---

> 💡 **เพิ่มบทเรียนใหม่ทุกครั้งที่เจอปัญหา!** อนาคตจะได้ไม่ต้องเจอซ้ำ


---

## Lesson #21: Memory Leaks in setInterval ⏰

### 📋 Context
- **Project**: Long-running Scripts
- **Date**: General

### ❌ What Went Wrong
setInterval ไม่ถก clear ทำให้ scripts ทำงาน้ำๆ จน memory เตม

### ✅ What I Learned
> ทุก interval/timeout ต้องมี cleanup

### 🛡️ Prevention
`javascript
let id = null;
function start() {
    if (id) clearInterval(id);
    id = setInterval(() => doWork(), 1000);
}
`

---

## Lesson #22: CORS Preflight Requests 🌐

### 📋 Context
- **Project**: API Integration

### ❌ What Went Wrong
API call fail เพราะ browser ส่ง OPTIONS request ก่อน

### ✅ What I Learned
> Browser ส่ง preflight request ก่อน actual request

### 🛡️ Prevention
`javascript
app.options('*', cors());
`

---

## Lesson #23: Floating Point Precision 🔢

### ❌ What Went Wrong
0.1 + 0.2 !== 0.3

### ✅ What I Learned
> Use integers or round before display

### 🛡️ Prevention
`javascript
const total = Math.round((0.1 + 0.2) * 100) / 100;
`

---

## Lesson #24: SQL Injection Prevention 🔒

### ❌ What Went Wrong
User input in SQL query directly

### ✅ What I Learned
> Use parameterized queries always

### 🛡️ Prevention
`python
cursor.execute('SELECT * FROM users WHERE name = ?', (username,))
`

---

## Lesson #25: Race Conditions 🏃

### ❌ What Went Wrong
Multiple async ops modify same state

### ✅ What I Learned
> Use locking or serialize operations

---

## Lesson #26: Event Handler Memory Leaks 🎯

### ✅ What I Learned
> Always remove event listeners when done

---

## Lesson #27: Timezone Handling ⏰

### ✅ What I Learned
> Store as UTC, display in local timezone

---

## Lesson #28: Null vs Undefined Checks 🔍

### ✅ What I Learned
> Use value ?? defaultValue for nullish check

---

## Lesson #29: Circular Dependencies 🔄

### ✅ What I Learned
> Extract shared code to separate module

---

## Lesson #30: Unhandled Promise Rejections ⚠️

### ✅ What I Learned
> Every Promise must have .catch() or try/catch

