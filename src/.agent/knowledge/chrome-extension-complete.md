# 🔌 Chrome Extension Complete Knowledge Base

> รวบรวมเทคนิคจาก GitHub, Google, และ open source projects ตั้งแต่อดีตจนถึงปัจจุบัน

---

## 📚 Table of Contents

1. [ประวัติและ Evolution](#-evolution-of-chrome-extensions)
2. [Manifest Versions](#-manifest-versions)
3. [Popular Open Source Extensions](#-popular-open-source-extensions)
4. [Architecture Patterns](#-architecture-patterns)
5. [Security Best Practices](#-security-best-practices)
6. [Performance Optimization](#-performance-optimization)
7. [Common Techniques](#-common-techniques)
8. [Code Snippets](#-code-snippets)
9. [Debugging Tips](#-debugging-tips)
10. [Publishing & Distribution](#-publishing--distribution)

---

## 📜 Evolution of Chrome Extensions

### Timeline

| Year | Version | Key Changes |
|------|---------|-------------|
| 2010 | Manifest V1 | Initial release, basic structure |
| 2012 | Manifest V2 | Background pages, content scripts, CSP |
| 2020 | Manifest V3 | Service workers, declarativeNetRequest, enhanced security |
| 2024 | Manifest V3 | Required for new extensions, V2 deprecated |

### Key Differences V2 → V3

| Feature | Manifest V2 | Manifest V3 |
|---------|-------------|-------------|
| Background | Persistent pages | Service workers (event-driven) |
| Network blocking | webRequest | declarativeNetRequest |
| Remote code | Allowed | Prohibited |
| Host permissions | In permissions | Separate field |
| Action API | browserAction/pageAction | Unified action |

---

## 📋 Manifest Versions

### Manifest V3 Template (2024+)

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "Description here",
  
  "permissions": [
    "storage",
    "tabs",
    "activeTab",
    "alarms",
    "scripting"
  ],
  
  "host_permissions": [
    "<all_urls>"
  ],
  
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "css": ["styles.css"],
    "run_at": "document_idle"
  }],
  
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/16.png",
      "48": "icons/48.png",
      "128": "icons/128.png"
    }
  },
  
  "web_accessible_resources": [{
    "resources": ["injected.js", "assets/*"],
    "matches": ["<all_urls>"]
  }],
  
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Manifest V2 (Legacy)

```json
{
  "manifest_version": 2,
  "name": "Legacy Extension",
  "version": "1.0.0",
  
  "permissions": [
    "storage",
    "tabs",
    "<all_urls>"
  ],
  
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  
  "browser_action": {
    "default_popup": "popup.html"
  },
  
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

---

## 🌟 Popular Open Source Extensions

### จาก GitHub (เรียนรู้ได้)

| Extension | Repository | เทคนิคที่น่าสนใจ |
|-----------|------------|-----------------|
| **uBlock Origin** | gorhill/uBlock | Filter lists, efficient blocking, low memory |
| **Vimium** | philc/vimium | Keyboard navigation, link hints, custom UI |
| **Refined GitHub** | refined-github/refined-github | DOM manipulation, GitHub API |
| **Octotree** | ovity/octotree | Sidebar injection, tree navigation |
| **Dark Reader** | darkreader/darkreader | Dynamic CSS, color inversion |
| **React DevTools** | facebook/react | DevTools panels, debugging |
| **Redux DevTools** | reduxjs/redux-devtools | State management, time travel |
| **Tampermonkey** | nickylaude/userscript-manager | Script injection, sandboxing |

### เทคนิคจาก uBlock Origin

```javascript
// Efficient DOM observation
const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
                processNode(node);
            }
        }
    }
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});
```

### เทคนิคจาก Vimium (Link Hints)

```javascript
// Generate link hints for keyboard navigation
function generateHints() {
    const links = document.querySelectorAll('a, button, input, [role="button"]');
    const hints = 'ASDFGHJKL'.split('');
    
    links.forEach((link, i) => {
        const hint = document.createElement('div');
        hint.className = 'vimium-hint';
        hint.textContent = hints[i % hints.length];
        hint.style.cssText = `
            position: absolute;
            background: #ffd700;
            color: #000;
            padding: 2px 4px;
            font-size: 12px;
            z-index: 99999;
        `;
        
        const rect = link.getBoundingClientRect();
        hint.style.left = rect.left + window.scrollX + 'px';
        hint.style.top = rect.top + window.scrollY + 'px';
        document.body.appendChild(hint);
    });
}
```

---

## 🏗️ Architecture Patterns

### 1. Service Worker (Background) Pattern

```javascript
// background.js - Event-driven architecture
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
    chrome.storage.local.set({ count: 0 });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getData') {
        // Async response
        chrome.storage.local.get(['data'], (result) => {
            sendResponse({ data: result.data });
        });
        return true; // Keep channel open for async
    }
});

// Alarms for scheduled tasks (replace setInterval)
chrome.alarms.create('periodic-task', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'periodic-task') {
        performTask();
    }
});
```

### 2. Content Script ↔ Background Communication

```javascript
// content.js
async function sendToBackground(action, data) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action, data }, resolve);
    });
}

// Usage
const result = await sendToBackground('fetchData', { url: '/api' });
```

```javascript
// background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'fetchData') {
        fetch(msg.data.url)
            .then(r => r.json())
            .then(sendResponse);
        return true;
    }
});
```

### 3. Long-lived Connection (Port)

```javascript
// content.js
const port = chrome.runtime.connect({ name: 'content-channel' });

port.onMessage.addListener((msg) => {
    console.log('From background:', msg);
});

port.postMessage({ type: 'ready' });
```

```javascript
// background.js
const connections = new Map();

chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'content-channel') {
        const tabId = port.sender.tab.id;
        connections.set(tabId, port);
        
        port.onMessage.addListener((msg) => {
            console.log('From content:', msg);
        });
        
        port.onDisconnect.addListener(() => {
            connections.delete(tabId);
        });
    }
});
```

### 4. Inject Script into Page Context

```javascript
// content.js - Access page's window object
function injectScript(file) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(file);
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
}

injectScript('injected.js');

// Communication via postMessage
window.addEventListener('message', (event) => {
    if (event.data.type === 'FROM_PAGE') {
        // Handle message from page context
    }
});
```

```javascript
// injected.js (runs in page context)
window.postMessage({ type: 'FROM_PAGE', data: window.somePageVariable }, '*');
```

---

## 🔒 Security Best Practices

### 1. Principle of Least Privilege

```json
// ❌ Bad - Too many permissions
{
  "permissions": ["<all_urls>", "tabs", "cookies", "webRequest"]
}

// ✅ Good - Only what's needed
{
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["https://specific-site.com/*"]
}
```

### 2. Content Security Policy

```json
// manifest.json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'",
    "sandbox": "sandbox allow-scripts; script-src 'self'"
  }
}
```

### 3. XSS Prevention

```javascript
// ❌ Dangerous - XSS vulnerability
element.innerHTML = userInput;

// ✅ Safe - Use textContent
element.textContent = userInput;

// ✅ Safe - Sanitize if HTML needed
function sanitize(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    
    // Remove dangerous elements
    const scripts = template.content.querySelectorAll('script');
    scripts.forEach(s => s.remove());
    
    return template.content;
}
```

### 4. Validate External Messages

```javascript
// background.js
chrome.runtime.onMessageExternal.addListener(
    (request, sender, sendResponse) => {
        // Validate sender
        const trustedOrigins = [
            'https://trusted-site.com',
            'chrome-extension://known-extension-id'
        ];
        
        if (!trustedOrigins.includes(sender.origin)) {
            console.error('Untrusted sender:', sender.origin);
            return;
        }
        
        // Process trusted message
        handleTrustedMessage(request, sendResponse);
    }
);
```

### 5. Secure Storage

```javascript
// Don't store sensitive data in plain text
async function saveApiKey(key) {
    // Use Web Crypto API to encrypt
    const encrypted = await encryptData(key);
    await chrome.storage.local.set({ apiKey: encrypted });
}

async function getApiKey() {
    const { apiKey } = await chrome.storage.local.get(['apiKey']);
    return await decryptData(apiKey);
}
```

---

## ⚡ Performance Optimization

### 1. Lazy Loading

```javascript
// Load heavy modules only when needed
let heavyModule = null;

async function doHeavyTask() {
    if (!heavyModule) {
        heavyModule = await import('./heavy-module.js');
    }
    return heavyModule.process();
}
```

### 2. Efficient DOM Queries

```javascript
// ❌ Slow - Query every time
function checkElement() {
    const el = document.querySelector('.my-element');
    if (el) processElement(el);
}
setInterval(checkElement, 100);

// ✅ Fast - Use MutationObserver
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.matches?.('.my-element')) {
                processElement(node);
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
```

### 3. Debounce/Throttle

```javascript
// Throttle expensive operations
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

document.addEventListener('scroll', throttle(handleScroll, 100));
```

### 4. Service Worker Persistence

```javascript
// Keep service worker alive for critical operations
async function keepAlive() {
    while (true) {
        await new Promise(r => setTimeout(r, 25000)); // < 30s timeout
        // Ping to stay alive
    }
}

// Or use alarms
chrome.alarms.create('keepalive', { periodInMinutes: 0.5 });
```

---

## 🔧 Common Techniques

### 1. Shadow DOM for CSS Isolation

```javascript
function createIsolatedUI() {
    const host = document.createElement('div');
    const shadow = host.attachShadow({ mode: 'closed' });
    
    shadow.innerHTML = `
        <style>
            /* Styles won't leak to page */
            .panel { background: #1a1a2e; color: white; padding: 16px; }
            button { background: #4CAF50; color: white; border: none; }
        </style>
        <div class="panel">
            <h3>My Extension</h3>
            <button id="action-btn">Click Me</button>
        </div>
    `;
    
    document.body.appendChild(host);
    
    shadow.getElementById('action-btn').addEventListener('click', () => {
        console.log('Clicked!');
    });
    
    return shadow;
}
```

### 2. Intercept Network Requests (V3)

```javascript
// manifest.json
{
  "permissions": ["declarativeNetRequest"],
  "declarative_net_request": {
    "rule_resources": [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules.json"
    }]
  }
}
```

```json
// rules.json
[
  {
    "id": 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "*://*.ads.com/*",
      "resourceTypes": ["script", "image"]
    }
  }
]
```

### 3. Page Context Access via Proxy

```javascript
// injected.js - Access React/Vue internals
const pageData = {
    reactRoot: null,
    vueInstance: null
};

// Hook into React
const originalCreateElement = document.createElement.bind(document);
document.createElement = function(tag) {
    const element = originalCreateElement(tag);
    if (element._reactRootContainer) {
        pageData.reactRoot = element._reactRootContainer;
    }
    return element;
};

// Send to content script
window.postMessage({ type: 'PAGE_DATA', data: pageData }, '*');
```

### 4. Auto-Update Mechanism

```javascript
// Check for updates periodically
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'update') {
        const previousVersion = details.previousVersion;
        const currentVersion = chrome.runtime.getManifest().version;
        
        console.log(`Updated from ${previousVersion} to ${currentVersion}`);
        
        // Show update notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/128.png',
            title: 'Extension Updated',
            message: `Updated to version ${currentVersion}`
        });
    }
});
```

### 5. Tab/Window Manipulation

```javascript
// Get current tab
async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

// Execute script in tab
async function executeInTab(tabId, func, args = []) {
    const results = await chrome.scripting.executeScript({
        target: { tabId },
        func,
        args
    });
    return results[0]?.result;
}

// Usage
const pageTitle = await executeInTab(tabId, () => document.title);
```

---

## 📋 Code Snippets

### Context Menu

```javascript
// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'search-selection',
        title: 'Search "%s"',
        contexts: ['selection']
    });
    
    chrome.contextMenus.create({
        id: 'save-image',
        title: 'Save Image',
        contexts: ['image']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case 'search-selection':
            chrome.tabs.create({
                url: `https://google.com/search?q=${encodeURIComponent(info.selectionText)}`
            });
            break;
        case 'save-image':
            chrome.downloads.download({ url: info.srcUrl });
            break;
    }
});
```

### Badge Counter

```javascript
// Set badge
chrome.action.setBadgeText({ text: '42' });
chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });

// Animate badge
async function animateBadge() {
    const colors = ['#FF0000', '#00FF00', '#0000FF'];
    for (const color of colors) {
        chrome.action.setBadgeBackgroundColor({ color });
        await new Promise(r => setTimeout(r, 500));
    }
}
```

### Keyboard Shortcuts

```json
// manifest.json
{
  "commands": {
    "_execute_action": {
      "suggested_key": { "default": "Ctrl+Shift+Y" }
    },
    "toggle-feature": {
      "suggested_key": { "default": "Alt+T" },
      "description": "Toggle main feature"
    }
  }
}
```

```javascript
// background.js
chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-feature') {
        toggleFeature();
    }
});
```

### Notification

```javascript
chrome.notifications.create('notification-id', {
    type: 'basic',
    iconUrl: 'icons/128.png',
    title: 'Extension Alert',
    message: 'Something happened!',
    buttons: [
        { title: 'Open' },
        { title: 'Dismiss' }
    ]
});

chrome.notifications.onButtonClicked.addListener((id, buttonIndex) => {
    if (buttonIndex === 0) {
        chrome.tabs.create({ url: 'https://example.com' });
    }
    chrome.notifications.clear(id);
});
```

### Download File

```javascript
chrome.downloads.download({
    url: 'https://example.com/file.pdf',
    filename: 'saved-file.pdf',
    saveAs: true
}, (downloadId) => {
    console.log('Download started:', downloadId);
});

// Monitor progress
chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state?.current === 'complete') {
        console.log('Download complete!');
    }
});
```

---

## 🐛 Debugging Tips

### 1. Inspect Extension Pages

- **Popup**: Right-click extension icon → Inspect popup
- **Background**: chrome://extensions → Details → Inspect views: service worker
- **Content Script**: Open DevTools on page → Sources → Content Scripts

### 2. Console Logging

```javascript
// Color-coded logs
console.log('%c[Extension]', 'color: green; font-weight: bold;', message);
console.warn('%c[Warning]', 'color: orange;', message);
console.error('%c[Error]', 'color: red;', message);
```

### 3. Service Worker Debugging

```javascript
// Keep track of service worker lifecycle
self.addEventListener('activate', () => console.log('SW activated'));
self.addEventListener('install', () => console.log('SW installed'));

// Log all messages
chrome.runtime.onMessage.addListener((msg, sender) => {
    console.log('Message from', sender.tab?.id, ':', msg);
});
```

### 4. Debug Storage

```javascript
// View all storage
chrome.storage.local.get(null, (items) => {
    console.table(items);
});

// Monitor storage changes
chrome.storage.onChanged.addListener((changes, area) => {
    console.log(`Storage changed in ${area}:`, changes);
});
```

---

## 📦 Publishing & Distribution

### Chrome Web Store

```
1. Create ZIP of extension (exclude .git, node_modules)
2. Go to Chrome Developer Dashboard
3. Pay one-time $5 registration fee
4. Submit for review (usually 1-3 days)
```

### Self-hosting

```json
// updates.xml
<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='YOUR_EXTENSION_ID'>
    <updatecheck codebase='https://yoursite.com/extension.crx' version='1.0.0' />
  </app>
</gupdate>
```

```json
// manifest.json
{
  "update_url": "https://yoursite.com/updates.xml"
}
```

### Enterprise Distribution

```powershell
# Force install via Group Policy
# Registry path: HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist
"1" = "extension-id;https://yoursite.com/updates.xml"
```

---

## 📚 Resources

| Resource | URL |
|----------|-----|
| Chrome Extension Docs | developer.chrome.com/docs/extensions |
| Awesome WebExtensions | github.com/AuHau/awesome-webextensions |
| Chrome Extension Samples | github.com/AuHau/sample-extensions |
| Manifest V3 Migration | developer.chrome.com/docs/extensions/mv3/intro |

---

> 💡 **Tips:**
> - เริ่มจาก Manifest V3 เสมอ (V2 deprecated)
> - ขอ permissions น้อยที่สุดเท่าที่จำเป็น
> - ใช้ Shadow DOM สำหรับ UI isolation
> - Test บน Chrome และ Edge (Chromium-based)
> - ศึกษาจาก open source extensions บน GitHub

**Last Updated:** 2026-01-12
