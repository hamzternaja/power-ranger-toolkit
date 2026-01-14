# ✂️ Memory - Snippets

> Reusable code snippets

---

## Utility Functions

### Debounce
```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

### Format Date
```typescript
const formatDate = (date: Date) => 
  new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
```

---

_Add your snippets here..._
