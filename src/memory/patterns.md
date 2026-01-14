# 🧠 Memory - Patterns

> Reusable code patterns and best practices

---

## React Patterns

### Custom Hook Template
```typescript
function useCustomHook<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  
  const update = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);
  
  return { value, update };
}
```

### Context Pattern
```typescript
const MyContext = createContext<ContextType | null>(null);

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('useMyContext must be within Provider');
  return context;
}
```

---

_Add your patterns here..._
