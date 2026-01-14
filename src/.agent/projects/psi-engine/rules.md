# 📏 PSI Engine - Project Rules

> กฎสำหรับ Antigravity เมื่อทำงานกับโปรเจกต์นี้

---

## 🎨 Code Style

- Python: PEP 8 style
- ใช้ type hints
- Docstrings สำหรับทุก function

---

## 📁 File Conventions

- Logs: `logs/` directory
- Config: `.env` file
- Memory: `memory/` directory

---

## 🔧 Development

```bash
# Start server
python app.py

# With debug
flask --debug run
```

---

## ⚠️ Important Notes

1. **Non-existent terminal ≠ busy** - return `float('inf')` for idle
2. **Use non-blocking PTY reads** - with `select.select()`
3. **Buffer all terminal output** - อย่า read เร็วเกินไป
4. **Handle Windows vs Linux** PTY differences

---

## 📚 Related Knowledge

- Solution #3: Terminal Display Blank
- Solution #4: Agent Busy False Positive
- Lesson #2: Non-Existent ≠ Busy
- Lesson #3: Buffer PTY Output Properly
