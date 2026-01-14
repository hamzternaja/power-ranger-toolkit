# 📏 TitanMirror - Project Rules

> กฎสำหรับ Antigravity เมื่อทำงานกับโปรเจกต์นี้

---

## 🎨 Code Style

- Desktop: Modern JavaScript (ES6+)
- Android: Kotlin preferred
- ใช้ async/await

---

## 📁 File Conventions

- Desktop app: `desktop/`
- Android app: `android/`
- Shared: `shared/`

---

## 🔧 Development

```bash
# Desktop
cd desktop && npm run dev

# Android
./gradlew assembleDebug
```

---

## ⚠️ Important Notes

1. **Always show connection feedback** - loading, timeout, error
2. **Handle multiple connection methods** - USB, WiFi, QR
3. **Test on real devices** - emulator ไม่เหมือน device จริง

---

## 📚 Related Knowledge

- Lesson #4: Connection Timeouts Need Feedback
- Pattern #5: Async with Timeout
