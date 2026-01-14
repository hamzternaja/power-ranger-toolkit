# 📏 TikTok Auto-Uploader - Project Rules

> กฎสำหรับ Antigravity เมื่อทำงานกับโปรเจกต์นี้

---

## 🎨 Code Style

- ใช้ ES6+ syntax (arrow functions, destructuring)
- ใช้ `const` และ `let` (ไม่ใช้ `var`)
- ใช้ async/await แทน callbacks

---

## 📁 File Conventions

- Video files: `.mp4`, `.mov`, `.avi`
- Uploaded folder: `/Uploaded/` subdirectory
- Config: `config.json`

---

## 🔧 Development

```bash
# Start server
cd file-server && node server.js

# Watch logs
npm run dev
```

---

## ⚠️ Important Notes

1. **Always exclude `Uploaded/` folder** when scanning for videos
2. **Track upload index per folder** for round-robin
3. **Use try-catch** for all file operations

---

## 📚 Related Knowledge

- Solution #1: Ignore Uploaded Folder
- Solution #2: Round-Robin Upload
- Lesson #1: Always Check Nested Folders
