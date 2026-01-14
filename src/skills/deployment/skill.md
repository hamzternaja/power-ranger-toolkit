---
name: deployment
description: Build, package, and deploy applications including CI/CD, release processes, and distribution. Use when preparing applications for production or distribution.
---

# 🚀 Deployment Skill

## Build Processes

### Node.js / Vite
```bash
# Install deps
npm ci

# Build production
npm run build

# Output in dist/
```

### Python
```bash
# Create virtual env
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install deps
pip install -r requirements.txt

# Package
pip install pyinstaller
pyinstaller --onefile app.py
```

---

## Chrome Extension Packaging

### Build
```bash
# 1. Update version in manifest.json
# 2. Create zip
zip -r extension.zip manifest.json *.js *.html icons/
```

### Manual Install
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select extension folder

### Chrome Web Store
1. Create developer account ($5)
2. Upload zip to dashboard
3. Fill in listing details
4. Submit for review

---

## Electron Packaging

### electron-builder
```json
{
  "build": {
    "appId": "com.example.app",
    "productName": "TitanMirror",
    "win": {
      "target": ["nsis", "portable"],
      "icon": "icons/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "icons/icon.icns"
    },
    "files": [
      "main/**/*",
      "renderer/**/*",
      "node_modules/**/*"
    ]
  }
}
```

```bash
# Build for current platform
npm run build

# Build for Windows
npx electron-builder --win

# Build for all platforms
npx electron-builder --win --mac --linux
```

---

## Android APK

### Debug Build
```bash
./gradlew assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk
```

### Release Build
```bash
# 1. Create keystore
keytool -genkey -v -keystore release-key.keystore -alias my-key -keyalg RSA

# 2. Build signed APK
./gradlew assembleRelease

# Or use Android Studio: Build > Generate Signed Bundle/APK
```

---

## CI/CD (GitHub Actions)

### Build & Test
```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - run: npm ci
      - run: npm test
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

### Auto Release
```yaml
release:
  needs: build
  runs-on: ubuntu-latest
  if: startsWith(github.ref, 'refs/tags/v')
  steps:
    - uses: actions/download-artifact@v4
    - uses: softprops/action-gh-release@v1
      with:
        files: dist/*
```

---

## Version Bumping

### Semantic Versioning
```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1  (patch: bug fix)
1.0.1 → 1.1.0  (minor: new feature)
1.1.0 → 2.0.0  (major: breaking change)
```

### npm version
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.1 → 1.1.0
npm version major  # 1.1.0 → 2.0.0
```

---

## Deployment Checklist

- [ ] Version number updated
- [ ] Changelog updated
- [ ] Tests passing
- [ ] Build successful
- [ ] No console.log/debug code
- [ ] Secrets not in code
- [ ] README updated
- [ ] Tagged in git
