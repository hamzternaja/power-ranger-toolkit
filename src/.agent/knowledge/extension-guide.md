# 🔌 Extension Development Guide

> บทเรียน, Patterns และ Snippets สำหรับพัฒนา Extensions (Browser, VS Code, Antigravity)

---

## 📚 Lessons

### Lesson: VS Code Extension Activation Events

**Problem:** Extension ไม่ทำงานเมื่อเปิดไฟล์

**Solution:**
```json
// package.json
{
  "activationEvents": [
    "onLanguage:javascript",
    "onCommand:myExtension.start",
    "onStartupFinished"
  ]
}
```

**Tips:**
- ใช้ `*` เพื่อ activate ทันที (แต่ไม่แนะนำ - ช้า)
- ใช้ `onStartupFinished` แทนถ้าต้อง activate เร็ว

---

### Lesson: Browser Extension Manifest V3

**Changes จาก V2:**
- `background.scripts` → `background.service_worker`
- `webRequestBlocking` → `declarativeNetRequest`
- Persistent background pages ถูก remove

```json
// manifest.json (V3)
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0",
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage", "tabs", "activeTab"],
  "host_permissions": ["<all_urls>"]
}
```

---

### Lesson: Content Script Isolation

**Problem:** Content script ไม่เห็น window variables ของ page

**Solution - Script Injection:**
```javascript
// content.js
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
script.onload = () => script.remove();
document.head.appendChild(script);

// Remember to add to web_accessible_resources
```

**manifest.json:**
```json
{
  "web_accessible_resources": [{
    "resources": ["injected.js"],
    "matches": ["<all_urls>"]
  }]
}
```

---

### Lesson: CDP (Chrome DevTools Protocol) Integration

**Use Case:** Auto-Accept extension ใช้ CDP เพื่อ inject script

```javascript
// Get debugger URL
const response = await fetch('http://localhost:9222/json');
const pages = await response.json();
const targetPage = pages.find(p => p.title.includes('Antigravity'));

// Connect via WebSocket
const ws = new WebSocket(targetPage.webSocketDebuggerUrl);
ws.onopen = () => {
    ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: 'console.log("Injected!")' }
    }));
};
```

---

### Lesson: Extension Storage Best Practices

```javascript
// Use chrome.storage instead of localStorage
// Supports sync across devices

// Save
chrome.storage.sync.set({ key: 'value' }, () => {
    console.log('Saved');
});

// Load
chrome.storage.sync.get(['key'], (result) => {
    console.log('Value: ' + result.key);
});

// Storage types:
// - sync: 100KB limit, syncs across devices
// - local: 5MB limit, local only
// - session: cleared when browser closes (V3 only)
```

---

## 🎨 Patterns

### Pattern: Extension Message Passing

```javascript
// Content Script -> Background
chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
    console.log('Response:', response);
});

// Background -> Content Script
chrome.tabs.sendMessage(tabId, { action: 'doSomething' }, (response) => {
    console.log('Response:', response);
});

// Listener (in background.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getData') {
        sendResponse({ data: 'Hello from background!' });
    }
    return true; // Keep channel open for async response
});
```

---

### Pattern: Long-lived Connection

```javascript
// Content Script
const port = chrome.runtime.connect({ name: 'myChannel' });
port.postMessage({ type: 'init' });
port.onMessage.addListener((msg) => {
    console.log('Received:', msg);
});

// Background Script
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'myChannel') {
        port.onMessage.addListener((msg) => {
            port.postMessage({ type: 'response', data: 'ok' });
        });
    }
});
```

---

### Pattern: DOM Mutation Observer

```javascript
// Watch for DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element
                checkForButton(node);
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
```

---

### Pattern: Auto-Click with Pointer Events

```javascript
// For custom buttons that don't respond to click()
function robustClick(element) {
    // Standard click
    element.click();
    
    // Pointer events (for React/Vue components)
    element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    
    // Mouse events (fallback)
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
}
```

---

### Pattern: Wait for Element to Appear

```javascript
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        
        const observer = new MutationObserver((mutations, obs) => {
            const el = document.querySelector(selector);
            if (el) {
                obs.disconnect();
                resolve(el);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error('Element not found: ' + selector));
        }, timeout);
    });
}

// Usage
const button = await waitForElement('button.accept');
```

---

## 📋 Snippets

### Snippet: Extension Boilerplate (Browser)

```javascript
// manifest.json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0",
  "permissions": ["storage", "activeTab"],
  "background": { "service_worker": "background.js" },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }],
  "action": { "default_popup": "popup.html" }
}
```

---

### Snippet: VS Code Extension Boilerplate

```javascript
// extension.js
const vscode = require('vscode');

function activate(context) {
    const disposable = vscode.commands.registerCommand('myExtension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
```

---

### Snippet: Inject CSS

```javascript
function injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return style;
}

injectCSS(`
    .my-class { color: red; }
    #my-button { background: blue; }
`);
```

---

### Snippet: Create Floating Panel

```javascript
function createFloatingPanel() {
    const panel = document.createElement('div');
    panel.id = 'my-extension-panel';
    panel.innerHTML = `
        <div style="position:fixed;top:10px;right:10px;z-index:99999;
                    background:#1a1a2e;padding:16px;border-radius:8px;
                    box-shadow:0 4px 20px rgba(0,0,0,0.3);">
            <h3 style="color:#fff;margin:0 0 10px 0;">My Extension</h3>
            <button id="my-btn">Click Me</button>
        </div>
    `;
    document.body.appendChild(panel);
    
    document.getElementById('my-btn').addEventListener('click', () => {
        console.log('Button clicked!');
    });
    
    return panel;
}
```

---

### Snippet: Check if Extension Context Valid

```javascript
// Browser Extension
function isContextValid() {
    try {
        return !!chrome.runtime?.id;
    } catch (e) {
        return false;
    }
}

// Run only if context valid
if (isContextValid()) {
    startExtension();
} else {
    console.log('Extension context invalidated, please reload');
}
```

---

### Snippet: Storage with Default Values

```javascript
async function getSettings() {
    const defaults = {
        enabled: true,
        interval: 1000,
        sound: 'default'
    };
    
    const stored = await chrome.storage.sync.get(defaults);
    return { ...defaults, ...stored };
}

async function saveSettings(settings) {
    await chrome.storage.sync.set(settings);
}
```

---

### Snippet: Badge Counter

```javascript
// Set badge text
chrome.action.setBadgeText({ text: '42' });

// Set badge color
chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });

// Clear badge
chrome.action.setBadgeText({ text: '' });
```

---

### Snippet: Context Menu

```javascript
// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'myMenu',
        title: 'Do Something',
        contexts: ['selection', 'page']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'myMenu') {
        console.log('Selected text:', info.selectionText);
    }
});
```

---

### Snippet: Tab Management

```javascript
// Get current tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    console.log('Current URL:', currentTab.url);
});

// Create new tab
chrome.tabs.create({ url: 'https://example.com' });

// Execute script in tab
chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => document.title
});
```

---

### Snippet: Keyboard Shortcut

```json
// manifest.json
{
  "commands": {
    "toggle-feature": {
      "suggested_key": { "default": "Ctrl+Shift+Y" },
      "description": "Toggle feature on/off"
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

---

> 💡 **Best Practices:**
> - ใช้ service workers แทน background pages (V3)
> - Handle extension context invalidation
> - Use chrome.storage แทน localStorage
> - Minimize permissions requested
> - Test with both enabled and disabled states
