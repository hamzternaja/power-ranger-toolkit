# 🎨 Design Patterns Learned

> รูปแบบการเขียนโค้ดที่เรียนรู้จากการทำโจทย์และโปรเจกต์

---

## 📊 Quick Find

| Category | Patterns |
|----------|----------|
| Algorithm | #1, #2 |
| Data Structure | #3 |
| Error Handling | #4 |
| Async | #5 |

---

## Pattern #1: Binary Search Template

**Category**: Algorithm
**Language**: Python/JavaScript
**Learned From**: Problem solving practice

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found
```

**When to use**: ค้นหาใน sorted array, O(log n)

---

## Pattern #2: Two Pointer Technique

**Category**: Algorithm
**Language**: Python/JavaScript
**Learned From**: Array problems

```python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return None
```

**When to use**: หาคู่ใน sorted array, ลด substring

---

## Pattern #3: Hash Map for Counting

**Category**: Data Structure
**Language**: Python
**Learned From**: Frequency problems

```python
from collections import Counter

def count_frequency(items):
    return Counter(items)

# หรือ manual
def count_manual(items):
    freq = {}
    for item in items:
        freq[item] = freq.get(item, 0) + 1
    return freq
```

**When to use**: นับความถี่, หา duplicates

---

## Pattern #4: Try-Except with Specific Errors

**Category**: Error Handling
**Language**: Python
**Learned From**: PSI Engine debugging

```python
def safe_operation(data):
    try:
        result = risky_operation(data)
        return {"success": True, "data": result}
    except FileNotFoundError:
        return {"success": False, "error": "File not found"}
    except ValueError as e:
        return {"success": False, "error": str(e)}
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {"success": False, "error": "Unknown error"}
```

**When to use**: ทุกที่ที่อาจเกิด error

---

## Pattern #5: Async with Timeout

**Category**: Async
**Language**: JavaScript
**Learned From**: TitanMirror connection

```javascript
async function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), ms)
    );
    return Promise.race([promise, timeout]);
}

// Usage
try {
    const result = await withTimeout(fetchData(), 5000);
} catch (e) {
    if (e.message === 'Timeout') {
        console.log('Operation timed out');
    }
}
```

**When to use**: Network requests, long operations

---

## Pattern #6: Retry with Exponential Backoff

**Category**: Error Handling
**Language**: JavaScript
**Learned From**: API integrations

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            
            const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
            console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

// Usage
const data = await retryWithBackoff(() => fetch(url));
```

**When to use**: APIs ที่อาจ fail ชั่วคราว, network issues

---

## Pattern #7: Debounce Function

**Category**: Performance
**Language**: JavaScript
**Learned From**: UI/Input handling

```javascript
function debounce(fn, delay = 300) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Usage
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debounce(e => {
    performSearch(e.target.value);
}, 500));
```

**When to use**: Search inputs, resize handlers, scroll events

---

## Pattern #8: Singleton Pattern

**Category**: Design Pattern
**Language**: JavaScript
**Learned From**: Config/State management

```javascript
class Config {
    static #instance = null;
    
    constructor() {
        if (Config.#instance) {
            return Config.#instance;
        }
        Config.#instance = this;
        this.settings = {};
    }
    
    get(key) {
        return this.settings[key];
    }
    
    set(key, value) {
        this.settings[key] = value;
    }
}

// Usage - always returns same instance
const config1 = new Config();
const config2 = new Config();
config1 === config2; // true
```

**When to use**: Global config, logger, database connection

---

## Pattern #9: State Machine

**Category**: Algorithm
**Language**: Python
**Learned From**: File parsing

```python
class StateMachine:
    def __init__(self):
        self.state = 'IDLE'
        self.data = []
    
    def process(self, line):
        if self.state == 'IDLE':
            if line.startswith('## Problem'):
                self.state = 'IN_PROBLEM'
                self.data = [line]
        
        elif self.state == 'IN_PROBLEM':
            if line.startswith('### Solution'):
                self.state = 'IN_SOLUTION'
            self.data.append(line)
        
        elif self.state == 'IN_SOLUTION':
            if line.startswith('---'):
                self.state = 'IDLE'
                return self.process_complete()
            self.data.append(line)
    
    def process_complete(self):
        result = '\n'.join(self.data)
        self.data = []
        return result
```

**When to use**: Parsing structured text, Protocol handling

---

## Pattern #10: Factory Pattern

**Category**: Design Pattern
**Language**: Python
**Learned From**: Object creation

```python
class NotificationFactory:
    @staticmethod
    def create(type: str):
        if type == 'email':
            return EmailNotification()
        elif type == 'sms':
            return SMSNotification()
        elif type == 'push':
            return PushNotification()
        else:
            raise ValueError(f'Unknown type: {type}')

# Usage
notification = NotificationFactory.create('email')
notification.send("Hello!")
```

**When to use**: Multiple implementations ของ interface เดียว

---

## Pattern #11: Observer/Event Emitter

**Category**: Design Pattern
**Language**: JavaScript
**Learned From**: UI updates, notifications

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
        return () => this.off(event, callback);
    }
    
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    
    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(cb => cb(data));
    }
}

// Usage
const emitter = new EventEmitter();
const unsubscribe = emitter.on('update', data => console.log(data));
emitter.emit('update', { count: 42 });
unsubscribe(); // Clean up
```

**When to use**: Loose coupling, UI updates, plugin systems

---

## Pattern #12: Builder Pattern

**Category**: Design Pattern
**Language**: Python
**Learned From**: Complex object construction

```python
class QueryBuilder:
    def __init__(self):
        self._select = '*'
        self._from = None
        self._where = []
        self._order = None
    
    def select(self, fields):
        self._select = fields
        return self
    
    def from_table(self, table):
        self._from = table
        return self
    
    def where(self, condition):
        self._where.append(condition)
        return self
    
    def order_by(self, field):
        self._order = field
        return self
    
    def build(self):
        sql = f"SELECT {self._select} FROM {self._from}"
        if self._where:
            sql += f" WHERE {' AND '.join(self._where)}"
        if self._order:
            sql += f" ORDER BY {self._order}"
        return sql

# Usage
query = (QueryBuilder()
    .select('name, email')
    .from_table('users')
    .where('active = 1')
    .where('age > 18')
    .order_by('name')
    .build())
```

**When to use**: Complex objects with many optional parameters

---

## Pattern #13: Rate Limiter

**Category**: Performance
**Language**: JavaScript
**Learned From**: API calls, webhooks

```javascript
class RateLimiter {
    constructor(maxRequests, perMs) {
        this.maxRequests = maxRequests;
        this.perMs = perMs;
        this.requests = [];
    }
    
    async acquire() {
        const now = Date.now();
        this.requests = this.requests.filter(t => now - t < this.perMs);
        
        if (this.requests.length >= this.maxRequests) {
            const oldest = this.requests[0];
            const waitTime = this.perMs - (now - oldest);
            await new Promise(r => setTimeout(r, waitTime));
            return this.acquire();
        }
        
        this.requests.push(now);
        return true;
    }
}

// Usage: Max 5 requests per second
const limiter = new RateLimiter(5, 1000);
for (const item of items) {
    await limiter.acquire();
    await fetch(`/api/${item}`);
}
```

**When to use**: API rate limits, webhook throttling

---

## Pattern #14: Middleware Chain

**Category**: Architecture
**Language**: JavaScript
**Learned From**: Express.js, request processing

```javascript
class MiddlewareChain {
    constructor() {
        this.middlewares = [];
    }
    
    use(fn) {
        this.middlewares.push(fn);
        return this;
    }
    
    async execute(context) {
        let index = 0;
        
        const next = async () => {
            if (index < this.middlewares.length) {
                const middleware = this.middlewares[index++];
                await middleware(context, next);
            }
        };
        
        await next();
        return context;
    }
}

// Usage
const chain = new MiddlewareChain()
    .use(async (ctx, next) => { ctx.start = Date.now(); await next(); })
    .use(async (ctx, next) => { ctx.data = await fetchData(); await next(); })
    .use(async (ctx, next) => { ctx.duration = Date.now() - ctx.start; });

const result = await chain.execute({});
```

**When to use**: Request processing, pipeline transformations

---

## Pattern #15: Memoization

**Category**: Performance
**Language**: JavaScript/Python
**Learned From**: Expensive calculations

```javascript
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Usage
const expensiveFn = memoize((n) => {
    console.log('Computing...');
    return fibonacci(n);
});

expensiveFn(40); // Computing... (slow)
expensiveFn(40); // Instant (cached)
```

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function(n):
    return fibonacci(n)
```

**When to use**: Pure functions with expensive computation

---

## 📝 Template

```markdown
## Pattern #N: [Name]

**Category**: [Algorithm/Data Structure/Error Handling/Async/UI]
**Language**: [Python/JavaScript/etc]
**Learned From**: [Source]

\`\`\`language
// code
\`\`\`

**When to use**: [description]
```

---

> 💡 เพิ่ม pattern ใหม่ทุกครั้งที่เจอรูปแบบที่ใช้บ่อย


---

## Pattern #16: Throttle Function

**Category**: Performance
**Language**: JavaScript

`javascript
function throttle(fn, limit) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
}
`

**When to use**: Scroll events, resize handlers

---

## Pattern #17: Decorator Pattern

**Category**: Design Pattern
**Language**: Python

`python
def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f'Calling {func.__name__}')
        result = func(*args, **kwargs)
        print(f'Finished {func.__name__}')
        return result
    return wrapper

@log_calls
def my_function():
    pass
`

**When to use**: Add behavior without modifying original code

---

## Pattern #18: Repository Pattern

**Category**: Architecture
**Language**: Python

`python
class UserRepository:
    def __init__(self, db):
        self.db = db
    
    def find_by_id(self, id):
        return self.db.query('SELECT * FROM users WHERE id = ?', [id])
    
    def save(self, user):
        return self.db.execute('INSERT INTO users ...', [user])
`

**When to use**: Separate data access from business logic

---

## Pattern #19: Strategy Pattern

**Category**: Design Pattern
**Language**: JavaScript

`javascript
const strategies = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b
};

function calculate(strategy, a, b) {
    return strategies[strategy](a, b);
}

calculate('add', 5, 3); // 8
`

**When to use**: Multiple algorithms for same operation

---

## Pattern #20: Lazy Loading

**Category**: Performance
**Language**: JavaScript

`javascript
class LazyLoader {
    constructor(loadFn) {
        this.loadFn = loadFn;
        this.data = null;
        this.loaded = false;
    }
    
    async get() {
        if (!this.loaded) {
            this.data = await this.loadFn();
            this.loaded = true;
        }
        return this.data;
    }
}
`

**When to use**: Expensive resources loaded on demand

---

## Pattern #21: Command Pattern

**Category**: Design Pattern
**Language**: JavaScript

`javascript
class CommandHistory {
    constructor() {
        this.history = [];
    }
    
    execute(command) {
        command.execute();
        this.history.push(command);
    }
    
    undo() {
        const command = this.history.pop();
        if (command) command.undo();
    }
}
`

**When to use**: Undo/redo, action history

---

## Pattern #22: Pub/Sub Pattern

**Category**: Architecture
**Language**: JavaScript

`javascript
class PubSub {
    constructor() { this.subscribers = {}; }
    
    subscribe(topic, fn) {
        if (!this.subscribers[topic]) this.subscribers[topic] = [];
        this.subscribers[topic].push(fn);
        return () => this.unsubscribe(topic, fn);
    }
    
    publish(topic, data) {
        (this.subscribers[topic] || []).forEach(fn => fn(data));
    }
}
`

**When to use**: Decoupled components, event-driven

---

## Pattern #23: Circuit Breaker

**Category**: Reliability
**Language**: JavaScript

`javascript
class CircuitBreaker {
    constructor(fn, threshold = 3, timeout = 5000) {
        this.fn = fn; this.failures = 0;
        this.threshold = threshold; this.timeout = timeout;
        this.state = 'CLOSED';
    }
    
    async call(...args) {
        if (this.state === 'OPEN') throw new Error('Circuit open');
        try {
            const result = await this.fn(...args);
            this.failures = 0;
            return result;
        } catch (e) {
            if (++this.failures >= this.threshold) {
                this.state = 'OPEN';
                setTimeout(() => { this.state = 'CLOSED'; this.failures = 0; }, this.timeout);
            }
            throw e;
        }
    }
}
`

**When to use**: Prevent cascade failures, external service calls

---

## Pattern #24: Object Pool

**Category**: Performance
**Language**: JavaScript

`javascript
class ObjectPool {
    constructor(factory, size = 10) {
        this.factory = factory;
        this.pool = Array.from({length: size}, () => factory());
    }
    
    acquire() {
        return this.pool.pop() || this.factory();
    }
    
    release(obj) {
        this.pool.push(obj);
    }
}
`

**When to use**: Expensive object creation, connection pools

---

## Pattern #25: Validation Chain

**Category**: Data Validation
**Language**: JavaScript

`javascript
class Validator {
    constructor(value) {
        this.value = value;
        this.errors = [];
    }
    
    required() {
        if (!this.value) this.errors.push('Required');
        return this;
    }
    
    minLength(len) {
        if (this.value?.length < len) this.errors.push('Too short');
        return this;
    }
    
    isValid() { return this.errors.length === 0; }
}

new Validator(input).required().minLength(3).isValid();
`

**When to use**: Form validation, input checking



---

## Pattern #16: Throttle Function

**Category**: Performance
**Language**: JavaScript

```javascript
function throttle(fn, limit) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
}
```

**When to use**: Scroll events, resize handlers

---

## Pattern #17: Decorator Pattern

**Category**: Design Pattern
**Language**: Python

```python
def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f'Calling {func.__name__}')
        return func(*args, **kwargs)
    return wrapper

@log_calls
def my_function(): pass
```

---

## Pattern #18: Repository Pattern

**Category**: Architecture

```python
class UserRepository:
    def find_by_id(self, id): pass
    def save(self, user): pass
```

**When to use**: Separate data access from business logic

---

## Pattern #19: Strategy Pattern

**Category**: Design Pattern

```javascript
const strategies = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};
calculate('add', 5, 3); // 8
```

---

## Pattern #20: Lazy Loading

```javascript
class LazyLoader {
    constructor(loadFn) {
        this.loadFn = loadFn;
        this.data = null;
    }
    async get() {
        if (!this.data) this.data = await this.loadFn();
        return this.data;
    }
}
```

---

## Pattern #21: Command Pattern (Undo/Redo)

```javascript
class CommandHistory {
    history = [];
    execute(cmd) { cmd.execute(); this.history.push(cmd); }
    undo() { this.history.pop()?.undo(); }
}
```

---

## Pattern #22: Pub/Sub Pattern

```javascript
class PubSub {
    subs = {};
    subscribe(topic, fn) { (this.subs[topic] ??= []).push(fn); }
    publish(topic, data) { this.subs[topic]?.forEach(fn => fn(data)); }
}
```

---

## Pattern #23: Circuit Breaker

**When to use**: Prevent cascade failures in external service calls

---

## Pattern #24: Object Pool

**When to use**: Expensive object creation, connection pools

---

## Pattern #25: Validation Chain

```javascript
new Validator(input).required().minLength(3).isValid();
```

**When to use**: Form validation, input checking

---

## 🤖 Multi-Agent Patterns (Antigravity)

> รูปแบบการใช้หลาย Agents ทำงานพร้อมกัน

---

## Pattern #26: Parallel Tasks Pattern

**Category**: Multi-Agent
**Platform**: Antigravity IDE
**Learned From**: Large project development

```
┌─────────────────────────────────────────┐
│           Agent Manager                  │
├───────────┬───────────┬────────────────┤
│  Agent 1  │  Agent 2  │    Agent 3     │
│  Task A   │  Task B   │    Task C      │
│  (独立)    │  (独立)    │    (独立)       │
└───────────┴───────────┴────────────────┘
```

**วิธีใช้**:
1. สร้าง Agent ใหม่ใน Agent Manager
2. มอบหมายงานที่ **ไม่เกี่ยวข้องกัน** ให้แต่ละ Agent
3. ติดตามผ่าน Inbox

**When to use**: ทำหลายงานที่ไม่ overlap กัน เช่น:
- Agent 1: สร้าง Frontend
- Agent 2: สร้าง Backend API
- Agent 3: เขียน Documentation

---

## Pattern #27: Pipeline Pattern

**Category**: Multi-Agent
**Platform**: Antigravity IDE
**Learned From**: Sequential workflows

```
Agent 1 ───▶ Agent 2 ───▶ Agent 3
(Generate)   (Review)     (Test)
```

**วิธีใช้**:
1. Agent 1 สร้าง code
2. หยุด Agent 1, เริ่ม Agent 2 เพื่อ review
3. Agent 2 ส่งต่อให้ Agent 3 test

**When to use**: งานที่ต้องทำเป็นลำดับ เช่น:
- Code → Review → Test → Deploy
- Design → Implement → Verify

---

## Pattern #28: Review Pattern

**Category**: Multi-Agent
**Platform**: Antigravity IDE
**Learned From**: Code quality workflows

```
┌──────────────┐     ┌──────────────┐
│   Agent 1    │────▶│   Agent 2    │
│   (Coder)    │     │  (Reviewer)  │
└──────────────┘     └──────────────┘
       ▲                    │
       │    Feedback        │
       └────────────────────┘
```

**วิธีใช้**:
1. Agent 1 เขียน code
2. Agent 2 review และให้ feedback
3. Agent 1 แก้ไขตาม feedback
4. วนจนกว่าจะผ่าน review

**When to use**: ต้องการ code quality สูง, critical code

---

## Pattern #29: Test-Driven Pattern

**Category**: Multi-Agent
**Platform**: Antigravity IDE
**Learned From**: TDD workflows

```
┌──────────────┐     ┌──────────────┐
│   Agent 1    │     │   Agent 2    │
│   (Coder)    │     │   (Tester)   │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
   [Code]              [Tests]
       │                    │
       └────────┬───────────┘
                ▼
         [Run Tests]
```

**วิธีใช้**:
1. Agent 1 เขียน implementation
2. Agent 2 เขียน tests
3. ทั้งคู่รันผลลัพธ์ร่วมกัน
4. Agent 1 แก้ไขถ้า test fail

**When to use**: Test coverage สำคัญ, regression testing

---

## Pattern #30: Specialist Pattern

**Category**: Multi-Agent
**Platform**: Antigravity IDE
**Learned From**: Domain-specific tasks

```
┌─────────────────────────────────────────┐
│           Main Agent (Orchestrator)      │
├───────────┬───────────┬────────────────┤
│  UI Agent │ API Agent │ Database Agent │
│   (React) │  (Node)   │   (SQL/ORM)    │
└───────────┴───────────┴────────────────┘
```

**วิธีใช้**:
1. Main Agent รับ requirements
2. แบ่งงานให้ specialist agents
3. แต่ละ agent ใช้ expertise ของตัวเอง
4. Main Agent รวบรวมผลลัพธ์

**When to use**: Full-stack projects, multi-domain tasks

---

> 💡 **Tip**: เริ่มจาก 2 agents ก่อน แล้วค่อยเพิ่มเมื่อคุ้นเคย
