# 🔓 Chrome Extension Advanced Secrets & Bypass Techniques

> เทคนิคลับๆ ที่คนส่วนใหญ่ไม่รู้ และวิธี bypass ข้อจำกัดต่างๆ
> ⚠️ ใช้อย่างรับผิดชอบ - บางเทคนิคอาจขัดกับนโยบาย Chrome Web Store

---

## 📑 Table of Contents

1. [CSP (Content Security Policy) Bypass](#-csp-bypass-techniques)
2. [Service Worker Persistence Hacks](#-service-worker-persistence-hacks)
3. [Access Page Context & Variables](#-access-page-context--variables)
4. [Remote Code Execution Workarounds](#-remote-code-execution-workarounds)
5. [Anti-Detection Techniques](#-anti-detection-techniques)
6. [Hidden Chrome APIs & Pages](#-hidden-chrome-apis--pages)
7. [DevTools Secret Features](#-devtools-secret-features)
8. [Framework Internals Access](#-framework-internals-access-reactvue)
9. [Network Interception Tricks](#-network-interception-tricks)
10. [Debugging Hacks](#-debugging-hacks)

---

## 🔓 CSP Bypass Techniques

### 1. Remove CSP Headers via webRequest API

```javascript
// background.js (Manifest V2)
chrome.webRequest.onHeadersReceived.addListener(
    (details) => {
        return {
            responseHeaders: details.responseHeaders.filter(header => 
                !['content-security-policy', 'x-frame-options', 'x-content-security-policy']
                    .includes(header.name.toLowerCase())
            )
        };
    },
    { urls: ['<all_urls>'] },
    ['blocking', 'responseHeaders']
);
```

### 2. Use Background Script as Proxy

Content scripts ถูกจำกัดโดย CSP ของ page แต่ background script ไม่ถูกจำกัด:

```javascript
// content.js - ส่ง request ผ่าน background
async function bypassedFetch(url) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { action: 'fetch', url },
            (response) => resolve(response.data)
        );
    });
}

// background.js - ทำ request จริง (ไม่ถูก CSP block)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'fetch') {
        fetch(msg.url)
            .then(r => r.text())
            .then(data => sendResponse({ data }));
        return true; // Keep channel open
    }
});
```

### 3. iframe Sandbox Injection

```javascript
// สร้าง iframe ที่มี CSP ต่างจาก parent
function createSandboxedFrame(code) {
    const iframe = document.createElement('iframe');
    iframe.srcdoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval'">
        </head>
        <body>
            <script>${code}</script>
        </body>
        </html>
    `;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    return iframe;
}
```

---

## ⏰ Service Worker Persistence Hacks

### 1. Keep-Alive via Alarms

```javascript
// background.js - ป้องกัน service worker หยุดทำงาน
chrome.alarms.create('keep-alive', { periodInMinutes: 0.5 }); // ทุก 30 วินาที

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keep-alive') {
        // Do nothing - just wake up
        console.log('Ping to stay alive:', new Date().toISOString());
    }
});
```

### 2. Port Connection Trick (Infinite Keep-Alive)

```javascript
// content.js - สร้าง connection ค้างไว้
let port = null;

function maintainConnection() {
    port = chrome.runtime.connect({ name: 'keepalive' });
    port.onDisconnect.addListener(() => {
        // Re-connect ทันทีที่ disconnect
        setTimeout(maintainConnection, 1000);
    });
}

maintainConnection();
```

```javascript
// background.js
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'keepalive') {
        // Hold connection - SW will stay alive
        port.onMessage.addListener(() => {});
    }
});
```

### 3. Self-Messaging Loop

```javascript
// background.js - ส่ง message ให้ตัวเอง
function stayAlive() {
    setTimeout(() => {
        chrome.runtime.sendMessage({ type: 'ping' }, () => {
            if (chrome.runtime.lastError) {
                // Extension reloaded, restart
                return;
            }
            stayAlive();
        });
    }, 25000); // < 30 sec timeout
}

stayAlive();
```

### 4. State Persistence (Storage)

```javascript
// background.js - บันทึก state ก่อน terminate
let state = { count: 0, data: [] };

// Load state on startup
chrome.storage.session.get(['state'], (result) => {
    if (result.state) state = result.state;
});

// Save state periodically
setInterval(() => {
    chrome.storage.session.set({ state });
}, 5000);

// Save on unload (may not always fire)
self.addEventListener('beforeunload', () => {
    chrome.storage.session.set({ state });
});
```

---

## 🔍 Access Page Context & Variables

### 1. Script Injection (Main World)

```javascript
// content.js - inject เข้าไปใน page context
function injectToMainWorld(func) {
    const script = document.createElement('script');
    script.textContent = `(${func.toString()})()`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

injectToMainWorld(() => {
    // ทำงานใน page context - เข้าถึง window ของ page ได้
    window.__EXTENSION_DATA__ = {
        token: window.authToken,
        user: window.currentUser
    };
    
    // ส่งกลับไป content script
    window.postMessage({ 
        type: 'FROM_PAGE', 
        data: window.__EXTENSION_DATA__ 
    }, '*');
});

// รับ data กลับมา
window.addEventListener('message', (event) => {
    if (event.data.type === 'FROM_PAGE') {
        console.log('Got page data:', event.data.data);
    }
});
```

### 2. Execute in MAIN World (Manifest V3)

```json
// manifest.json
{
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "world": "MAIN"
  }]
}
```

หรือ inject แบบ dynamic:

```javascript
// background.js
chrome.scripting.executeScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: () => {
        // Run in page context
        return window.someVariable;
    }
});
```

### 3. Hook Page Functions

```javascript
// inject.js (run in MAIN world)
(function() {
    // Hook fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        console.log('[Extension] Fetch intercepted:', args[0]);
        return originalFetch.apply(this, args);
    };
    
    // Hook XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        console.log('[Extension] XHR:', method, url);
        return originalOpen.apply(this, arguments);
    };
    
    // Hook WebSocket
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log('[Extension] WebSocket:', url);
        const ws = new OriginalWebSocket(url, protocols);
        
        const originalSend = ws.send.bind(ws);
        ws.send = (data) => {
            console.log('[Extension] WS send:', data);
            originalSend(data);
        };
        
        return ws;
    };
})();
```

### 4. Access via Custom Events

```javascript
// inject.js (page context)
document.addEventListener('ext-request', (event) => {
    const { action, path } = event.detail;
    
    if (action === 'getVariable') {
        // Navigate to nested path
        let value = window;
        for (const key of path.split('.')) {
            value = value?.[key];
        }
        
        document.dispatchEvent(new CustomEvent('ext-response', {
            detail: { value, path }
        }));
    }
});

// content.js
function getPageVariable(path) {
    return new Promise((resolve) => {
        const handler = (event) => {
            if (event.detail.path === path) {
                document.removeEventListener('ext-response', handler);
                resolve(event.detail.value);
            }
        };
        document.addEventListener('ext-response', handler);
        
        document.dispatchEvent(new CustomEvent('ext-request', {
            detail: { action: 'getVariable', path }
        }));
    });
}

// Usage
const token = await getPageVariable('__NEXT_DATA__.props.pageProps.token');
```

---

## 💻 Remote Code Execution Workarounds

### 1. Sandbox Page Method

```json
// manifest.json
{
  "sandbox": {
    "pages": ["sandbox.html"]
  }
}
```

```html
<!-- sandbox.html -->
<!DOCTYPE html>
<html>
<head>
    <script src="sandbox.js"></script>
</head>
<body></body>
</html>
```

```javascript
// sandbox.js - Can use eval!
window.addEventListener('message', (event) => {
    if (event.data.type === 'EXECUTE') {
        try {
            const result = eval(event.data.code);
            event.source.postMessage({ type: 'RESULT', result }, '*');
        } catch (error) {
            event.source.postMessage({ type: 'ERROR', error: error.message }, '*');
        }
    }
});
```

```javascript
// background.js
function executeRemoteCode(code) {
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.src = chrome.runtime.getURL('sandbox.html');
        iframe.style.display = 'none';
        
        window.addEventListener('message', function handler(event) {
            if (event.data.type === 'RESULT' || event.data.type === 'ERROR') {
                window.removeEventListener('message', handler);
                iframe.remove();
                resolve(event.data);
            }
        });
        
        iframe.onload = () => {
            iframe.contentWindow.postMessage({ type: 'EXECUTE', code }, '*');
        };
        
        document.body.appendChild(iframe);
    });
}
```

### 2. Config-Driven Features

```javascript
// แทนที่จะ load remote code ให้ load config แทน
async function loadRemoteConfig() {
    const response = await fetch('https://api.example.com/config.json');
    const config = await response.json();
    
    // Execute features based on config
    if (config.features.darkMode) enableDarkMode();
    if (config.features.adBlock) enableAdBlock(config.adBlockRules);
}
```

### 3. Web Worker for Heavy Computation

```javascript
// background.js
const worker = new Worker(chrome.runtime.getURL('worker.js'));

worker.postMessage({ type: 'COMPUTE', data: heavyData });
worker.onmessage = (event) => {
    console.log('Result:', event.data);
};
```

---

## 👻 Anti-Detection Techniques

### 1. Hide Extension from Page

Websites สามารถ detect extensions ผ่าน web_accessible_resources:

```javascript
// ป้องกันโดยไม่ expose resources ที่ไม่จำเป็น
// หรือใช้ dynamic URLs (Manifest V3)
```

```json
// manifest.json - ใช้ dynamic URL
{
  "web_accessible_resources": [{
    "resources": ["inject.js"],
    "matches": ["<all_urls>"],
    "use_dynamic_url": true
  }]
}
```

### 2. Avoid Modification Traces

```javascript
// ทำ DOM changes แบบไม่ทิ้ง trace
function stealthyModify(element, property, value) {
    // Override getter/setter
    Object.defineProperty(element, property, {
        get: () => value,
        configurable: true
    });
}

// แทน element.style.display = 'none'
stealthyModify(element.style, 'display', 'none');
```

### 3. Fingerprint Masking

```javascript
// inject.js - mask canvas fingerprint
const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
HTMLCanvasElement.prototype.toDataURL = function() {
    const ctx = this.getContext('2d');
    if (ctx) {
        const imageData = ctx.getImageData(0, 0, this.width, this.height);
        // Add random noise
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] += Math.floor(Math.random() * 3) - 1;
        }
        ctx.putImageData(imageData, 0, 0);
    }
    return originalToDataURL.apply(this, arguments);
};
```

### 4. Detect Extension Detection

```javascript
// ตรวจจับว่า page พยายาม detect extension
const originalImage = window.Image;
window.Image = function() {
    const img = new originalImage();
    const originalSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    
    Object.defineProperty(img, 'src', {
        set(value) {
            if (value.includes('chrome-extension://')) {
                console.warn('[Extension] Site trying to detect extensions!');
                return;
            }
            originalSrc.set.call(this, value);
        },
        get() {
            return originalSrc.get.call(this);
        }
    });
    
    return img;
};
```

---

## 🔐 Hidden Chrome APIs & Pages

### Secret chrome:// Pages

```
chrome://about              - รายการ pages ทั้งหมด
chrome://flags              - Experimental features
chrome://net-internals     - Network debugging
chrome://gpu               - GPU info
chrome://tracing           - Performance tracing
chrome://memory-internals  - Memory usage
chrome://extensions-internals - Extension details
chrome://serviceworker-internals - Service workers
chrome://blob-internals    - Blob storage
chrome://webrtc-internals  - WebRTC debugging
chrome://media-internals   - Media playback
chrome://indexeddb-internals - IndexedDB
chrome://password-manager-internals - Password manager
chrome://histograms        - Usage statistics
chrome://crashes           - Crash reports
chrome://device-log        - Device logs
chrome://sync-internals    - Sync status
chrome://usb-internals     - USB devices
chrome://bluetooth-internals - Bluetooth info
```

### Undocumented Extension APIs

```javascript
// chrome.debugger - Full DevTools Protocol access
chrome.debugger.attach({ tabId }, '1.3', () => {
    chrome.debugger.sendCommand({ tabId }, 'Network.enable');
    chrome.debugger.sendCommand({ tabId }, 'Runtime.evaluate', {
        expression: 'document.cookie'
    }, (result) => {
        console.log('Cookies:', result);
    });
});

// chrome.tabCapture - Capture tab audio/video
chrome.tabCapture.capture({ audio: true, video: true }, (stream) => {
    // Use MediaRecorder to record
});

// chrome.enterprise.* - Enterprise-only APIs
// chrome.proxy - Proxy settings
// chrome.vpnProvider - VPN functionality
// chrome.documentScan - Document scanning
```

---

## 🔧 DevTools Secret Features

### 1. Command Menu

```
Ctrl/Cmd + Shift + P - Open command menu
```

สามารถเข้าถึง features ที่ซ่อนอยู่ได้

### 2. Design Mode

```javascript
// แก้ไข content ใน page ได้โดยตรง
document.designMode = 'on';
```

### 3. All Console Experiments

```
chrome://flags/#devtools-experiments
```

เปิดแล้วไปที่ DevTools > Settings > Experiments

### 4. Logpoints (ไม่ต้องแก้ code)

Right-click บน line number → Add logpoint

### 5. Override Files Locally

Sources Panel → Overrides → Select folder → Override any file

### 6. Hide Network Requests

```javascript
// ซ่อน request จาก DevTools Network tab
const originalFetch = window.fetch;
window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    return response.clone(); // Clone to hide from DevTools
};
```

---

## ⚛️ Framework Internals Access (React/Vue)

### React Fiber Access

```javascript
// inject.js
function getReactFiber(element) {
    const key = Object.keys(element).find(k => 
        k.startsWith('__reactInternalInstance$') || 
        k.startsWith('__reactFiber$')
    );
    return element[key];
}

function getReactProps(element) {
    const fiber = getReactFiber(element);
    return fiber?.memoizedProps || fiber?.pendingProps;
}

function getReactState(element) {
    const fiber = getReactFiber(element);
    return fiber?.memoizedState;
}

// Usage
const button = document.querySelector('button');
console.log('Props:', getReactProps(button));
console.log('State:', getReactState(button));
```

### Vue Instance Access

```javascript
// inject.js
function getVueInstance(element) {
    // Vue 2
    if (element.__vue__) return element.__vue__;
    
    // Vue 3
    const key = Object.keys(element).find(k => k.startsWith('__vueParentComponent'));
    return element[key]?.ctx;
}

// Usage
const app = document.querySelector('#app');
const vue = getVueInstance(app);
console.log('Data:', vue.$data || vue);
```

### Angular Component Access

```javascript
// inject.js
function getAngularComponent(element) {
    return window.ng?.getComponent(element);
}

function getAngularContext(element) {
    return window.ng?.getContext(element);
}
```

---

## 🌐 Network Interception Tricks

### 1. Modify Response Body

```javascript
// background.js (Manifest V2 with webRequestBlocking)
chrome.webRequest.onCompleted.addListener(
    async (details) => {
        if (details.url.includes('api/data')) {
            // Can't modify here but can track
        }
    },
    { urls: ['<all_urls>'] }
);

// For Manifest V3 - use declarativeNetRequest with transform
```

### 2. Inject Response via Service Worker

```javascript
// inject.js - Hook fetch และ modify response
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
    const response = await originalFetch(url, options);
    
    if (url.includes('api/user')) {
        const data = await response.json();
        // Modify data
        data.premium = true;
        
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: response.headers
        });
    }
    
    return response;
};
```

### 3. Request Interception via Debugger

```javascript
// background.js - Full control via CDP
chrome.debugger.attach({ tabId }, '1.3', () => {
    chrome.debugger.sendCommand({ tabId }, 'Fetch.enable', {
        patterns: [{ urlPattern: '*' }]
    });
});

chrome.debugger.onEvent.addListener((source, method, params) => {
    if (method === 'Fetch.requestPaused') {
        // Modify request or response
        chrome.debugger.sendCommand(source, 'Fetch.continueRequest', {
            requestId: params.requestId,
            // Optionally modify headers, body, etc.
        });
    }
});
```

---

## 🐛 Debugging Hacks

### 1. Debug Service Worker

```javascript
// ใน service worker
console.log = (...args) => {
    // Also send to any open DevTools
    chrome.runtime.sendMessage({ type: 'LOG', args });
    
    // Original log
    self.__console_log?.apply(console, args);
};
self.__console_log = console.log;
```

### 2. Breakpoint on Property Access

```javascript
// หยุด execution เมื่อเข้าถึง property
Object.defineProperty(window, 'sensitiveData', {
    get() {
        debugger; // Breakpoint!
        return this._sensitiveData;
    }
});
```

### 3. Monitor All Events

```javascript
// ติดตาม events ทั้งหมดบน element
function monitorEvents(element) {
    const events = [
        'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
        'keydown', 'keyup', 'keypress', 'focus', 'blur', 'change',
        'submit', 'scroll', 'resize', 'load', 'unload'
    ];
    
    events.forEach(event => {
        element.addEventListener(event, (e) => {
            console.log(`[${event}]`, e);
        }, true);
    });
}
```

### 4. Time Travel Debugging

```javascript
// Record state changes
const stateHistory = [];
const STATE_LIMIT = 100;

function recordState(state) {
    stateHistory.push({
        timestamp: Date.now(),
        state: JSON.parse(JSON.stringify(state))
    });
    
    if (stateHistory.length > STATE_LIMIT) {
        stateHistory.shift();
    }
}

function replayState(index) {
    return stateHistory[index]?.state;
}
```

---

## ⚠️ Important Warnings

1. **Chrome Web Store Policy**: หลายเทคนิคอาจขัดกับนโยบาย - อ่าน [Developer Policy](https://developer.chrome.com/docs/webstore/program-policies/)
2. **Security**: CSP bypass และ remote code execution มีความเสี่ยงด้าน security
3. **Privacy**: การเข้าถึง page variables อาจละเมิดความเป็นส่วนตัวของ user
4. **Stability**: Undocumented APIs อาจเปลี่ยนแปลงโดยไม่แจ้งล่วงหน้า

---

## 📚 Resources

| Resource | Description |
|----------|-------------|
| [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) | Full CDP documentation |
| [Chromium Source](https://chromium.googlesource.com/) | Official source code |
| [Puppeteer](https://pptr.dev/) | CDP automation library |
| [Playwright](https://playwright.dev/) | Cross-browser automation |

---

> 💡 **Pro Tip**: ทดสอบเทคนิคเหล่านี้ใน local development ก่อนเสมอ และระวังเรื่อง security vulnerabilities

**Last Updated:** 2026-01-12
